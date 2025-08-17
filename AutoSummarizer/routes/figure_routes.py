from fastapi import APIRouter, UploadFile, File
from services import image_utils, figure_captioner

router = APIRouter()

@router.post("/caption")
async def caption_figure(file: UploadFile = File(...)):
    image_bytes = await file.read()
    processed_image = image_utils.preprocess_image_bytes(image_bytes)
    caption = figure_captioner.generate_caption(processed_image)
    return {"caption": caption}
