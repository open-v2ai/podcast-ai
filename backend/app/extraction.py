from langchain_community.document_loaders import AsyncHtmlLoader
from langchain_community.document_transformers import Html2TextTransformer


def extract_text_from_url(urls):
    loader = AsyncHtmlLoader(urls)
    docs = loader.load()
    html2text = Html2TextTransformer()
    docs_transformed = html2text.transform_documents(docs)
    return [doc.page_content for doc in docs_transformed][0]


if __name__ == '__main__':
    urls_dict = {
        "voa": "https://www.voanews.com/a/al-jazeera-to-refer-killing-of-cameraman-in-gaza-to-war-crimes-court"
               "-/7401310.html",
        "blog": "https://lilianweng.github.io/posts/2023-06-23-agent/",
        "pengpai news": "https://www.thepaper.cn/newsDetail_forward_25681738",
        "stackoverflow": "https://stackoverflow.com/questions/77673170/how-do-i-identify-active-users-on-my-nextjs"
                         "-app-using-supabase-auth",
        "wiki": "https://en.wikipedia.org/wiki/England",
        "bbc": "https://www.bbc.com/news/world-middle-east-67740329",
        "wechat": "https://mp.weixin.qq.com/s/9XqctpNBpqbpuKF8QChhQQ"
    }
    for name, url in urls_dict.items():
        try:
            texts = extract_text_from_url(url)
            text = texts[0]
        except Exception as e:
            print(e)
            text = "!!! NOT WORK !!!"
        print(">> ", name, text[1000:2000])

# stackoverflow not work, spider protocol
# https://python.langchain.com/docs/integrations/document_transformers/html2text
