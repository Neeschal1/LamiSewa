"""Sentence-transformer embedding service.

Uses `sentence-transformers` (all-MiniLM-L6-v2, 384 dims) when available.
Falls back to a deterministic hashed bag-of-words embedding so the API
keeps working (and tests pass) without torch installed. Pinecone can
replace the DB store later without changing callers.
"""

import hashlib
import math
import threading

MODEL_NAME = "all-MiniLM-L6-v2"
DIMENSION = 384

_lock = threading.Lock()
_model = None
_model_failed = False


def _get_model():
    global _model, _model_failed
    if _model is not None or _model_failed:
        return _model
    with _lock:
        if _model is not None or _model_failed:
            return _model
        try:
            from sentence_transformers import SentenceTransformer

            _model = SentenceTransformer(MODEL_NAME)
        except Exception:
            _model_failed = True
            _model = None
    return _model


def _fallback_embedding(text: str, dim: int = DIMENSION):
    vec = [0.0] * dim
    for token in text.lower().split():
        h = int(hashlib.sha256(token.encode()).hexdigest(), 16)
        vec[h % dim] += 1.0
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


def encode(text: str):
    text = (text or "").strip()
    if not text:
        return [0.0] * DIMENSION
    model = _get_model()
    if model is not None:
        try:
            vec = model.encode(text, normalize_embeddings=True)
            return [float(x) for x in vec.tolist()]
        except Exception:
            pass
    return _fallback_embedding(text)


def build_profile_summary(payload: dict) -> str:
    """Build a semantic-search-friendly summary from the staged profile."""
    basic = payload.get("basic_info", {})
    personal = payload.get("personal_info", {})
    additional = payload.get("additional_info", {})
    career = payload.get("career_info", {})
    hobbies = payload.get("hobbies", {})
    partner = payload.get("partner_preference", {})

    hobby_list = " ".join(
        str(hobbies.get(k, "")) for k in ("hobby1", "hobby2", "hobby3", "hobby4", "hobby5")
    )
    parts = [
        f"Name {basic.get('fullname', '')} nickname {basic.get('nickname', '')}",
        f"Bio: {basic.get('bio', '')}",
        f"Gender {basic.get('gender', '')} profile for {basic.get('profile_handler', '')}",
        f"Location: {personal.get('current_city', '')}, {personal.get('current_living_country', '')} "
        f"({personal.get('residency_status', '')}), marital {personal.get('maritalstatus', '')}, gotra {personal.get('gotra', '')}",
        f"Height {additional.get('height', '')} weight {additional.get('weight', '')} "
        f"religion {additional.get('religion', '')} diet {additional.get('diet', '')} community {additional.get('community', '')}",
        f"Education {career.get('highest_qualification', '')} at {career.get('college_name', '')}, "
        f"works as {career.get('working_as', '')} {career.get('occupation', '')} at {career.get('company_or_organization_name', '')}",
        f"Hobbies: {hobby_list}",
    ]
    if partner:
        parts.append(
            f"Seeks partner aged {partner.get('age_ranging', '')}, {partner.get('maritalstatus', '')}, "
            f"living in {partner.get('living_in', '')}, religion {partner.get('partner_religion', '')}"
        )
    return ". ".join(p for p in parts if p.strip())
