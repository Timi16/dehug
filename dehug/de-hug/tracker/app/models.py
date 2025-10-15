from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base


class Entry(Base):
    __tablename__ = "entries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    description = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)
    filename = Column(String)

    total_downloads = Column(Integer, default=0)
    download_count_sdk = Column(Integer, default=0)
    download_count_ui = Column(Integer, default=0)

    download_events = relationship("DownloadEvent", back_populates="model")


class DownloadEvent(Base):
    __tablename__ = "download_events"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String)
    source = Column(String)     # 'sdk' or 'ui'
    user_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    model_id = Column(Integer, ForeignKey("entries.id"), nullable=True)
    model = relationship("Entry", back_populates="download_events")
