from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import UserRegister, UserLogin, Token, UserResponse
from app.models.models import User, RoleEnum
from app.core.security import hash_password, verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered."
        )
    user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hash_password(user_in.password),
        role=RoleEnum.CUSTOMER
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "role": user.role.value})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.value
        }
    }

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )
    token = create_access_token(data={"sub": str(user.id), "role": user.role.value})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.value
        }
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
