from services.ocr_service import summarize_each_page

@router.post("/ocr-summary")
async def ocr_summary(file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    summaries = summarize_each_page(pdf_bytes)
    return {"summaries": summaries}
