from __future__ import annotations

from typing import Literal, Optional
from typing_extensions import Self

from pydantic import BaseModel, Field, model_validator, ConfigDict


class ColorInput(BaseModel):
    """Accept exactly one of hex/rgb/hsl/hsv."""

    hex: Optional[str] = Field(default=None, examples=['#ff00aa', 'ff00aa', '#f0a'])
    rgb: Optional[tuple[int, int, int]] = Field(default=None, examples=[(255, 0, 170)])
    hsl: Optional[tuple[float, float, float]] = Field(
        default=None, examples=[(320.0, 1.0, 0.5)]
    )
    hsv: Optional[tuple[float, float, float]] = Field(
        default=None, examples=[(320.0, 1.0, 1.0)]
    )

    @model_validator(mode='after')
    def exactly_one(self) -> Self:
        provided = [
            self.hex is not None,
            self.rgb is not None,
            self.hsl is not None,
            self.hsv is not None,
        ]
        if sum(provided) != 1:
            raise ValueError('Provide exactly one of hex, rgb, hsl, hsv')
        return self


class ColorFormatsOut(BaseModel):
    hex: str
    rgb: tuple[int, int, int]
    hsl: tuple[float, float, float]
    hsv: tuple[float, float, float]


HarmonyType = Literal[
    'complementary',
    'analogous',
    'triadic',
    'split_complementary',
]


class HarmonyResponse(BaseModel):
    input: ColorFormatsOut
    harmonies: dict[HarmonyType, list[ColorFormatsOut]]


class FavoriteColorCreate(BaseModel):
    hex: str = Field(examples=['#ff00aa'])


class FavoriteColorOut(BaseModel):
    id: int
    hex: str

    model_config = ConfigDict(from_attributes=True)


##############
class FavoriteHarmonyCreate(BaseModel):
    base_hex: str
    harmony_type: HarmonyType


class FavoriteHarmonyOut(BaseModel):
    id: int
    base_hex: str
    harmony_type: HarmonyType

    model_config = ConfigDict(from_attributes=True)
