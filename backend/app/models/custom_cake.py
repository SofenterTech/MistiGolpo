from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from backend.app.db.database import Base

class CustomCakeRequest(Base):
    __tablename__ = "custom_cake_requests"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    flavor = Column(String, nullable=False)
    weight_lb = Column(Float, nullable=False)
    theme = Column(String, nullable=True)
    message_on_cake = Column(String, nullable=True)
    delivery_date = Column(String, nullable=False)
    reference_image_url = Column(String, nullable=True)
    instructions = Column(Text, nullable=True)
    status = Column(String, default="PENDING")
    created_at = Column(DateTime, default=datetime.utcnow)
