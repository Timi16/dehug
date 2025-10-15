from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DownloadEventCreate(BaseModel):
    item_name: str
    source: str  # 'sdk' or 'ui'
    user_id: Optional[str] = None


class DownloadStatsResponse(BaseModel):
    item_name: str
    sdk: int
    ui: int
    total: int
