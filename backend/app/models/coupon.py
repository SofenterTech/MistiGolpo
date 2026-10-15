from sqlalchemy import Column, Integer, String, Float, Boolean
from backend.app.db.database import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    discount_percent = Column(Float, nullable=False)
    max_discount_amount = Column(Float, nullable=True)
    min_order_amount = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
