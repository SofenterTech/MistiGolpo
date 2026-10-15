from backend.app.db.database import SessionLocal, engine, Base
from backend.app.models.user import User, UserRole
from backend.app.models.product import Category, Product
from backend.app.models.coupon import Coupon
from backend.app.core.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        admin_email = "admin@mistigolpo.com"
        if not db.query(User).filter(User.email == admin_email).first():
            admin = User(
                full_name="MistiGolpo Admin",
                email=admin_email,
                phone="01700000000",
                hashed_password=get_password_hash("AdminPassword123!"),
                role=UserRole.ADMIN.value
            )
            db.add(admin)

        categories_data = [
            {"name_bn": "জন্মদিনের কেক", "name_en": "Birthday Cakes", "slug": "birthday-cakes", "image_url": "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=600"},
            {"name_bn": "চকলেট কেক", "name_en": "Chocolate Cakes", "slug": "chocolate-cakes", "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600"},
            {"name_bn": "রেড ভেলভেট কেক", "name_en": "Red Velvet Cakes", "slug": "red-velvet-cakes", "image_url": "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&q=80&w=600"},
            {"name_bn": "কাস্টম কেক", "name_en": "Custom Cakes", "slug": "custom-cakes", "image_url": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=600"}
        ]

        cat_map = {}
        for c in categories_data:
            existing = db.query(Category).filter(Category.slug == c["slug"]).first()
            if not existing:
                cat = Category(**c)
                db.add(cat)
                db.flush()
                cat_map[c["slug"]] = cat.id
            else:
                cat_map[c["slug"]] = existing.id

        products_data = [
            {
                "category_slug": "chocolate-cakes",
                "name_bn": "চকলেট ট্রাফল কেক",
                "name_en": "Chocolate Truffle Cake",
                "slug": "chocolate-truffle-cake",
                "description_bn": "সম্পূর্ণ প্রিমিয়াম বেলজিয়ান চকলেটে তৈরি রিচ ও ক্রিস্পি লেয়ারড কেক।",
                "description_en": "Rich layered chocolate cake topped with Belgian truffle cream.",
                "base_price": 1250.0,
                "discount_price": 1100.0,
                "is_featured": True,
                "is_bestseller": True,
                "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600"
            },
            {
                "category_slug": "red-velvet-cakes",
                "name_bn": "প্রিমিয়াম রেড ভেলভেট কেক",
                "name_en": "Premium Red Velvet Cake",
                "slug": "premium-red-velvet-cake",
                "description_bn": "নরম স্পঞ্জি রেড ভেলভেট লেয়ার এবং কটেজ চিজ ফ্রস্টিং।",
                "description_en": "Soft velvety sponge layers paired with rich cream cheese frosting.",
                "base_price": 1450.0,
                "discount_price": 1300.0,
                "is_featured": True,
                "is_bestseller": False,
                "image_url": "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&q=80&w=600"
            },
            {
                "category_slug": "birthday-cakes",
                "name_bn": "ভ্যানিলা স্ট্রবেরি স্পেশাল কেক",
                "name_en": "Vanilla Strawberry Special Cake",
                "slug": "vanilla-strawberry-cake",
                "description_bn": "তাজা স্ট্রবেরি ক্রাশ এবং ভ্যানিলা স্পঞ্জের চমৎকার মিশ্রণ।",
                "description_en": "Fresh strawberry crush enveloped in light vanilla sponge.",
                "base_price": 1100.0,
                "discount_price": None,
                "is_featured": False,
                "is_bestseller": True,
                "image_url": "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=600"
            }
        ]

        for p in products_data:
            cat_slug = p.pop("category_slug")
            p["category_id"] = cat_map[cat_slug]
            existing_prod = db.query(Product).filter(Product.slug == p["slug"]).first()
            if not existing_prod:
                prod = Product(**p)
                db.add(prod)

        if not db.query(Coupon).filter(Coupon.code == "MISTI10").first():
            db.add(Coupon(code="MISTI10", discount_percent=10.0, min_order_amount=1000.0, max_discount_amount=200.0))

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
