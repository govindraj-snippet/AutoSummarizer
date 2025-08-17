from fastapi import APIRouter, UploadFile, File, Form
from qna_service import answer_question_from_pdf

router = APIRouter()

@router.post("/pdf-qna")
async def pdf_qna(file: UploadFile = File(...), question: str = Form(...)):
    pdf_bytes = await file.read()
    answer = answer_question_from_pdf(pdf_bytes, question)
    return {"answer": answer}
