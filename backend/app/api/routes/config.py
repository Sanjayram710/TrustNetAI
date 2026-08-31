from fastapi import APIRouter
from app.services.trust_engine import TrustScoreEngine

router = APIRouter(prefix="/config", tags=["Configuration"])

@router.get("/trust-engine", summary="Get active Trust Engine weights, penalty rules, and band criteria")
async def get_trust_engine_configuration():
    engine = TrustScoreEngine()
    return engine.get_config()
