"""
FastAPI backend server for AI model inference from IPFS
Supports text generation, classification, image classification, and speech recognition
"""

import shutil
from fastapi import  HTTPException
from logger import logger
from .schema import (TextClassificationParams, TextGenerationParams,
                     ImageClassificationParams, SpeechRecognitionParams)
from config import MODEL_CACHE_DIR, REQUEST_TIMEOUT, CACHE_MAX_MODELS, MAX_MODEL_SIZE
from dehug import DeHugRepository, DeHugError, NetworkError, IPFSError
from pathlib import Path
from datetime import datetime
from typing import Dict, Any
import asyncio
import zipfile

# Global model cache and DeHug repository client
model_cache: Dict[str, Dict[str, Any]] = {}

# Configuration for DeHugRepository
dehug_config = {
    "ipfs_gateway": "https://gateway.pinata.cloud/ipfs",  # Replace with the actual base URL
    "request_timeout": 60,  # Timeout in seconds
}
dehug_repo = DeHugRepository(dehug_config)

try:
    from transformers import (
        AutoTokenizer,
        AutoModelForCausalLM,
        AutoModelForSequenceClassification,
        AutoModelForImageClassification,
        AutoProcessor,
        pipeline,
    )
    import torch
    from PIL import Image
    import librosa
    import numpy as np

    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False


def get_model_size(model_path: Path) -> float:
    """Calculate model size in MB"""
    total_size = 0
    for file_path in model_path.rglob("*"):
        if file_path.is_file():
            total_size += file_path.stat().st_size
    return total_size / (1024 * 1024)


def cleanup_old_models():
    """Remove least recently used models if cache is full"""
    if len(model_cache) <= CACHE_MAX_MODELS:
        return

    # Sort by last_used time
    sorted_models = sorted(model_cache.items(), key=lambda x: x[1]["last_used"])

    # Remove oldest models
    models_to_remove = len(model_cache) - CACHE_MAX_MODELS
    for i in range(models_to_remove):
        cache_key = sorted_models[i][0]
        model_obj = model_cache.pop(cache_key)
        logger.info(f"Removed model {cache_key} from cache")

        # Clean up model files
        if "path" in model_obj:
            try:
                model_path = Path(model_obj["path"])
                if model_path.exists():
                    shutil.rmtree(model_path)
                    logger.info(f"Cleaned up model files at {model_path}")
            except Exception as e:
                logger.warning(f"Failed to clean up model files: {e}")


async def load_model(model_hash: str, task: str) -> Dict[str, Any]:
    """Load model into memory using DeHug SDK"""
    if not HAS_TRANSFORMERS:
        raise HTTPException(
            status_code=500,
            detail="Transformers library not installed. Please install: pip install transformers torch",
        )

    cache_key = f"{model_hash}_{task}"

    if cache_key in model_cache:
        model_cache[cache_key]["last_used"] = datetime.now()
        logger.info(f"Using cached model {cache_key}")
        return model_cache[cache_key]

    try:
        # Use DeHug SDK to download model from IPFS
        local_model = Path("/tmp/dehug") / f"{model_hash}"
        if local_model.exists():
            logger.info(f"Found existing model for hash {model_hash} at {local_model}, skipping download")
            model_path = local_model
        else:
            logger.info(f"Downloading model {model_hash} using DeHug SDK")
            model_path = await asyncio.to_thread(dehug_repo.load_model, model_hash)


            logger.info(f"Model {model_hash} downloaded to {model_path}")

            # Unzip model is in a zip file
            extract_dir = model_path.parent / model_path.stem
            logger.info(f"Extracting model zip to {extract_dir}")
            with zipfile.ZipFile(model_path, "r") as zip_ref:
                zip_ref.extractall(extract_dir)
            model_path = extract_dir    

        # Check model size
        model_size = get_model_size(model_path)
        if model_size > MAX_MODEL_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"Model size ({model_size:.2f} MB) exceeds maximum allowed size ({MAX_MODEL_SIZE} MB)",
            )

        # Clean up old models if needed
        # cleanup_old_models()

        model_obj = {}

        # Load model based on task
        if task == "text-generation":
            tokenizer = AutoTokenizer.from_pretrained(str(model_path))
            model = AutoModelForCausalLM.from_pretrained(str(model_path))

            # Ensure tokenizer has pad_token
            if tokenizer.pad_token is None:
                tokenizer.pad_token = tokenizer.eos_token

            model_obj = {
                "tokenizer": tokenizer,
                "model": model,
                "task": task,
                "loaded_at": datetime.now(),
                "last_used": datetime.now(),
                "path": str(model_path),
                "size_mb": model_size,
            }

        elif task == "text-classification":
            tokenizer = AutoTokenizer.from_pretrained(str(model_path))
            model = AutoModelForSequenceClassification.from_pretrained(str(model_path))

            model_obj = {
                "tokenizer": tokenizer,
                "model": model,
                "task": task,
                "loaded_at": datetime.now(),
                "last_used": datetime.now(),
                "path": str(model_path),
                "size_mb": model_size,
            }

        elif task == "image-classification":
            processor = AutoProcessor.from_pretrained(str(model_path))
            model = AutoModelForImageClassification.from_pretrained(str(model_path))

            model_obj = {
                "processor": processor,
                "model": model,
                "task": task,
                "loaded_at": datetime.now(),
                "last_used": datetime.now(),
                "path": str(model_path),
                "size_mb": model_size,
            }

        elif task == "speech-recognition":
            # Use pipeline for speech recognition (Whisper-like models)
            pipe = pipeline("automatic-speech-recognition", model=str(model_path))

            model_obj = {
                "pipeline": pipe,
                "task": task,
                "loaded_at": datetime.now(),
                "last_used": datetime.now(),
                "path": str(model_path),
                "size_mb": model_size,
            }

        else:
            raise HTTPException(status_code=400, detail=f"Unsupported task: {task}")

        logger.info(f"Model {cache_key} loaded and cached successfully")

        # Cache the model
        model_cache[cache_key] = model_obj

        return model_obj

    except (DeHugError, NetworkError, IPFSError) as e:
        logger.error(f"DeHug SDK error loading model {model_hash}: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to download model from IPFS: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Failed to load model {model_hash} for task {task}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")


async def run_text_generation(
    model_obj: Dict[str, Any], input_text: str, params: TextGenerationParams
) -> Dict[str, Any]:
    """Run text generation inference"""
    tokenizer = model_obj["tokenizer"]
    model = model_obj["model"]

    # Tokenize input
    inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True)

    # Generate
    with torch.no_grad():
        outputs = model.generate(
            inputs["input_ids"],
            attention_mask=inputs.get("attention_mask"),
            max_length=len(inputs["input_ids"][0]) + params.max_length,
            temperature=params.temperature,
            top_p=params.top_p,
            top_k=params.top_k,
            do_sample=params.do_sample,
            pad_token_id=tokenizer.eos_token_id,
        )

    # Decode output
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Remove input text from output
    if generated_text.startswith(input_text):
        generated_text = generated_text[len(input_text) :].strip()

    return {
        "generated_text": generated_text,
        "full_text": tokenizer.decode(outputs[0], skip_special_tokens=True),
        "parameters_used": params.dict(),
    }


async def run_text_classification(
    model_obj: Dict[str, Any], input_text: str, params: TextClassificationParams
) -> Dict[str, Any]:
    """Run text classification inference"""
    tokenizer = model_obj["tokenizer"]
    model = model_obj["model"]

    # Tokenize input
    inputs = tokenizer(
        input_text,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=params.max_length,
    )

    # Run inference
    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

    # Get label names if available
    if hasattr(model.config, "id2label"):
        labels = [model.config.id2label[i] for i in range(len(predictions[0]))]
    else:
        labels = [f"LABEL_{i}" for i in range(len(predictions[0]))]

    # Create results
    scores = predictions[0].tolist()
    results = [{"label": label, "score": score} for label, score in zip(labels, scores)]
    results.sort(key=lambda x: x["score"], reverse=True)

    if params.return_all_scores:
        return {
            "predictions": results,
            "top_prediction": results[0],
            "parameters_used": params.dict(),
        }
    else:
        return {
            "label": results[0]["label"],
            "score": results[0]["score"],
            "all_scores": results,
            "parameters_used": params.dict(),
        }


async def run_image_classification(
    model_obj: Dict[str, Any], image: Image.Image, params: ImageClassificationParams
) -> Dict[str, Any]:
    """Run image classification inference"""
    processor = model_obj["processor"]
    model = model_obj["model"]

    # Process image
    inputs = processor(image, return_tensors="pt")

    # Run inference
    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

    # Get label names if available
    if hasattr(model.config, "id2label"):
        labels = [model.config.id2label[i] for i in range(len(predictions[0]))]
    else:
        labels = [f"LABEL_{i}" for i in range(len(predictions[0]))]

    # Create results
    scores = predictions[0].tolist()
    results = [{"label": label, "score": score} for label, score in zip(labels, scores)]
    results.sort(key=lambda x: x["score"], reverse=True)

    # Return top k results
    top_results = results[: params.top_k]

    return {
        "predictions": top_results,
        "top_prediction": top_results[0],
        "parameters_used": params.dict(),
    }
