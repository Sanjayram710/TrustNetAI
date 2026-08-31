import json
import os
import threading
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime

from app.core.config import settings
from app.schemas.analysis import AnalysisResponse, ContentType, RiskLevel, AnalysisSummaryMetrics

class AnalysisRepository:
    """
    Thread-safe repository for persisting and querying content authenticity analyses.
    Supports in-memory caching with JSON file backing.
    """
    
    def __init__(self, storage_path: str = settings.DATA_STORAGE_FILE):
        self.storage_path = storage_path
        self._lock = threading.Lock()
        self._cache: Dict[str, AnalysisResponse] = {}
        self._load_from_disk()

    def _load_from_disk(self) -> None:
        """Load records from JSON file on startup."""
        if os.path.exists(self.storage_path):
            try:
                with open(self.storage_path, "r", encoding="utf-8") as f:
                    raw_data = json.load(f)
                    for item in raw_data:
                        try:
                            analysis = AnalysisResponse.model_validate(item)
                            self._cache[analysis.id] = analysis
                        except Exception:
                            continue
            except Exception:
                pass

    def _save_to_disk(self) -> None:
        """Persist cache to disk."""
        try:
            os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
            data_to_save = [
                json.loads(analysis.model_dump_json())
                for analysis in self._cache.values()
            ]
            with open(self.storage_path, "w", encoding="utf-8") as f:
                json.dump(data_to_save, f, indent=2)
        except Exception:
            pass

    def save(self, analysis: AnalysisResponse) -> AnalysisResponse:
        """Save or update an analysis record."""
        with self._lock:
            self._cache[analysis.id] = analysis
            self._save_to_disk()
            return analysis

    def get_by_id(self, analysis_id: str) -> Optional[AnalysisResponse]:
        """Fetch a single analysis by its unique ID."""
        with self._lock:
            return self._cache.get(analysis_id)

    def list_analyses(
        self,
        content_type: Optional[ContentType] = None,
        risk_filter: Optional[str] = None,
        search_query: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[List[AnalysisResponse], int, AnalysisSummaryMetrics]:
        """Query historical analyses with filters, pagination, and aggregate summary metrics."""
        with self._lock:
            all_items = list(self._cache.values())
            
        # Sort descending by creation timestamp
        all_items.sort(key=lambda x: x.created_at, reverse=True)
        
        # Calculate summary metrics across all records
        total_count = len(all_items)
        authentic_count = sum(1 for a in all_items if a.trust_score >= 80)
        suspicious_count = sum(1 for a in all_items if a.trust_score >= 40 and a.trust_score < 80)
        high_risk_count = sum(1 for a in all_items if a.trust_score < 40)
        avg_score = (sum(a.trust_score for a in all_items) / total_count) if total_count > 0 else 0.0

        metrics = AnalysisSummaryMetrics(
            total_analyses=total_count,
            authentic_count=authentic_count,
            suspicious_count=suspicious_count,
            high_risk_count=high_risk_count,
            average_trust_score=round(avg_score, 1)
        )

        # Apply filtering
        filtered = all_items
        if content_type:
            filtered = [a for a in filtered if a.content_type == content_type]
            
        if risk_filter:
            rf = risk_filter.lower()
            if "authentic" in rf or "high trust" in rf or "minimal" in rf:
                filtered = [a for a in filtered if a.trust_score >= 80]
            elif "suspicious" in rf or "uncertain" in rf or "moderate" in rf:
                filtered = [a for a in filtered if 40 <= a.trust_score < 80]
            elif "high risk" in rf or "low trust" in rf or "critical" in rf:
                filtered = [a for a in filtered if a.trust_score < 40]

        if search_query:
            sq = search_query.lower()
            filtered = [
                a for a in filtered
                if (a.filename and sq in a.filename.lower())
                or (a.associated_claim and sq in a.associated_claim.lower())
                or (a.id and sq in a.id.lower())
            ]

        total_filtered = len(filtered)
        paginated_items = filtered[offset : offset + limit]

        return paginated_items, total_filtered, metrics

repository = AnalysisRepository()
