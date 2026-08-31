from fastapi import APIRouter
from app.services.trust_engine import trust_engine, TrustEngineWeights

router = APIRouter(prefix="/config", tags=["Configuration"])

@router.get("/trust-engine", summary="Get active Trust Engine weights, penalty rules, and band criteria")
async def get_trust_engine_configuration():
    return trust_engine.get_config()

@router.put("/trust-engine", summary="Update Trust Engine weights dynamically")
async def update_trust_engine_weights(weights: TrustEngineWeights):
    trust_engine.set_weights(
        w_auth=weights.media_authenticity,
        w_manip=weights.manipulation_risk,
        w_src=weights.source_reliability,
        w_claim=weights.claim_support
    )
    return {
        "status": "updated",
        "configuration": trust_engine.get_config()
    }
