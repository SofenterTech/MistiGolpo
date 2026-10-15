from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.db.database import get_db
from backend.app.models.product import Category, Product
from backend.app.schemas.schemas import CategoryOut, ProductOut

router = APIRouter(tags=["products"])

@router.get("/categories", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.is_active == True).all()

@router.get("/products", response_model=List[ProductOut])
def get_products(
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    bestseller: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)

    if category_slug:
        cat = db.query(Category).filter(Category.slug == category_slug).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Product.name_bn.like(search_pattern)) |
            (Product.name_en.ilike(search_pattern)) |
            (Product.description_bn.like(search_pattern)) |
            (Product.description_en.ilike(search_pattern))
        )

    if featured is not None:
        query = query.filter(Product.is_featured == featured)

    if bestseller is not None:
        query = query.filter(Product.is_bestseller == bestseller)

    return query.all()

@router.get("/products/{slug}", response_model=ProductOut)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
