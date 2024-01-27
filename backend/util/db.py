import datetime

from sqlalchemy import Column, DateTime, Enum, Integer, String, Text, create_engine, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.summary import gen_podcast
from app.tts import gen_tts
from util.data_model import ContentType, PodcastReq, PodcastRes
from util.conf import get_conf

conf = get_conf()

engine = create_engine(conf["db"]["sqlite_uri"])
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, index=True)
    json_obj = Column(String, default="")


# Podcast Request Model
class PodcastRequest(Base):
    __tablename__ = "podcast_requests"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer)
    content = Column(Text)
    origin_content = Column(Text)
    content_type = Column(Enum(ContentType))
    creation_time = Column(DateTime, default=datetime.datetime.utcnow)
    json_obj = Column(String, default="")


# Podcast Model
class Podcast(Base):
    __tablename__ = "podcasts"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer)
    title = Column(String)
    podcast_text = Column(Text)
    summary_text = Column(Text)
    audio_file_url = Column(String)
    summary_audio_file_url = Column(String)
    creation_time = Column(DateTime, default=datetime.datetime.utcnow)
    completion_time = Column(DateTime, default=datetime.datetime.utcnow)
    json_obj = Column(String, default="")

    def __repr__(self):
        return f"<Podcast {self.id} - {self.title}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "podcast_text": self.podcast_text,
            "summary_text": self.summary_text,
            "audio_file_url": self.audio_file_url,
            "summary_audio_file_url": self.summary_audio_file_url,
            "creation_time": self.creation_time,
            "completion_time": self.completion_time,
            "json_obj": self.json_obj,
        }


Base.metadata.create_all(bind=engine)


def handle_user(email: str) -> int:
    with SessionLocal() as session:
        user = session.query(User).filter(User.email == email).one_or_none()
        if user is not None:
            return user.id
        else:
            new_user = User(email=email)
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            return new_user.id


def handle_gen_podcast(podcast_req: PodcastReq) -> PodcastRes:
    start_time = datetime.datetime.utcnow()
    podcast_request = PodcastRequest(**podcast_req.model_dump())

    podcast = gen_podcast(podcast_request.content)
    summary_audio_url = gen_tts(text=podcast["summary"])

    podcast_dto = {
        "user_id": podcast_request.user_id,
        "podcast_text": podcast_request.content,
        "creation_time": start_time,
        "completion_time": datetime.datetime.utcnow(),
        "title": podcast["title"],
        "summary_text": podcast["summary"],
        "audio_file_url": "",
        "summary_audio_file_url": summary_audio_url,
    }

    with SessionLocal() as session:
        new_podcast = Podcast(**podcast_dto)
        session.add(new_podcast)

        session.add(podcast_request)
        session.commit()
        session.refresh(new_podcast)

    print(new_podcast.to_dict())
    return PodcastRes(podcast=new_podcast.to_dict())


def get_all_podcasts(user_id):
    with SessionLocal() as db:
        return [podcast.to_dict()
                for podcast in db.query(Podcast)
                .filter_by(user_id=user_id).order_by(desc(Podcast.creation_time)).all()]
