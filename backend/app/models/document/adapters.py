from typing import Dict
from pydantic import BaseModel

class DocModelAdapterSpec(BaseModel):
    ocr_engine: str
    status: str
    description: str

DOC_MODEL_ADAPTERS: Dict[str, DocModelAdapterSpec] = {
    "tesseract": DocModelAdapterSpec(
        ocr_engine="Tesseract OCR (LSTM line recognizer)",
        status="Planned (Stage 6)",
        description="Open-source optical character recognition for bounding-box level font consistency."
    ),
    "easyocr": DocModelAdapterSpec(
        ocr_engine="EasyOCR (CRAFT + ResNet-LSTM-CTC)",
        status="Planned (Stage 6)",
        description="Deep learning text detector and recognizer supporting 80+ languages."
    ),
    "paddleocr": DocModelAdapterSpec(
        ocr_engine="PaddleOCR (PP-OCRv4)",
        status="Planned (Stage 6)",
        description="Ultra-lightweight multi-lingual OCR pipeline optimized for table, receipt, and invoice layout forensics."
    )
}
