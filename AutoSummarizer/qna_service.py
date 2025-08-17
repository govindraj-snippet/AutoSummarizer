import google.generativeai as genai
from services.ocr_service import extract_text_from_pdf_bytes
from config import GEMINI_API_KEY

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

def get_pdf_text(pdf_bytes: bytes) -> str:
    """Extract all text from PDF for QnA purposes."""
    pages = extract_text_from_pdf_bytes(pdf_bytes)
    return "\n".join(pages)

def answer_question_from_pdf(pdf_bytes: bytes, question: str) -> str:
    """Send PDF text + question to Gemini API and get answer."""
    pdf_text = get_pdf_text(pdf_bytes)

    prompt = f"""
    You are a helpful assistant.
    Here is a document:

    {pdf_text}

    Question: {question}

    Please provide a clear answer.
    If possible, cite the page or section number as a reference.
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    return response.text
