from uvicorn import run
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from util.conf import get_conf
from util.data_model import ContentType, PodcastReq, PodcastRes, BaseRes, UserRes, PodcastListRes
from util.db import handle_user, handle_gen_podcast, get_all_podcasts
from app.extraction import extract_text_from_url


conf = get_conf()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount("/data", StaticFiles(directory="data"), name="data")


@app.get("/")
def api_home() -> BaseRes:
    return BaseRes(
        success=True,
        message="welcome to audist, open http://127.0.0.1:9999/docs"
    )


@app.get("/login/{email}")
def api_login(email) -> UserRes:
    user_id = handle_user(email)
    return UserRes(
        email=email,
        user_id=user_id
    )


@app.get("/podcast/{user_id}", tags=["podcasts"])
def create_podcast_request(user_id) -> PodcastListRes:
    podcasts = get_all_podcasts(user_id=user_id)
    return PodcastListRes(podcasts=podcasts)


@app.post("/podcast", tags=["podcasts"])
def create_podcast_request(podcast_req: PodcastReq) -> PodcastRes:
    print(podcast_req)
    podcast_req.origin_content = podcast_req.content
    if podcast_req.content_type == ContentType.url:
        podcast_req.content = extract_text_from_url(podcast_req.content)

    return handle_gen_podcast(podcast_req)


@app.post("/podcast", tags=["podcasts"])
def create_podcast_request(podcast_req: PodcastReq) -> PodcastRes:
    print(podcast_req)
    podcast_req.origin_content = podcast_req.content
    if podcast_req.content_type == ContentType.url:
        podcast_req.content = extract_text_from_url(podcast_req.content)

    return handle_gen_podcast(podcast_req)



if __name__ == '__main__':
    run("server.main:app", **conf["server"]["run"])
