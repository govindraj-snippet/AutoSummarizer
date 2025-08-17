from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from config import GOOGLE_API_KEY, CHROMA_DB_DIR, MAX_CHUNK_SIZE

def chunk_text(text: str):
    splitter = RecursiveCharacterTextSplitter(chunk_size=MAX_CHUNK_SIZE, chunk_overlap=100)
    return splitter.split_text(text)

def store_embeddings(chunks: list):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)
    vectorstore = Chroma(persist_directory=CHROMA_DB_DIR, embedding_function=embeddings)
    vectorstore.add_texts(chunks)
    return True
