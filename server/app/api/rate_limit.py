# POC Only! Don't do this in multi-worker settings
# Don't save state in DB! (Self DDoS LMFAO)
# Manage state in Redis OR limit traffic from a gateway
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request, status

# 60 requests per minute per IP
MAX_REQUESTS = 60
WINDOW_SECONDS = 60

_requests: dict[str, deque[float]] = defaultdict(deque)


def harmony_rate_limit(request: Request):
    ip = request.client.host if request.client else 'unknown'
    now = time.time()
    window_start = now - WINDOW_SECONDS

    q = _requests[ip]

    # drop old timestamps
    while q and q[0] < window_start:
        q.popleft()

    if len(q) >= MAX_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail='Too many harmony requests, slow down',
        )

    q.append(now)
