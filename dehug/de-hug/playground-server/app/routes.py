from datetime import datetime
from fastapi import APIRouter, File, UploadFile, HTTPException
from transformers import __version__ as transformers_version
from .schema import (
    InferenceResponse,
    InferenceRequest,
    TextGenerationParams,
    TextClassificationParams,
    ImageClassificationParams,
    SpeechRecognitionParams,
)
from pathlib import Path
from config import MODEL_CACHE_DIR
from .services import (
    load_model,
    run_text_generation,
    run_text_classification,
    get_model_size,
    model_cache,
)
import json
import os
import tempfile
from pathlib import Path
from datetime import datetime
import uuid
from logger import logger
from datetime import datetime

router = APIRouter()


@router.get("/")
async def root():
    return {
        "message": "DeHug Inference API",
        "version": "1.0.0",
        "endpoints": ["/infer", "/models", "/health"],
        "supported_tasks": [
            "text-generation",
            "text-classification",
            "image-classification",
            "speech-recognition",
        ],
    }


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "transformers_version": transformers_version,
        "cached_models": len(model_cache),
    }


@router.get("/models")
async def list_cached_models():
    """List all cached models"""
    models = []
    for cache_key, model_obj in model_cache.items():
        model_hash, task = cache_key.split("_", 1)
        model_path = Path(model_obj["path"])

        models.append(
            {
                "hash": model_hash,
                "task": task,
                "status": "loaded",
                "cached": True,
                "size_mb": get_model_size(model_path),
                "loaded_at": model_obj["loaded_at"].isoformat(),
                "last_used": model_obj["last_used"].isoformat(),
            }
        )

    # Also check disk cache
    cached_dirs = [d for d in Path(MODEL_CACHE_DIR).iterdir() if d.is_dir()]
    for model_dir in cached_dirs:
        model_hash = model_dir.name
        if not any(m["hash"] == model_hash for m in models):
            models.append(
                {
                    "hash": model_hash,
                    "task": "unknown",
                    "status": "cached",
                    "cached": True,
                    "size_mb": get_model_size(model_dir),
                    "loaded_at": None,
                    "last_used": None,
                }
            )

    return {"models": models, "total": len(models)}


@router.post("/infer", response_model=InferenceResponse)
async def run_inference(request: InferenceRequest):
    """Main inference endpoint"""
    request_id = str(uuid.uuid4())
    start_time = datetime.now()

    logger.info(
        f"Inference request {request_id}: {request.model_hash} - {request.task}"
    )

    try:
        # Validate task
        if request.task not in [
            "text-generation",
            "text-classification",
            "image-classification",
            "speech-recognition",
        ]:
            raise HTTPException(
                status_code=400, detail=f"Unsupported task: {request.task}"
            )

        # Load model
        model_obj = await load_model(request.model_hash, request.task)

        # Parse parameters based on task
        if request.task == "text-generation":
            params = TextGenerationParams(**request.parameters)
            if not request.input_text:
                raise HTTPException(
                    status_code=400, detail="input_text is required for text generation"
                )
            result = await run_text_generation(model_obj, request.input_text, params)

        elif request.task == "text-classification":
            params = TextClassificationParams(**request.parameters)
            if not request.input_text:
                raise HTTPException(
                    status_code=400,
                    detail="input_text is required for text classification",
                )
            result = await run_text_classification(
                model_obj, request.input_text, params
            )

        elif request.task == "image-classification":
            # This would require file upload handling - placeholder for now
            raise HTTPException(
                status_code=501,
                detail="Image classification not yet implemented - requires file upload",
            )

        elif request.task == "speech-recognition":
            # This would require file upload handling - placeholder for now
            raise HTTPException(
                status_code=501,
                detail="Speech recognition not yet implemented - requires file upload",
            )

        processing_time = (datetime.now() - start_time).total_seconds()

        logger.info(
            f"Inference request {request_id} completed in {processing_time:.2f}s"
        )

        return InferenceResponse(
            success=True,
            result=result,
            model_info={
                "hash": request.model_hash,
                "task": request.task,
                "cached": True,
            },
            processing_time=processing_time,
            request_id=request_id,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Inference request {request_id} failed: {e}")
        processing_time = (datetime.now() - start_time).total_seconds()

        return InferenceResponse(
            success=False,
            error=str(e),
            processing_time=processing_time,
            request_id=request_id,
        )


@router.post("/infer-with-files")
async def run_inference_with_files(
    model_hash: str, task: str, file: UploadFile = File(...), parameters: str = "{}"
):
    """Inference endpoint for file uploads (images, audio)"""
    request_id = str(uuid.uuid4())
    start_time = datetime.now()

    try:
        params_dict = json.loads(parameters)

        if task == "image-classification":
            # Handle image upload
            if not file.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="File must be an image")

            # Read image
            contents = await file.read()
            with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
                temp_file.write(contents)
                temp_file_path = temp_file.name

            try:
                image = Image.open(temp_file_path)

                # Load model
                model_obj = await load_model(model_hash, task)
                processor = model_obj["processor"]
                model = model_obj["model"]

                # Process image
                inputs = processor(image, return_tensors="pt")

                # Run inference
                with torch.no_grad():
                    outputs = model(**inputs)
                    predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

                # Get top predictions
                params = ImageClassificationParams(**params_dict)
                top_k = min(params.top_k, len(predictions[0]))
                top_predictions = torch.topk(predictions[0], top_k)

                if hasattr(model.config, "id2label"):
                    labels = model.config.id2label
                else:
                    labels = {i: f"LABEL_{i}" for i in range(len(predictions[0]))}

                results = []
                for score, idx in zip(
                    top_predictions.values.tolist(), top_predictions.indices.tolist()
                ):
                    if score >= params.confidence_threshold:
                        results.append({"label": labels[idx], "score": score})

                result = {"predictions": results, "parameters_used": params_dict}

            finally:
                os.unlink(temp_file_path)

        elif task == "speech-recognition":
            # Handle audio upload
            if not file.content_type.startswith("audio/"):
                raise HTTPException(
                    status_code=400, detail="File must be an audio file"
                )

            # Save audio file temporarily
            contents = await file.read()
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(contents)
                temp_file_path = temp_file.name

            try:
                # Load model
                model_obj = await load_model(model_hash, task)
                pipe = model_obj["pipeline"]

                # Process audio
                params = SpeechRecognitionParams(**params_dict)
                result = pipe(
                    temp_file_path, return_timestamps=params.return_timestamps
                )

                result = {"transcription": result, "parameters_used": params_dict}

            finally:
                os.unlink(temp_file_path)

        else:
            raise HTTPException(
                status_code=400, detail=f"Task {task} does not support file upload"
            )

        processing_time = (datetime.now() - start_time).total_seconds()

        return InferenceResponse(
            success=True,
            result=result,
            model_info={"hash": model_hash, "task": task, "cached": True},
            processing_time=processing_time,
            request_id=request_id,
        )

    except Exception as e:
        processing_time = (datetime.now() - start_time).total_seconds()
        return InferenceResponse(
            success=False,
            error=str(e),
            processing_time=processing_time,
            request_id=request_id,
        )


@router.delete("/models/{model_hash}")
async def clear_model_cache(model_hash: str):
    """Clear a specific model from cache"""
    removed_keys = []
    for key in list(model_cache.keys()):
        if key.startswith(f"{model_hash}_"):
            del model_cache[key]
            removed_keys.append(key)

    # Also remove from disk
    model_dir = Path(MODEL_CACHE_DIR) / model_hash
    if model_dir.exists():
        import shutil

        shutil.rmtree(model_dir)

    return {
        "message": f"Cleared model {model_hash} from cache",
        "removed_keys": removed_keys,
    }


@router.delete("/models")
async def clear_all_cache():
    """Clear all models from cache"""
    model_cache.clear()

    # Clear disk cache
    import shutil

    if Path(MODEL_CACHE_DIR).exists():
        shutil.rmtree(MODEL_CACHE_DIR)
        os.makedirs(MODEL_CACHE_DIR, exist_ok=True)

    return {"message": "Cleared all model cache"}
