import os
import uuid
import re
from typing import Tuple, Optional
from fastapi import HTTPException, UploadFile
from app.core.config import settings

# Common Magic Byte signatures for verification
MAGIC_BYTES = {
    "jpg": [b"\xff\xd8\xff"],
    "jpeg": [b"\xff\xd8\xff"],
    "png": [b"\x89PNG\r\n\x1a\n"],
    "webp": [b"RIFF"],
    "gif": [b"GIF87a", b"GIF89a"],
    "mp4": [b"\x00\x00\x00\x18ftyp", b"\x00\x00\x00\x20ftyp", b"\x00\x00\x00\x14ftyp"],
    "pdf": [b"%PDF"],
    "wav": [b"RIFF"]
}

def sanitize_filename(filename: str) -> str:
    """Strip dangerous characters and path traversal sequences."""
    # Strip any directories or path characters
    clean_name = os.path.basename(filename)
    # Remove characters that aren't alphanumeric, dots, underscores, or hyphens
    clean_name = re.sub(r'[^a-zA-Z0-9._-]', '_', clean_name)
    return clean_name or "unnamed_file"

def get_file_extension(filename: str) -> str:
    """Extract lowercase file extension without leading dot."""
    ext = os.path.splitext(filename)[1].lower()
    return ext.lstrip(".")

def validate_magic_bytes(header: bytes, ext: str) -> bool:
    """Verify that file header bytes match the expected extension signature."""
    expected_signatures = MAGIC_BYTES.get(ext)
    if not expected_signatures:
        # Fallback for extensions without explicit signatures
        return True
    
    for sig in expected_signatures:
        if header.startswith(sig):
            return True
        if ext == "webp" and header.startswith(b"RIFF") and len(header) >= 12 and header[8:12] == b"WEBP":
            return True
    return False

async def validate_and_save_upload(
    file: UploadFile,
    allowed_extensions: list[str],
    max_size_mb: int = settings.MAX_FILE_SIZE_MB
) -> Tuple[str, str, int]:
    """
    Validates uploaded file against size limits, extension rules, and magic bytes.
    Saves the file securely with a unique UUID filename.
    Returns: (saved_filepath, sanitized_original_filename, file_size_bytes)
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file has no filename.")
    
    sanitized_name = sanitize_filename(file.filename)
    ext = get_file_extension(sanitized_name)
    
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(allowed_extensions)}"
        )
    
    # Read chunk to check header / magic bytes
    header = await file.read(64)
    if len(header) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    
    if not validate_magic_bytes(header, ext):
        raise HTTPException(
            status_code=400,
            detail=f"File signature mismatch for extension '{ext}'. The file content does not match its claimed format."
        )
    
    # Read the rest to calculate total size and write safely
    rest = await file.read()
    total_bytes = header + rest
    file_size = len(total_bytes)
    
    max_bytes = max_size_mb * 1024 * 1024
    if file_size > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File size ({file_size / (1024*1024):.2f} MB) exceeds maximum allowed limit of {max_size_mb} MB."
        )
    
    # Generate unique secure filename
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    dest_path = os.path.join(settings.UPLOAD_DIR, unique_name)
    
    # Securely write to disk
    with open(dest_path, "wb") as f:
        f.write(total_bytes)
        
    return dest_path, sanitized_name, file_size

def safe_remove_file(filepath: Optional[str]) -> None:
    """Safely remove a temporary file if it exists."""
    if filepath and os.path.exists(filepath):
        try:
            os.remove(filepath)
        except OSError:
            pass
