import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["brand"] == "MistiGolpo"

def test_user_registration_and_login():
    email = "testuser@example.com"
    password = "SecretPassword123!"
    
    reg_response = client.post("/api/auth/register", json={
        "full_name": "Test Customer",
        "email": email,
        "phone": "01711112223",
        "password": password
    })
    assert reg_response.status_code in [200, 400]
    
    login_response = client.post("/api/auth/login", json={
        "email": email,
        "password": password
    })
    assert login_response.status_code == 200
    data = login_response.json()
    assert "access_token" in data
    assert data["role"] == "CUSTOMER"

def test_categories_and_products():
    cat_response = client.get("/api/categories")
    assert cat_response.status_code == 200
    
    prod_response = client.get("/api/products")
    assert prod_response.status_code == 200
