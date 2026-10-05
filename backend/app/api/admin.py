from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import Order, Product, User, CustomCakeRequest, OrderStatusEnum
from app.schemas.schemas import OrderResponse
from app.api.deps import get_admin_user

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.order_status == OrderStatusEnum.PENDING).count()
    total_products = db.query(Product).count()
    total_users = db.query(User).count()
    
    orders = db.query(Order).all()
    total_revenue = sum(o.total_amount for o in orders)

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_products": total_products,
        "total_users": total_users
    }

@router.get("/orders", response_model=List[OrderResponse])
def get_admin_orders(db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    return db.query(Order).order_by(Order.id.desc()).all()

@router.put("/orders/{order_id}/status")
def update_order_status(order_id: int, status_str: str, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if status_str in OrderStatusEnum.__members__:
        order.order_status = OrderStatusEnum(status_str)
        db.commit()
        db.refresh(order)
        return order
    raise HTTPException(status_code=400, detail="Invalid order status")
