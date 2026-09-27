"""Cosine-similarity helpers for profile matching."""

import math


def cosine_similarity(a, b) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a)) or 1.0
    nb = math.sqrt(sum(y * y for y in b)) or 1.0
    return dot / (na * nb)


def rank_candidates(query_vec, candidates, top_k: int = 20):
    """candidates: iterable of (profile, vector). Returns sorted [(profile, score)]."""
    scored = [(p, cosine_similarity(query_vec, v)) for p, v in candidates]
    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]
