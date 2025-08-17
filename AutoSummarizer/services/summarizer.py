import google.generativeai as genai
from config import GOOGLE_API_KEY

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_summary(text: str) -> str:
    prompt = f"Summarize the following text in bullet points:\n{text}"
    response = model.generate_content(prompt)
    return response.text if hasattr(response, "text") else ""
