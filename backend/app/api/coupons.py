from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Coupon, CustomCakeRequest
from app.schemas.schemas import CouponValidate, CustomCakeCreate

coupons_router = APIRouter(prefix="/coupons", tags=["Coupons"])
custom_cakes_router = APIRouter(prefix="/custom-cakes", tags=["Custom Cakes"])

@coupons_router.post("/validate")
def validate_coupon(data: CouponValidate, db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.code == data.code.upper(), Coupon.is_active == True).first()
    if not coupon:
        raise HTTPException(status_code=400, detail="Invalid or expired coupon code")
    if data.cart_total < coupon.min_order_amount:
        raise HTTPException(status_code=400, detail=f"Minimum order amount of ৳{coupon.min_order_amount} required for this coupon")

    discount = data.cart_total * (coupon.discount_value / 100.0) if coupon.discount_type == "PERCENT" else coupon.discount_value
    return {
        "valid": True,
        "code": coupon.code,
        "discount_amount": discount,
        "message": "Coupon applied successfully!"
    }

@custom_cakes_router.post("")
def create_custom_cake_request(req_in: CustomCakeCreate, db: Session = Depends(get_db)):
    request_obj = CustomCakeRequest(**req_in.dict())
    db.add(request_obj)
    db.commit()
    db.refresh(request_obj)
    return {"success": True, "message": "Custom cake request submitted successfully!", "id": request_obj.id}
