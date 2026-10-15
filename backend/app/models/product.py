from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.db.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name_bn = Column(String, nullable=False)
    name_en = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description_bn = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    name_bn = Column(String, nullable=False)
    name_en = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description_bn = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    base_price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True)
    stock_quantity = Column(Integer, default=100)
    image_url = Column(String, nullable=True)
    is_featured = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    weight_lb = Column(Float, nullable=False)
    price_modifier = Column(Float, default=0.0)

    product = relationship("Product", back_populates="variants")
