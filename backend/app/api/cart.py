from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import CartItem, Product, ProductVariant
from app.schemas.schemas import CartItemCreate, CartItemResponse

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/{session_or_user_id}", response_model=List[CartItemResponse])
def get_cart(session_or_user_id: str, db: Session = Depends(get_db)):
    return db.query(CartItem).filter(CartItem.session_or_user_id == session_or_user_id).all()

@router.post("/items", response_model=CartItemResponse)
def add_to_cart(item_in: CartItemCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(CartItem).filter(
        CartItem.session_or_user_id == item_in.session_or_user_id,
        CartItem.product_id == item_in.product_id,
        CartItem.variant_id == item_in.variant_id
    ).first()

    if existing:
        existing.quantity += item_in.quantity
        if item_in.cake_message:
            existing.cake_message = item_in.cake_message
        db.commit()
        db.refresh(existing)
        return existing
    else:
        cart_item = CartItem(**item_in.dict())
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return cart_item

@router.delete("/items/{item_id}")
def delete_cart_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"success": True}
