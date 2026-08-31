from typing import Dict
from pydantic import BaseModel

class AudioModelAdapterSpec(BaseModel):
    architecture_name: str
    sample_rate_hz: int
    n_fft: int
    hop_length: int
    status: str
    description: str

AUDIO_MODEL_ADAPTERS: Dict[str, AudioModelAdapterSpec] = {
    "wav2vec2": AudioModelAdapterSpec(
        architecture_name="Wav2Vec 2.0 (Self-Supervised Audio Representations)",
        sample_rate_hz=16000,
        n_fft=1024,
        hop_length=512,
        status="Planned (Stage 4)",
        description="Transformer extracting latent acoustic representations sensitive to neural vocoder phase shifts."
    ),
    "ast": AudioModelAdapterSpec(
        architecture_name="Audio Spectrogram Transformer (AST)",
        sample_rate_hz=16000,
        n_fft=1024,
        hop_length=256,
        status="Planned (Stage 4)",
        description="Pure attention model applied directly to 2D Mel spectrogram patches."
    ),
    "rawnet2": AudioModelAdapterSpec(
        architecture_name="RawNet2 (Raw Waveform Anti-Spoofing)",
        sample_rate_hz=16000,
        n_fft=0,
        hop_length=0,
        status="Planned (Stage 4)",
        description="Time-domain convolutional architecture designed for synthetic speech detection (ASVspoof benchmark)."
    )
}
