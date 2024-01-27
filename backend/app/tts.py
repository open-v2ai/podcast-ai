from uuid import uuid4

from openai import OpenAI

from util.conf import get_conf

conf = get_conf()
client = OpenAI(api_key=conf["openai"]["api_key"])


def gen_tts(text):
    response = client.audio.speech.create(
        model="tts-1",
        voice="nova",
        input=text
    )
    save_path = f"./data/{str(uuid4())}.mp3"
    response.stream_to_file(save_path)
    return save_path
