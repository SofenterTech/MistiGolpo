import datetime
import enum
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, Text, Table
from sqlalchemy.orm import relationship
from app.db.database import Base

class RoleEnum(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    ORDER_MANAGER = "ORDER_MANAGER"
    CONTENT_MANAGER = "CONTENT_MANAGER"
    CUSTOMER = "CUSTOMER"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.CUSTOMER, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    wishlist = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")

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
    sort_order = Column(Integer, default=0)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name_bn = Column(String, nullable=False)
    name_en = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description_bn = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    base_price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True)
    stock_quantity = Column(Integer, default=10)
    ingredients = Column(Text, nullable=True)
    allergens = Column(Text, nullable=True)
    is_featured = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    image_url = Column(String, nullable=False)
    is_primary = Column(Boolean, default=False)

    product = relationship("Product", back_populates="images")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    size_bn = Column(String, nullable=False)
    size_en = Column(String, nullable=False)
    price_adjustment = Column(Float, default=0.0)

    product = relationship("Product", back_populates="variants")

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    session_or_user_id = Column(String, index=True, nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)
    quantity = Column(Integer, default=1)
    cake_message = Column(String, nullable=True)

    product = relationship("Product")
    variant = relationship("ProductVariant")

class OrderStatusEnum(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PREPARING = "PREPARING"
    READY = "READY"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class PaymentMethodEnum(str, enum.Enum):
    COD = "COD"
    BKASH = "BKASH"
    NAGAD = "NAGAD"
    CARD = "CARD"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    customer_email = Column(String, nullable=True)
    
    delivery_division = Column(String, nullable=False)
    delivery_district = Column(String, nullable=False)
    delivery_area = Column(String, nullable=False)
    delivery_address = Column(Text, nullable=False)
    delivery_date = Column(String, nullable=False)
    delivery_slot = Column(String, nullable=False)
    
    subtotal = Column(Float, nullable=False)
    delivery_fee = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    
    payment_method = Column(Enum(PaymentMethodEnum), default=PaymentMethodEnum.COD)
    payment_status = Column(String, default="PENDING")
    order_status = Column(Enum(OrderStatusEnum), default=OrderStatusEnum.PENDING)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String, nullable=False)
    variant_info = Column(String, nullable=True)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    cake_message = Column(String, nullable=True)

    order = relationship("Order", back_populates="items")

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    discount_type = Column(String, nullable=False)  # "PERCENT" or "FIXED"
    discount_value = Column(Float, nullable=False)
    min_order_amount = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    user = relationship("User", back_populates="wishlist")
    product = relationship("Product")

class DeliveryZone(Base):
    __tablename__ = "delivery_zones"

    id = Column(Integer, primary_key=True, index=True)
    name_bn = Column(String, nullable=False)
    name_en = Column(String, nullable=False)
    delivery_fee = Column(Float, nullable=False)
    estimated_hours = Column(Integer, default=24)
    is_active = Column(Boolean, default=True)

class CustomCakeRequest(Base):
    __tablename__ = "custom_cake_requests"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    flavor = Column(String, nullable=False)
    weight = Column(String, nullable=False)
    cake_message = Column(String, nullable=True)
    reference_image_url = Column(String, nullable=True)
    delivery_date = Column(String, nullable=False)
    special_instructions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
