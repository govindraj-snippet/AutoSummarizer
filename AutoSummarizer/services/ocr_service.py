import io
from concurrent.futures import ProcessPoolExecutor
from typing import List
import fitz  # PyMuPDF
import numpy as np
import pytesseract
import cv2
from PIL import Image
from transformers import pipeline  # Hugging Face summarizer
from ..config import TESSERACT_LANGS  # Make sure this is in config.py

# Path to Tesseract executable (Windows default path)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Load summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def preprocess_image_bytes(image_bytes: bytes) -> bytes:
    """Make the image clearer for OCR."""
    img_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    processed = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 11, 2
    )
    _, buffer = cv2.imencode(".png", processed)
    return buffer.tobytes()

def ocr_image_bytes(image_bytes: bytes, languages: str = TESSERACT_LANGS) -> str:
    """Read text from an image using Tesseract."""
    image = Image.open(io.BytesIO(image_bytes))
    text = pytesseract.image_to_string(image, lang=languages)
    return text.strip()

def extract_text_from_pdf_bytes(pdf_bytes: bytes, max_workers: int = None) -> List[str]:
    """Get text from each page of a PDF using OCR."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    def process_page(page_index: int) -> str:
        page = doc.load_page(page_index)
        pix = page.get_pixmap(dpi=300)
        img_bytes = pix.tobytes("png")
        processed_bytes = preprocess_image_bytes(img_bytes)
        return ocr_image_bytes(processed_bytes)

    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(process_page, range(len(doc))))

    return results

def summarize_each_page(pdf_bytes: bytes) -> List[str]:
    """Create a short summary for each PDF page."""
    page_texts = extract_text_from_pdf_bytes(pdf_bytes)
    summaries = []
    for i, text in enumerate(page_texts, start=1):
        if text.strip():
            summary = summarizer(text, max_length=100, min_length=30, do_sample=False)[0]['summary_text']
            summaries.append(f"Page {i} Summary:\n{summary}")
        else:
            summaries.append(f"Page {i} Summary:\n(No text found)")
    return summaries
