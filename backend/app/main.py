from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.database import Base, engine, SessionLocal
from app.models.models import Category, Product, ProductImage, ProductVariant, Coupon, User, RoleEnum
from app.core.security import hash_password

from app.api.auth import router as auth_router
from app.api.products import products_router, categories_router
from app.api.cart import router as cart_router
from app.api.orders import router as order_router
from app.api.coupons import coupons_router, custom_cakes_router
from app.api.admin import router as admin_router

app = FastAPI(title=settings.PROJECT_NAME, openapi_url="/api/openapi.json", docs_url="/api/docs")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup DB init
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed initial data if empty
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == settings.ADMIN_EMAIL).first():
            admin_user = User(
                full_name="MistiGolpo Super Admin",
                email=settings.ADMIN_EMAIL,
                phone="+8801700000000",
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                role=RoleEnum.SUPER_ADMIN,
                is_active=True
            )
            db.add(admin_user)
            db.commit()

        if db.query(Category).count() == 0:
            c1 = Category(name_bn="জন্মদিনের কেক", name_en="Birthday Cakes", slug="birthday-cakes", sort_order=1, image_url="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500")
            c2 = Category(name_bn="চকলেট কেক", name_en="Chocolate Cakes", slug="chocolate-cakes", sort_order=2, image_url="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500")
            c3 = Category(name_bn="রেড ভেলভেট কেক", name_en="Red Velvet Cakes", slug="red-velvet-cakes", sort_order=3, image_url="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500")
            db.add_all([c1, c2, c3])
            db.commit()

            p1 = Product(
                name_bn="প্রিমিয়াম বেলজিয়াম চকলেট ট্রাফেল কেক",
                name_en="Premium Belgian Chocolate Truffle Cake",
                slug="belgian-chocolate-truffle-cake",
                description_bn="ধনী ও মসৃণ ডার্ক চকলেট গানাচে দিয়ে ঢাকা প্রিমিয়াম বেলজিয়াম কেক।",
                description_en="Rich Belgian dark chocolate ganache layered with soft chocolate sponge.",
                category_id=c2.id,
                base_price=1450.0,
                discount_price=1250.0,
                is_featured=True,
                is_bestseller=True,
                ingredients="Dark Chocolate, Butter, Flour, Eggs, Sugar, Cream",
                allergens="Gluten, Dairy, Eggs"
            )
            p2 = Product(
                name_bn="ক্লাসিক রেড ভেলভেট ড্রিম কেক",
                name_en="Classic Red Velvet Dream Cake",
                slug="classic-red-velvet-dream-cake",
                description_bn="সুস্বাদু ক্রিম চিজ ফ্রস্টিং দিয়ে সাজানো ক্লাসিক রেড ভেলভেট కేক।",
                description_en="Moist red velvet sponge with silky smooth cream cheese frosting.",
                category_id=c3.id,
                base_price=1600.0,
                discount_price=1400.0,
                is_featured=True,
                is_bestseller=True
            )
            db.add_all([p1, p2])
            db.commit()

            img1 = ProductImage(product_id=p1.id, image_url="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800", is_primary=True)
            img2 = ProductImage(product_id=p2.id, image_url="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800", is_primary=True)
            
            v1 = ProductVariant(product_id=p1.id, size_bn="১ পাউন্ড", size_en="1 Pound", price_adjustment=0.0)
            v2 = ProductVariant(product_id=p1.id, size_bn="২ পাউন্ড", size_en="2 Pound", price_adjustment=1100.0)

            db.add_all([img1, img2, v1, v2])
            
            cp1 = Coupon(code="MISTI10", discount_type="PERCENT", discount_value=10.0, min_order_amount=1000.0)
            db.add(cp1)
            db.commit()
    finally:
        db.close()

# Include Routers
app.include_router(auth_router, prefix="/api")
app.include_router(categories_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(cart_router, prefix="/api")
app.include_router(order_router, prefix="/api")
app.include_router(coupons_router, prefix="/api")
app.include_router(custom_cakes_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "brand": "MistiGolpo (মিষ্টি গল্প)"}
