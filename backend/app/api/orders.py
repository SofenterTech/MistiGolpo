from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import uuid
from backend.app.db.database import get_db
from backend.app.models.product import Product
from backend.app.models.order import Order, OrderItem
from backend.app.models.coupon import Coupon
from backend.app.schemas.schemas import OrderCreate, OrderOut

router = APIRouter(tags=["orders"])

@router.post("/orders", response_model=OrderOut)
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    subtotal = 0.0
    order_items_to_create = []

    for item_in in order_in.items:
        product = db.query(Product).filter(Product.id == item_in.product_id, Product.is_active == True).first()
        if not product:
            raise HTTPException(status_code=400, detail=f"Product ID {item_in.product_id} not found")

        unit_price = product.discount_price if product.discount_price else product.base_price
        if item_in.weight_lb > 1.0:
            unit_price = unit_price * (1.0 + (item_in.weight_lb - 1.0) * 0.8)

        line_subtotal = unit_price * item_in.quantity
        subtotal += line_subtotal

        order_items_to_create.append({
            "product_id": product.id,
            "product_name": product.name_bn,
            "weight_lb": item_in.weight_lb,
            "unit_price": unit_price,
            "quantity": item_in.quantity,
            "cake_message": item_in.cake_message
        })

    discount = 0.0
    if order_in.coupon_code:
        coupon = db.query(Coupon).filter(Coupon.code == order_in.coupon_code, Coupon.is_active == True).first()
        if coupon and subtotal >= coupon.min_order_amount:
            discount = subtotal * (coupon.discount_percent / 100.0)
            if coupon.max_discount_amount and discount > coupon.max_discount_amount:
                discount = coupon.max_discount_amount

    delivery_fee = 60.0
    if order_in.delivery_area.lower() in ["suburb", "outside_dhaka"]:
        delivery_fee = 120.0

    total_amount = max(0.0, subtotal - discount + delivery_fee)
    order_number = f"MG-{uuid.uuid4().hex[:8].upper()}"

    order = Order(
        order_number=order_number,
        customer_name=order_in.customer_name,
        customer_phone=order_in.customer_phone,
        customer_email=order_in.customer_email,
        delivery_address=order_in.delivery_address,
        delivery_area=order_in.delivery_area,
        delivery_date=order_in.delivery_date,
        delivery_slot=order_in.delivery_slot,
        payment_method=order_in.payment_method,
        subtotal=subtotal,
        discount=discount,
        delivery_fee=delivery_fee,
        total_amount=total_amount,
        notes=order_in.notes
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item_data in order_items_to_create:
        item = OrderItem(order_id=order.id, **item_data)
        db.add(item)

    db.commit()

    return OrderOut(
        id=order.id,
        order_number=order.order_number,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        delivery_address=order.delivery_address,
        delivery_area=order.delivery_area,
        delivery_date=order.delivery_date,
        delivery_slot=order.delivery_slot,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        order_status=order.order_status,
        subtotal=order.subtotal,
        discount=order.discount,
        delivery_fee=order.delivery_fee,
        total_amount=order.total_amount,
        created_at=order.created_at.strftime("%Y-%m-%d %H:%M:%S")
    )

@router.get("/orders/track", response_model=OrderOut)
def track_order(order_number: str = Query(...), phone: str = Query(...), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number, Order.customer_phone == phone).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return OrderOut(
        id=order.id,
        order_number=order.order_number,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        delivery_address=order.delivery_address,
        delivery_area=order.delivery_area,
        delivery_date=order.delivery_date,
        delivery_slot=order.delivery_slot,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        order_status=order.order_status,
        subtotal=order.subtotal,
        discount=order.discount,
        delivery_fee=order.delivery_fee,
        total_amount=order.total_amount,
        created_at=order.created_at.strftime("%Y-%m-%d %H:%M:%S")
    )
