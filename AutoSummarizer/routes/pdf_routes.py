from fastapi import APIRouter, UploadFile, File
from services import pdf_utils, summarizer, embedding_utils

router = APIRouter()

@router.post("/process-pdf/")  # Make sure this matches your frontend POST URL
async def process_pdf(file: UploadFile = File(...)):
    # Extract text from PDF
    text = pdf_utils.extract_text_from_pdf(file.file)
    
    # Optional: chunk the text for embeddings
    chunks = embedding_utils.chunk_text(text)
    embeddings = embedding_utils.store_embeddings(chunks)
    
    # Generate summary
    summary = summarizer.generate_summary(text)
    
    # Return response
    return {
        "summary": summary,
        "chunks": len(chunks),
        "embeddings_stored": bool(embeddings)
    }
