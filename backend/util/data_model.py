from enum import Enum
from datetime import datetime

from pydantic import BaseModel


class ContentType(Enum):
    text = "text"
    url = "url"


class BaseRes(BaseModel):
    success: bool = True
    message: str = ""


class UserRes(BaseRes):
    email: str
    user_id: int


class PodcastReq(BaseModel):
    user_id: int
    content: str
    content_type: ContentType = ContentType.text
    origin_content: str = ""


class Podcast(BaseModel):
    id: int
    title: str = ""
    podcast_text: str = ""
    summary_text: str = ""
    audio_file_url: str = ""
    summary_audio_file_url: str = ""
    creation_time: datetime = None
    completion_time: datetime = None
    json_obj: str = ""


class PodcastRes(BaseRes):
    podcast: Podcast


class PodcastListRes(BaseRes):
    podcasts: list[Podcast]
