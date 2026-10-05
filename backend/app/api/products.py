from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.models import Product, Category, ProductImage, ProductVariant
from app.schemas.schemas import ProductResponse, CategoryResponse, ProductCreate, CategoryCreate
from app.api.deps import get_admin_user

categories_router = APIRouter(prefix="/categories", tags=["Categories"])
products_router = APIRouter(prefix="/products", tags=["Products"])

# Categories
@categories_router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.is_active == True).order_by(Category.sort_order).all()

@categories_router.post("", response_model=CategoryResponse)
def create_category(cat_in: CategoryCreate, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    category = Category(**cat_in.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

# Products
@products_router.get("", response_model=List[ProductResponse])
def get_products(
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    is_featured: Optional[bool] = None,
    is_bestseller: Optional[bool] = None,
    sort_by: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)
    
    if category_slug:
        query = query.join(Category).filter(Category.slug == category_slug)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Product.name_bn.ilike(search_term)) |
            (Product.name_en.ilike(search_term)) |
            (Product.description_bn.ilike(search_term)) |
            (Product.description_en.ilike(search_term))
        )
        
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
        
    if is_bestseller is not None:
        query = query.filter(Product.is_bestseller == is_bestseller)

    if sort_by == "price_asc":
        query = query.order_by(Product.base_price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.base_price.desc())
    else:
        query = query.order_by(Product.id.desc())

    return query.all()

@products_router.get("/{slug_or_id}", response_model=ProductResponse)
def get_product(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        product = db.query(Product).filter(Product.id == int(slug_or_id)).first()
    else:
        product = db.query(Product).filter(Product.slug == slug_or_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@products_router.post("", response_model=ProductResponse)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db), admin=Depends(get_admin_user)):
    data = product_in.dict()
    images_data = data.pop("images", [])
    variants_data = data.pop("variants", [])

    product = Product(**data)
    db.add(product)
    db.commit()
    db.refresh(product)

    for img in images_data:
        db.add(ProductImage(product_id=product.id, **img))
    for var in variants_data:
        db.add(ProductVariant(product_id=product.id, **var))

    db.commit()
    db.refresh(product)
    return product
