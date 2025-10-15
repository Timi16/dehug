from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .db import SessionLocal
from .models import DownloadEvent, Entry
from .schemas import DownloadEventCreate
from collections import defaultdict

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/track/download")
def track_download(event: DownloadEventCreate, db: Session = Depends(get_db)):
    item_name = event.item_name
    model = db.query(Entry).filter_by(name=item_name).first()

    if not model:
        model = Entry(name=item_name, total_downloads=0)
        db.add(model)
        db.commit()
        db.refresh(model)

    download_event = DownloadEvent(item_name=event.item_name, source=event.source)
    db.add(download_event)

    model.total_downloads += 1
    if event.source == "sdk":
        model.download_count_sdk += 1
    elif event.source == "ui":
        model.download_count_ui += 1

    db.commit()
    return {"message": "Download tracked"}


@router.get("/track/stats")
def get_stats(db: Session = Depends(get_db)):
    models = db.query(Entry).all()
    return {
        model.name: {
            "sdk": model.download_count_sdk,
            "ui": model.download_count_ui,
            "total": model.total_downloads
        }
        for model in models
    }
