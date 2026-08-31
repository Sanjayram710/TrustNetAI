import pytest
import os
from io import BytesIO
from fastapi import UploadFile, HTTPException

from app.core.security import (
    sanitize_filename,
    get_file_extension,
    validate_magic_bytes,
    validate_and_save_upload,
    safe_remove_file
)

def test_sanitize_filename():
    assert sanitize_filename("../../../etc/passwd.jpg") == "passwd.jpg"
    assert sanitize_filename("..\\..\\malicious.png") == "malicious.png"
    assert sanitize_filename("normal_photo-2026.jpeg") == "normal_photo-2026.jpeg"
    assert sanitize_filename("") == "unnamed_file"

def test_get_file_extension():
    assert get_file_extension("photo.JPG") == "jpg"
    assert get_file_extension("document.PDF") == "pdf"
    assert get_file_extension("archive.tar.gz") == "gz"
    assert get_file_extension("noextension") == ""

def test_validate_magic_bytes():
    # Valid JPEG header
    jpeg_header = b"\xff\xd8\xff\xe0\x00\x10JFIF"
    assert validate_magic_bytes(jpeg_header, "jpg") is True
    assert validate_magic_bytes(jpeg_header, "jpeg") is True
    
    # Valid PNG header
    png_header = b"\x89PNG\r\n\x1a\n\x00\x00"
    assert validate_magic_bytes(png_header, "png") is True
    
    # Mismatch: PNG header with JPG extension
    assert validate_magic_bytes(png_header, "jpg") is False

@pytest.mark.asyncio
async def test_validate_and_save_upload_valid_image():
    content = b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 200
    upload = UploadFile(filename="test_image.jpg", file=BytesIO(content))
    
    path, original_name, size = await validate_and_save_upload(
        file=upload,
        allowed_extensions=["jpg", "jpeg", "png"],
        max_size_mb=5
    )
    
    assert os.path.exists(path)
    assert original_name == "test_image.jpg"
    assert size == len(content)
    
    # Clean up
    safe_remove_file(path)
    assert not os.path.exists(path)

@pytest.mark.asyncio
async def test_validate_and_save_upload_unsupported_ext():
    content = b"executable code"
    upload = UploadFile(filename="malicious.exe", file=BytesIO(content))
    
    with pytest.raises(HTTPException) as exc_info:
        await validate_and_save_upload(
            file=upload,
            allowed_extensions=["jpg", "png"]
        )
    assert exc_info.value.status_code == 400
    assert "Unsupported file format" in exc_info.value.detail

@pytest.mark.asyncio
async def test_validate_and_save_upload_oversized():
    content = b"\xff\xd8\xff" + (b"\x00" * (2 * 1024 * 1024))
    upload = UploadFile(filename="large.jpg", file=BytesIO(content))
    
    with pytest.raises(HTTPException) as exc_info:
        await validate_and_save_upload(
            file=upload,
            allowed_extensions=["jpg"],
            max_size_mb=1  # 1MB limit
        )
    assert exc_info.value.status_code == 413
