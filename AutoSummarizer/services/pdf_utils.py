import fitz  # PyMuPDF

def extract_text_from_pdf(file_stream):
    pdf = fitz.open(stream=file_stream.read(), filetype="pdf")
    text = ""
    for page in pdf:
        text += page.get_text()
    return text
