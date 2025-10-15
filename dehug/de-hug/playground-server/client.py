"""
Example client for testing the DeHug Inference API
"""

import httpx
import json
import asyncio
from pathlib import Path

class DeHugInferenceClient:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        
    async def health_check(self):
        """Check if the server is healthy"""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/health")
            return response.json()
    
    async def list_models(self):
        """List cached models"""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/models")
            return response.json()
    
    async def text_generation(self, model_hash: str, input_text: str, **params):
        """Run text generation"""
        payload = {
            "model_hash": model_hash,
            "task": "text-generation",
            "input_text": input_text,
            "parameters": params
        }
        
        async with httpx.AsyncClient(timeout=300) as client:
            response = await client.post(f"{self.base_url}/infer", json=payload)
            return response.json()
    
    async def text_classification(self, model_hash: str, input_text: str, **params):
        """Run text classification"""
        payload = {
            "model_hash": model_hash,
            "task": "text-classification", 
            "input_text": input_text,
            "parameters": params
        }
        
        async with httpx.AsyncClient(timeout=300) as client:
            response = await client.post(f"{self.base_url}/infer", json=payload)
            return response.json()
    
    async def image_classification(self, model_hash: str, image_path: str, **params):
        """Run image classification"""
        with open(image_path, 'rb') as f:
            files = {'file': f}
            data = {
                'model_hash': model_hash,
                'task': 'image-classification',
                'parameters': json.dumps(params)
            }
            
            async with httpx.AsyncClient(timeout=300) as client:
                response = await client.post(
                    f"{self.base_url}/infer-with-files",
                    files=files,
                    data=data
                )
                return response.json()
    
    async def speech_recognition(self, model_hash: str, audio_path: str, **params):
        """Run speech recognition"""
        with open(audio_path, 'rb') as f:
            files = {'file': f}
            data = {
                'model_hash': model_hash,
                'task': 'speech-recognition',
                'parameters': json.dumps(params)
            }
            
            async with httpx.AsyncClient(timeout=300) as client:
                response = await client.post(
                    f"{self.base_url}/infer-with-files",
                    files=files,
                    data=data
                )
                return response.json()

# Example usage
async def main():
    client = DeHugInferenceClient()
    
    # Check health
    print("Health check:")
    health = await client.health_check()
    print(json.dumps(health, indent=2))
    
    # Example with text generation (using a mock IPFS hash)
    # In reality, you would use actual IPFS hashes of models
    model_hash = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
    
    try:
        print("\n--- Text Generation Example ---")
        result = await client.text_generation(
            model_hash=model_hash,
            input_text="Once upon a time",
            temperature=0.8,
            max_length=100,
            top_p=0.9,
            top_k=50
        )
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(f"Text generation failed: {e}")
    
    try:
        print("\n--- Text Classification Example ---")
        result = await client.text_classification(
            model_hash=model_hash,
            input_text="I love this product!",
            max_length=128,
            return_all_scores=True
        )
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(f"Text classification failed: {e}")
    
    # List models
    print("\n--- Cached Models ---")
    models = await client.list_models()
    print(json.dumps(models, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
