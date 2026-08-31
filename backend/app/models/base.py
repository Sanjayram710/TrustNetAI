from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseAuthenticityModel(ABC):
    """
    Abstract base class defining the standard interface for all TrustNet AI inference models.
    Designed for seamless substitution with production PyTorch/ONNX/TorchScript pipelines.
    """
    
    @abstractmethod
    def predict(self, input_data: Any, **kwargs) -> Dict[str, Any]:
        """
        Execute forward pass / feature analysis on the provided input data.
        Returns a dictionary containing standardized probability distributions and raw features.
        """
        pass
