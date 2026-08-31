import threading
from typing import Dict, Type, Optional
from app.models.base import BaseAuthenticityModel

class ModelRegistry:
    """
    Thread-safe Singleton Model Registry.
    Ensures model weights and feature extractors are instantiated once across the application lifecycle.
    """
    
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(ModelRegistry, cls).__new__(cls)
                cls._instance._models: Dict[str, BaseAuthenticityModel] = {}
                cls._instance._factories: Dict[str, Type[BaseAuthenticityModel]] = {}
            return cls._instance

    def register_factory(self, modality: str, model_cls: Type[BaseAuthenticityModel]) -> None:
        """Register a model factory for a specific content modality."""
        with self._lock:
            self._factories[modality.lower()] = model_cls

    def get_model(self, modality: str) -> BaseAuthenticityModel:
        """Retrieve or lazily initialize the singleton model for the requested modality."""
        modality_key = modality.lower()
        with self._lock:
            if modality_key in self._models:
                return self._models[modality_key]
            
            if modality_key not in self._factories:
                raise ValueError(f"No model registered for modality '{modality}'.")
                
            model_cls = self._factories[modality_key]
            instance = model_cls()
            instance.load_model()
            self._models[modality_key] = instance
            return instance

model_registry = ModelRegistry()
