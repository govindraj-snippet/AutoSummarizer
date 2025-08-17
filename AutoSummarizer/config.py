import os
from dotenv import load_dotenv

load_dotenv()

# Google API Key for Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# ChromaDB directory
CHROMA_DB_DIR = os.getenv("CHROMA_DB_DIR", "./chroma_db")

# Tesseract languages
TESSERACT_LANGS = "eng"

# Max chunk size for text splitting
MAX_CHUNK_SIZE = 1000
