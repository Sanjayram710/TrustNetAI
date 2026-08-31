from typing import Dict, Any, List
from pydantic import BaseModel

class ModelAdapterSpec(BaseModel):
    architecture_name: str
    input_resolution: List[int]
    normalization_mean: List[float]
    normalization_std: List[float]
    default_checkpoint: str
    status: str
    description: str

IMAGE_MODEL_ADAPTERS: Dict[str, ModelAdapterSpec] = {
    "efficientnet_b4": ModelAdapterSpec(
        architecture_name="EfficientNet-B4 (NoisyStudent / ImageNet-1k)",
        input_resolution=[380, 380],
        normalization_mean=[0.485, 0.456, 0.406],
        normalization_std=[0.229, 0.224, 0.225],
        default_checkpoint="efficientnet_b4_deepfake_v1.pt",
        status="Adapter Ready (PyTorch)",
        description="High-efficiency convolutional backbone optimized for multi-frequency artifact detection."
    ),
    "xception": ModelAdapterSpec(
        architecture_name="XceptionNet (FaceForensics++ fine-tuned)",
        input_resolution=[299, 299],
        normalization_mean=[0.5, 0.5, 0.5],
        normalization_std=[0.5, 0.5, 0.5],
        default_checkpoint="xception_faceforensics_c23.pth",
        status="Adapter Ready (PyTorch)",
        description="Depthwise separable convolutions benchmarked on facial splicing and compression tampering."
    ),
    "vit_large": ModelAdapterSpec(
        architecture_name="Vision Transformer (ViT-L/14 CLIP / Latent)",
        input_resolution=[224, 224],
        normalization_mean=[0.48145466, 0.4578275, 0.40821073],
        normalization_std=[0.26862954, 0.26130258, 0.27577711],
        default_checkpoint="vit_l14_latent_diffusion_detector.safetensors",
        status="Adapter Ready (PyTorch / Safetensors)",
        description="Self-attention transformer extracting global semantic inconsistencies characteristic of diffusion models."
    ),
    "convnext_large": ModelAdapterSpec(
        architecture_name="ConvNeXt-Large (Latent Artifact Classifier)",
        input_resolution=[384, 384],
        normalization_mean=[0.485, 0.456, 0.406],
        normalization_std=[0.229, 0.224, 0.225],
        default_checkpoint="convnext_large_diffusion_v2.pt",
        status="Adapter Ready (PyTorch)",
        description="Pure convolutional modernization capturing subtle frequency-domain boundary perturbations."
    )
}
