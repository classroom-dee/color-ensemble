from __future__ import annotations
from sqlalchemy import String, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)

    favorites: Mapped[list['FavoriteColor']] = relationship(
        back_populates='user',
        cascade='all, delete-orphan',
    )

    favorite_harmonies: Mapped[list['FavoriteHarmony']] = relationship(
        back_populates='user',
        cascade='all, delete-orphan',
    )


class FavoriteColor(Base):
    __tablename__ = 'favorite_colors'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('users.id', ondelete='CASCADE'),
        index=True,
    )
    # normalized '#rrggbb'
    hex: Mapped[str] = mapped_column(String(7), index=True)

    user: Mapped[User] = relationship(back_populates='favorites')


class FavoriteHarmony(Base):
    __tablename__ = 'favorite_harmonies'
    __table_args__ = (UniqueConstraint('user_id', 'base_hex', 'harmony_type'),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('users.id', ondelete='CASCADE'),
        index=True,
    )

    # normalized '#rrggbb'
    base_hex: Mapped[str] = mapped_column(String(7), index=True)

    # 'complementary' | 'analogous' | 'triadic' | 'split_complementary'
    harmony_type: Mapped[str] = mapped_column(String, index=True)

    user: Mapped[User] = relationship(back_populates='favorite_harmonies')
