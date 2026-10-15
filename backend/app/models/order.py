from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.db.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    customer_email = Column(String, nullable=True)
    delivery_address = Column(Text, nullable=False)
    delivery_area = Column(String, nullable=False)
    delivery_date = Column(String, nullable=False)
    delivery_slot = Column(String, nullable=False)
    payment_method = Column(String, nullable=False)
    payment_status = Column(String, default="PENDING")
    order_status = Column(String, default="CONFIRMED")
    subtotal = Column(Float, nullable=False)
    discount = Column(Float, default=0.0)
    delivery_fee = Column(Float, default=60.0)
    total_amount = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String, nullable=False)
    weight_lb = Column(Float, default=1.0)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    cake_message = Column(String, nullable=True)

    order = relationship("Order", back_populates="items")
