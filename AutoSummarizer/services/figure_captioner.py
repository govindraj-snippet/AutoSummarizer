import base64
from PIL import Image
import io
import google.generativeai as genai
from config import GOOGLE_API_KEY

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_caption(image_bytes: bytes) -> str:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    image_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")

    prompt = "Describe the figure in detail."
    response = model.generate_content([prompt, {"mime_type": "image/png", "data": image_base64}])
    return response.text if hasattr(response, "text") else ""
