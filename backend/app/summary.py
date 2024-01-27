import json
import time

from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

from util.conf import get_conf
from util.log import get_logger

conf = get_conf()
logger = get_logger("app.summary")

sys_prompt = """
You are a professional podcaster, and you will organize podcast for users. Summarize the context user uploaded
- You should use the original language of context to output the summary

# Context
{user_podcast}

# Json
- title: title of the podcast
- summary: Usually its length is around 1/4~1/3 of its original content length. It should not be too short or too long!
- tags: categorize the type of content, less than 5 tags.

Please respond in json:

{
    "title": "",
    "tags": [],
    "summary": ""
}
"""


def gen_podcast(context):
    # number of words should be less than 3000
    words = context.split()
    if len(context) > 3000:
        context = " ".join(words[:3000])

    chat_model = ChatOpenAI(
        model_name="gpt-3.5-turbo-1106",
        openai_api_key=conf["openai"]["api_key"],
        temperature=0.1,
        request_timeout=300,
    ).bind(response_format={"type": "json_object"})

    messages = [
        SystemMessage(content=sys_prompt),
        HumanMessage(content=context)
    ]

    start = time.time()
    model_res = chat_model.invoke(messages).content
    logger.info(model_res)
    logger.info(f"cost: {time.time() - start}")
    return json.loads(model_res)
