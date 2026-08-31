from app.models.base import BaseAuthenticityModel, ModelMetadata
from app.models.registry import model_registry
from app.models.image.image_ensemble import ImageAuthenticityModel
from app.models.video.video_model import VideoAuthenticityModel
from app.models.audio.audio_model import AudioAuthenticityModel
from app.models.text.text_model import TextClaimModel
from app.models.document.document_model import DocumentAuthenticityModel

# Register default modality models in singleton registry
model_registry.register_factory("image", ImageAuthenticityModel)
model_registry.register_factory("video", VideoAuthenticityModel)
model_registry.register_factory("audio", AudioAuthenticityModel)
model_registry.register_factory("text", TextClaimModel)
model_registry.register_factory("document", DocumentAuthenticityModel)

__all__ = [
    "BaseAuthenticityModel",
    "ModelMetadata",
    "model_registry",
    "ImageAuthenticityModel",
    "VideoAuthenticityModel",
    "AudioAuthenticityModel",
    "TextClaimModel",
    "DocumentAuthenticityModel",
]
