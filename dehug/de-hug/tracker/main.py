from fastapi import FastAPI
from app.routes import router
from app.models import Base
from app.db import engine
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Download Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)
app.include_router(router)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
    )