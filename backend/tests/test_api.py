import pytest
from fastapi.testclient import TestClient
from app.main import app, startup_event
from app.db.database import Base, engine

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    startup_event()

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_categories_endpoint():
    response = client.get("/api/categories")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_products_endpoint():
    response = client.get("/api/products")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0
