import random
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import Order, OrderItem, Product, ProductVariant, Coupon, OrderStatusEnum, PaymentMethodEnum
from app.schemas.schemas import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse)
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain items")

    subtotal = 0.0
    order_items_to_create = []

    for item in order_in.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product or not product.is_active:
            raise HTTPException(status_code=400, detail=f"Product ID {item.product_id} unavailable")

        unit_price = product.discount_price if product.discount_price else product.base_price
        variant_info = None

        if item.variant_id:
            variant = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).first()
            if variant:
                unit_price += variant.price_adjustment
                variant_info = f"{variant.size_bn} / {variant.size_en}"

        line_total = unit_price * item.quantity
        subtotal += line_total

        order_items_to_create.append({
            "product_id": product.id,
            "product_name": product.name_bn,
            "variant_info": variant_info,
            "unit_price": unit_price,
            "quantity": item.quantity,
            "total_price": line_total,
            "cake_message": item.cake_message
        })

    # Calculate delivery fee
    delivery_fee = 80.0 if "Dhaka" in order_in.delivery_district or "ঢাকা" in order_in.delivery_district else 150.0

    # Coupon calculation
    discount_amount = 0.0
    if order_in.coupon_code:
        coupon = db.query(Coupon).filter(Coupon.code == order_in.coupon_code.upper(), Coupon.is_active == True).first()
        if coupon and subtotal >= coupon.min_order_amount:
            if coupon.discount_type == "PERCENT":
                discount_amount = subtotal * (coupon.discount_value / 100.0)
            else:
                discount_amount = coupon.discount_value

    total_amount = max(0.0, subtotal + delivery_fee - discount_amount)
    order_num = f"MG-{datetime.datetime.utcnow().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"

    order = Order(
        order_number=order_num,
        customer_name=order_in.customer_name,
        customer_phone=order_in.customer_phone,
        customer_email=order_in.customer_email,
        delivery_division=order_in.delivery_division,
        delivery_district=order_in.delivery_district,
        delivery_area=order_in.delivery_area,
        delivery_address=order_in.delivery_address,
        delivery_date=order_in.delivery_date,
        delivery_slot=order_in.delivery_slot,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        discount_amount=discount_amount,
        total_amount=total_amount,
        payment_method=PaymentMethodEnum(order_in.payment_method) if order_in.payment_method in PaymentMethodEnum.__members__ else PaymentMethodEnum.COD,
        order_status=OrderStatusEnum.PENDING,
        payment_status="PENDING"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item_data in order_items_to_create:
        db.add(OrderItem(order_id=order.id, **item_data))

    db.commit()
    db.refresh(order)
    return order

@router.get("/track/{order_number}", response_model=OrderResponse)
def track_order(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
