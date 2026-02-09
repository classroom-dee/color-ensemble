from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import FavoriteColor, User, FavoriteHarmony
from app.db.session import get_db
from app.schema.color import (
    ColorInput,
    ColorFormatsOut,
    HarmonyResponse,
    FavoriteColorCreate,
    FavoriteColorOut,
    FavoriteHarmonyCreate,
    FavoriteHarmonyOut,
)
from app.services.color_harmony import normalize_color, generate_harmonies
from app.api.rate_limit import harmony_rate_limit


router = APIRouter(prefix='/colors', tags=['colors'])
favorites_router = APIRouter(prefix='/favorites', tags=['favorites'])


@router.post('/normalize', response_model=ColorFormatsOut)
def normalize(payload: ColorInput):
    try:
        normalized = normalize_color(
            hex=payload.hex,
            rgb=payload.rgb,
            hsl=payload.hsl,
            hsv=payload.hsv,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )
    return ColorFormatsOut(**normalized.__dict__)


@router.post(
    '/harmony',
    response_model=HarmonyResponse,
    dependencies=[Depends(harmony_rate_limit)],
)
def harmony(payload: ColorInput):
    try:
        base = normalize_color(
            hex=payload.hex,
            rgb=payload.rgb,
            hsl=payload.hsl,
            hsv=payload.hsv,
        )
        harmonies = generate_harmonies(base)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )

    return HarmonyResponse(
        input=ColorFormatsOut(**base.__dict__),
        harmonies={
            k: [ColorFormatsOut(**c.__dict__) for c in v] for k, v in harmonies.items()
        },
    )


@favorites_router.get('', response_model=list[FavoriteColorOut])
def list_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(FavoriteColor)
        .filter(FavoriteColor.user_id == current_user.id)
        .order_by(FavoriteColor.id.desc())
        .all()
    )


@favorites_router.post(
    '', response_model=FavoriteColorOut, status_code=status.HTTP_201_CREATED
)
def add_favorite(
    payload: FavoriteColorCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Normalize hex so UI can dedupe reliably.
    try:
        normalized = normalize_color(hex=payload.hex)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )

    existing = (
        db.query(FavoriteColor)
        .filter(
            FavoriteColor.user_id == current_user.id,
            FavoriteColor.hex == normalized.hex,
        )
        .first()
    )
    if existing:
        return existing

    fav = FavoriteColor(user_id=current_user.id, hex=normalized.hex)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav


@favorites_router.delete('/{favorite_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_favorite(
    favorite_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    fav = (
        db.query(FavoriteColor)
        .filter(
            FavoriteColor.id == favorite_id,
            FavoriteColor.user_id == current_user.id,
        )
        .first()
    )
    if not fav:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Favorite not found'
        )
    db.delete(fav)
    db.commit()
    return None


@favorites_router.get(
    '/harmonies',
    response_model=list[FavoriteHarmonyOut],
)
def list_favorite_harmonies(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(FavoriteHarmony)
        .filter(FavoriteHarmony.user_id == current_user.id)
        .order_by(FavoriteHarmony.id.desc())
        .all()
    )


@favorites_router.post(
    '/harmonies',
    response_model=FavoriteHarmonyOut,
    status_code=status.HTTP_201_CREATED,
)
def add_favorite_harmony(
    payload: FavoriteHarmonyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # normalize base color
    try:
        normalized = normalize_color(hex=payload.base_hex)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    existing = (
        db.query(FavoriteHarmony)
        .filter(
            FavoriteHarmony.user_id == current_user.id,
            FavoriteHarmony.base_hex == normalized.hex,
            FavoriteHarmony.harmony_type == payload.harmony_type,
        )
        .first()
    )
    if existing:
        return existing

    fav = FavoriteHarmony(
        user_id=current_user.id,
        base_hex=normalized.hex,
        harmony_type=payload.harmony_type,
    )
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav


@favorites_router.delete(
    '/harmonies/{harmony_id}',
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_favorite_harmony(
    harmony_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    fav = (
        db.query(FavoriteHarmony)
        .filter(
            FavoriteHarmony.id == harmony_id,
            FavoriteHarmony.user_id == current_user.id,
        )
        .first()
    )
    if not fav:
        raise HTTPException(status_code=404, detail='Favorite harmony not found')

    db.delete(fav)
    db.commit()
    return None
