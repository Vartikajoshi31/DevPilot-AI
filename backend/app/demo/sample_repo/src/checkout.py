class CheckoutService:
    def __init__(self):
        self.discounts = {"SAVE20": 0.20, "SUPER50": 0.50}

    def process_checkout(self, items: list, coupon_code: str = None) -> dict:
        total = sum(item["price"] for item in items)
        
        if coupon_code:
            discount = self.discounts.get(coupon_code)
            if discount:
                # Bug: Missing validation when total becomes zero or negative
                total = total - (total * discount)
            else:
                raise ValueError(f"Invalid coupon code: {coupon_code}")
                
        return {"status": "completed", "total_amount": round(total, 2)}
