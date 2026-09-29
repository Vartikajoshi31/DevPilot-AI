import pytest
from src.checkout import CheckoutService

def test_checkout_without_coupon():
    service = CheckoutService()
    result = service.process_checkout([{"name": "Widget", "price": 100.0}])
    assert result["status"] == "completed"
    assert result["total_amount"] == 100.0

def test_checkout_with_valid_coupon():
    service = CheckoutService()
    result = service.process_checkout([{"name": "Widget", "price": 100.0}], coupon_code="SAVE20")
    assert result["status"] == "completed"
    assert result["total_amount"] == 80.0
