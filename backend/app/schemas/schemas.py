from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import datetime

# Auth
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
    user: dict

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str]
    role: str
    is_active: bool

# Category
class CategoryBase(BaseModel):
    name_bn: str
    name_en: str
    slug: str
    description_bn: Optional[str] = None
    description_en: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

# Product Variant & Image
class ProductVariantBase(BaseModel):
    size_bn: str
    size_en: str
    price_adjustment: float = 0.0

class ProductVariantResponse(ProductVariantBase):
    id: int

class ProductImageBase(BaseModel):
    image_url: str
    is_primary: bool = False

class ProductImageResponse(ProductImageBase):
    id: int

# Product
class ProductBase(BaseModel):
    name_bn: str
    name_en: str
    slug: str
    description_bn: Optional[str] = None
    description_en: Optional[str] = None
    category_id: int
    base_price: float
    discount_price: Optional[float] = None
    stock_quantity: int = 10
    ingredients: Optional[str] = None
    allergens: Optional[str] = None
    is_featured: bool = False
    is_bestseller: bool = False
    is_active: bool = True

class ProductCreate(ProductBase):
    images: List[ProductImageBase] = []
    variants: List[ProductVariantBase] = []

class ProductResponse(ProductBase):
    id: int
    category: Optional[CategoryResponse] = None
    images: List[ProductImageResponse] = []
    variants: List[ProductVariantResponse] = []

# Cart
class CartItemCreate(BaseModel):
    session_or_user_id: str
    product_id: int
    variant_id: Optional[int] = None
    quantity: int = 1
    cake_message: Optional[str] = None

class CartItemResponse(BaseModel):
    id: int
    session_or_user_id: str
    product_id: int
    variant_id: Optional[int] = None
    quantity: int
    cake_message: Optional[str] = None
    product: ProductResponse
    variant: Optional[ProductVariantResponse] = None

# Order
class OrderItemCreate(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity: int
    cake_message: Optional[str] = None

class OrderCreate(BaseModel):
    session_or_user_id: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    delivery_division: str
    delivery_district: str
    delivery_area: str
    delivery_address: str
    delivery_date: str
    delivery_slot: str
    payment_method: str = "COD"
    coupon_code: Optional[str] = None
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    delivery_address: str
    delivery_date: str
    delivery_slot: str
    subtotal: float
    delivery_fee: float
    discount_amount: float
    total_amount: float
    payment_method: str
    payment_status: str
    order_status: str
    created_at: datetime.datetime

# Coupon
class CouponValidate(BaseModel):
    code: str
    cart_total: float

# Custom Cake
class CustomCakeCreate(BaseModel):
    customer_name: str
    customer_phone: str
    flavor: str
    weight: str
    cake_message: Optional[str] = None
    reference_image_url: Optional[str] = None
    delivery_date: str
    special_instructions: Optional[str] = None

class ReviewCreate(BaseModel):
    product_id: int
    rating: int
    comment: Optional[str] = None
