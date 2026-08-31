from typing import Dict
from pydantic import BaseModel

class VideoModelAdapterSpec(BaseModel):
    architecture_name: str
    sampling_fps: int
    temporal_window_frames: int
    status: str
    description: str

VIDEO_MODEL_ADAPTERS: Dict[str, VideoModelAdapterSpec] = {
    "timesformer": VideoModelAdapterSpec(
        architecture_name="TimeSformer (Divided Space-Time Attention)",
        sampling_fps=8,
        temporal_window_frames=16,
        status="Planned (Stage 3)",
        description="Spatiotemporal self-attention detecting micro-motion inconsistencies across frames."
    ),
    "video_swin": VideoModelAdapterSpec(
        architecture_name="Video Swin Transformer (3D Shifted Windows)",
        sampling_fps=12,
        temporal_window_frames=32,
        status="Planned (Stage 3)",
        description="Hierarchical vision transformer for facial region tracking and boundary artifact localization."
    ),
    "r3d_18": VideoModelAdapterSpec(
        architecture_name="3D ResNet-18 (Spatiotemporal CNN)",
        sampling_fps=15,
        temporal_window_frames=16,
        status="Planned (Stage 3)",
        description="Lightweight 3D convolution baseline for fast video deepfake screening."
    )
}
