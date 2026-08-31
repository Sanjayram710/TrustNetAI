from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class ModelMetadata(BaseModel):
    name: str
    version: str = "1.0.0"
    modality: str
    is_demo_inference: bool = True
    target_architectures: list[str] = Field(default_factory=list)
    description: str = ""

class BaseAuthenticityModel(ABC):
    """
    Abstract Base Authenticity Model defining the standard lifecycle for all TrustNet AI models.
    Supports Singleton loading, decoupled preprocessing, forward inference, and probability calibration.
    """
    
    def __init__(self, metadata: Optional[ModelMetadata] = None):
        self.metadata = metadata or ModelMetadata(
            name=self.__class__.__name__,
            modality="generic",
            is_demo_inference=True
        )
        self._is_loaded: bool = False

    def load_model(self) -> None:
        """Initialize or load weights into memory once (Singleton lifecycle)."""
        self._is_loaded = True

    @abstractmethod
    def preprocess(self, input_data: Any) -> Any:
        """Transform raw file or text input into tensor / feature representation."""
        pass

    @abstractmethod
    def forward(self, preprocessed_data: Any) -> Dict[str, Any]:
        """Execute model forward pass / feature extraction."""
        pass

    @abstractmethod
    def postprocess(self, raw_output: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize raw probabilities and derive confidence intervals."""
        pass

    def predict(self, input_data: Any, **kwargs) -> Dict[str, Any]:
        """Standard end-to-end execution pipeline."""
        if not self._is_loaded:
            self.load_model()
        preprocessed = self.preprocess(input_data)
        raw_output = self.forward(preprocessed)
        return self.postprocess(raw_output)
