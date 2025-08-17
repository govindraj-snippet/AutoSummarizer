from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import pdf_routes, figure_routes

app = FastAPI(title="Auto-Summarizer & Insights API")

# Allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to your frontend URL like "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(pdf_routes.router, prefix="/pdf", tags=["PDF Processing"])
app.include_router(figure_routes.router, prefix="/figures", tags=["Figure Processing"])

@app.get("/")
def home():
    return {"message": "Auto-Summarizer & Insights API is running"}
