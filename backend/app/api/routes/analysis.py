import os
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.security import sanitize_filename
from app.schemas.analysis import (
    AnalysisResponse, AnalysisStatusResponse, AnalysisListResponse,
    ContentType, AnalysisStatus
)
from app.services.repository import repository

router = APIRouter(prefix="/analysis", tags=["Analysis Records"])

@router.get("", response_model=AnalysisListResponse, summary="List past analyses with filtering and summary metrics")
async def list_analyses(
    content_type: Optional[ContentType] = Query(None, description="Filter by modality"),
    risk_filter: Optional[str] = Query(None, description="Filter by risk category (e.g. 'authentic', 'high risk', 'suspicious')"),
    search: Optional[str] = Query(None, description="Search by filename or claim text"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page")
):
    offset = (page - 1) * page_size
    items, total, metrics = repository.list_analyses(
        content_type=content_type,
        risk_filter=risk_filter,
        search_query=search,
        limit=page_size,
        offset=offset
    )
    
    return AnalysisListResponse(
        metrics=metrics,
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/{analysis_id}", response_model=AnalysisResponse, summary="Get full analysis report by ID")
async def get_analysis_by_id(analysis_id: str):
    record = repository.get_by_id(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Analysis with ID '{analysis_id}' not found.")
    return record

@router.get("/{analysis_id}/status", response_model=AnalysisStatusResponse, summary="Get asynchronous analysis status")
async def get_analysis_status(analysis_id: str):
    record = repository.get_by_id(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Analysis with ID '{analysis_id}' not found.")
    
    return AnalysisStatusResponse(
        id=record.id,
        status=record.status,
        progress_percentage=100 if record.status == AnalysisStatus.COMPLETED else 50,
        current_step="Analysis Complete" if record.status == AnalysisStatus.COMPLETED else "Processing",
        processing_timeline=record.processing_timeline
    )

@router.get("/preview/{filename}", summary="Serve temporary preview image")
async def get_image_preview(filename: str):
    safe_name = sanitize_filename(filename)
    filepath = os.path.join(settings.UPLOAD_DIR, safe_name)
    
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Preview image file not found or expired.")
        
    return FileResponse(filepath)
