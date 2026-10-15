from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    full_name: str
    role: str

class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name_bn: str
    name_en: str
    slug: str
    description_bn: Optional[str] = None
    description_en: Optional[str] = None
    image_url: Optional[str] = None

class ProductVariantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    weight_lb: float
    price_modifier: float

class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    category_id: int
    name_bn: str
    name_en: str
    slug: str
    description_bn: Optional[str] = None
    description_en: Optional[str] = None
    base_price: float
    discount_price: Optional[float] = None
    stock_quantity: int
    image_url: Optional[str] = None
    is_featured: bool
    is_bestseller: bool
    variants: List[ProductVariantOut] = []

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    weight_lb: float = 1.0
    cake_message: Optional[str] = None

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    delivery_address: str
    delivery_area: str
    delivery_date: str
    delivery_slot: str
    payment_method: str
    coupon_code: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    order_number: str
    customer_name: str
    customer_phone: str
    delivery_address: str
    delivery_area: str
    delivery_date: str
    delivery_slot: str
    payment_method: str
    payment_status: str
    order_status: str
    subtotal: float
    discount: float
    delivery_fee: float
    total_amount: float
    created_at: str
