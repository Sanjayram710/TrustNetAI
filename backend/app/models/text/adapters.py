from typing import Dict
from pydantic import BaseModel

class TextModelAdapterSpec(BaseModel):
    architecture_name: str
    max_sequence_length: int
    status: str
    description: str

TEXT_MODEL_ADAPTERS: Dict[str, TextModelAdapterSpec] = {
    "deberta_v3": TextModelAdapterSpec(
        architecture_name="DeBERTa-v3-Large (Disentangled Attention for NLI)",
        max_sequence_length=512,
        status="Adapter Ready (HuggingFace / PyTorch)",
        description="State-of-the-art natural language inference for claim contradiction and premise verification."
    ),
    "roberta_mnli": TextModelAdapterSpec(
        architecture_name="RoBERTa-Large-MNLI (Stance Classifier)",
        max_sequence_length=512,
        status="Adapter Ready (PyTorch)",
        description="Multi-genre cross-source textual stance classification (Supported, Contradicted, Neutral)."
    )
}
