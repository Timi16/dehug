from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class TextGenerationParams(BaseModel):
    temperature: float = Field(default=0.8, ge=0.1, le=2.0)
    max_length: int = Field(default=100, ge=10, le=1000)
    top_p: float = Field(default=0.9, ge=0.1, le=1.0)
    top_k: int = Field(default=50, ge=1, le=100)
    do_sample: bool = True

class TextClassificationParams(BaseModel):
    max_length: int = Field(default=128, ge=10, le=512)
    return_all_scores: bool = False

class ImageClassificationParams(BaseModel):
    confidence_threshold: float = Field(default=0.5, ge=0.1, le=1.0)
    top_k: int = Field(default=5, ge=1, le=10)

class SpeechRecognitionParams(BaseModel):
    language: str = Field(default="auto")
    return_timestamps: bool = False

class InferenceRequest(BaseModel):
    model_hash: str
    task: str
    input_text: str
    parameters: Optional[Dict[str, Any]] = Field(default_factory=dict)


class ModelInfo(BaseModel):
    hash: str
    task: str
    status: Optional[str] = None
    cached: bool
    size_mb: Optional[float] = None
    last_used: Optional[datetime] = None


class InferenceResponse(BaseModel):
    success: bool
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    model_info: Optional[ModelInfo] = None
    processing_time: Optional[float] = None
    request_id: str
