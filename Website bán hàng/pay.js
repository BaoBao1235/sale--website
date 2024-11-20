document.addEventListener('DOMContentLoaded', function() {
    const taxRate = 0.05;
    const promoCodes = {
        'A': 0.15,
        'B': 0.20,
        'C': 0.25,
        'D': 0.30,
        'E': 0.35,
        'F': 0.40,
        'G': 0.45,
        'H': 0.50,
        'I': 0.55,
        'J': 0.60,
        'K': 0.65,
        'L': 0.70,
        'M': 0.75,
        'N': 0.80,
        'O': 0.85,
        'P': 0.90,
        'Q': 0.95,
        'R': 1.00,
    };
    let discountRate = 0;

    function formatPrice(price) {
        return price.toLocaleString('vi-VN') + ' VND';
    }

    function loadPaymentDetails() {
        const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
        if (selectedProduct) {
            document.getElementById('product').value = selectedProduct.title;
            document.getElementById('quantity').value = selectedProduct.quantity;
            document.getElementById('price').value = formatPrice(selectedProduct.price);
            calculateTotalAmount();
        } else {
            document.getElementById('product').value = '';
            document.getElementById('quantity').value = '';
            document.getElementById('price').value = '';
            document.getElementById('total-amount').value = formatPrice(0);
        }
    }

    function calculateTotalAmount() {
        const shippingFee = 50000;

        // Lấy giá và số lượng từ các trường nhập liệu
        const priceInput = document.getElementById('price').value;
        const quantityInput = document.getElementById('quantity').value;

        // Chuyển đổi giá và số lượng thành số thực và số nguyên
        const price = parseFloat(priceInput.replace(/[^0-9.-]+/g, ""));
        const quantity = parseInt(quantityInput, 10);

        // Kiểm tra tính hợp lệ của giá và số lượng
        if (isNaN(price) || isNaN(quantity) || quantity <= 0) {
            document.getElementById('total-amount').value = formatPrice(0);
            return;
        }

        // Tính toán tổng tiền
        const totalPrice = price * quantity;
        const discount = totalPrice * discountRate;
        const totalAfterDiscount = totalPrice - discount;
        const totalTax = totalAfterDiscount * taxRate;
        const totalAmount = totalAfterDiscount + totalTax + shippingFee;

        document.getElementById('total-amount').value = formatPrice(totalAmount);
    }

    function applyDiscountCode() {
        const discountCodeInput = document.getElementById('discount-code').value.trim();
        const promoEndTime = localStorage.getItem('promoEndTime');
        const currentTime = new Date().toISOString();

        if (promoEndTime && currentTime < promoEndTime) {
            if (promoCodes.hasOwnProperty(discountCodeInput)) {
                discountRate = promoCodes[discountCodeInput];
                showNotification(`Mã ${discountCodeInput} đã được áp dụng, bạn được giảm ${discountRate * 100}%!`, 'success');
            } else {
                discountRate = 0;
                showNotification('Mã giảm giá không hợp lệ.', 'error');
            }
        } else {
            discountRate = 0;
            showNotification('Hiện tại thời khuyến mãi đã hết nên mã không được áp dụng.', 'error');
        }
        calculateTotalAmount();
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    document.getElementById('apply-discount').addEventListener('click', applyDiscountCode);
    document.getElementById('payment-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Thanh toán thành công!');
        localStorage.removeItem('selectedProduct');
        loadPaymentDetails();
    });

    loadPaymentDetails();
});
