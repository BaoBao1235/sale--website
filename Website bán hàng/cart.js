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
    let selectedProduct = null;

    function formatPrice(price) {
        return price.toLocaleString('vi-VN') + ' VND';
    }

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('cartProducts')) || [];
        const productList = document.querySelector('.product-list');
        productList.innerHTML = '';

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <div class="product-details">
                    <p><strong>${product.title}</strong></p>
                    <p>${product.description}</p>
                    <p class="product-price" data-price="${product.price}">${formatPrice(product.price)}</p>
                </div>
                <div class="product-actions">
                    <input type="number" value="${product.quantity}" min="1" data-title="${product.title}" data-price="${product.price}">
                    <button data-action="delete" data-title="${product.title}" data-price="${product.price}">Xóa</button>
                    <button data-action="removeOne" data-title="${product.title}" data-price="${product.price}">Giảm 1</button>
                    <button data-action="select" data-title="${product.title}" data-price="${product.price}">Chọn</button>
                </div>
            `;
            productList.appendChild(productItem);
        });

        calculateTotalPrice();
        updateCartCount();
    }

    function calculateTotalPrice() {
        const products = JSON.parse(localStorage.getItem('cartProducts')) || [];
        let totalPrice = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
        const discount = totalPrice * discountRate;
        const totalAfterDiscount = totalPrice - discount;
        const totalTax = totalAfterDiscount * taxRate;
        const totalPayment = totalAfterDiscount + totalTax;

        document.getElementById('total-price').textContent = formatPrice(totalPrice);
        document.getElementById('vat').textContent = formatPrice(totalTax);
        document.getElementById('total-payment').textContent = formatPrice(totalPayment);
    }

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        const cartCount = localStorage.getItem('cartCount') || 0;
        cartCountElement.textContent = cartCount;
    }

    function updateProductQuantity(title, price, quantity) {
        let cart = JSON.parse(localStorage.getItem('cartProducts')) || [];
        const productIndex = cart.findIndex(product => product.title === title && product.price === price);

        if (productIndex > -1) {
            cart[productIndex].quantity = quantity;
        }

        localStorage.setItem('cartProducts', JSON.stringify(cart));
        localStorage.setItem('cartCount', cart.reduce((total, product) => total + product.quantity, 0));
        calculateTotalPrice();
        updateCartCount();
        window.dispatchEvent(new Event('storage'));
    }

    function deleteProduct(title, price) {
        let cart = JSON.parse(localStorage.getItem('cartProducts')) || [];
        const productIndex = cart.findIndex(product => product.title === title && product.price === price);

        if (productIndex > -1) {
            cart.splice(productIndex, 1);
        }

        localStorage.setItem('cartProducts', JSON.stringify(cart));
        localStorage.setItem('cartCount', cart.reduce((total, product) => total + product.quantity, 0));
        loadProducts();
        calculateTotalPrice();
        updateCartCount();
        window.dispatchEvent(new Event('storage'));
    }

    function removeOneProduct(title, price) {
        let cart = JSON.parse(localStorage.getItem('cartProducts')) || [];
        const productIndex = cart.findIndex(product => product.title === title && product.price === price);

        if (productIndex > -1) {
            if (cart[productIndex].quantity > 1) {
                cart[productIndex].quantity -= 1;
            } else {
                cart.splice(productIndex, 1);
            }
        }

        localStorage.setItem('cartProducts', JSON.stringify(cart));
        localStorage.setItem('cartCount', cart.reduce((total, product) => total + product.quantity, 0));
        loadProducts();
        calculateTotalPrice();
        updateCartCount();
        window.dispatchEvent(new Event('storage'));
    }

    function selectProduct(title, price) {
        const productElements = document.querySelectorAll('.product-item');
        productElements.forEach(productElement => {
            const productTitle = productElement.querySelector('.product-details strong').textContent;
            const productPrice = parseFloat(productElement.querySelector('.product-price').getAttribute('data-price'));

            if (productTitle === title && productPrice === price) {
                productElement.style.backgroundColor = '#d3f9d8'; // Màu nền khi sản phẩm được chọn
                selectedProduct = { title, price, quantity: productElement.querySelector('input[type="number"]').value };
            } else {
                productElement.style.backgroundColor = ''; // Reset màu nền của các sản phẩm khác
            }
        });

        localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
    }

    function handlePayment() {
        if (!selectedProduct) {
            alert('Vui lòng chọn sản phẩm để thanh toán.');
            return;
        }

        window.location.href = 'pay.html';
    }

    function applyPromoCode() {
        const promoCodeInput = document.getElementById('promo-code-input').value;
        const promoEndTime = localStorage.getItem('promoEndTime');
        const currentTime = new Date().toISOString();

        if (promoEndTime && currentTime < promoEndTime) {
            if (promoCodes.hasOwnProperty(promoCodeInput)) {
                discountRate = promoCodes[promoCodeInput];
                showNotification(`Mã ${promoCodeInput} đã được áp dụng, bạn được giảm ${discountRate * 100}%!`, 'success');
            } else {
                discountRate = 0;
                showNotification('Mã giảm giá không hợp lệ.', 'error');
            }
        } else {
            discountRate = 0;
            showNotification('Hiện tại thời khuyến mãi đã hết nên mã không được áp dụng.', 'error');
        }
        calculateTotalPrice();
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

    document.querySelector('.pay-button').addEventListener('click', handlePayment);
    document.querySelector('.delete-button').addEventListener('click', () => {
        localStorage.removeItem('cartProducts');
        localStorage.removeItem('cartCount');
        loadProducts();
        updateCartCount();
        showNotification('Đơn hàng đã bị hủy.', 'error');
    });
    document.getElementById('apply-promo').addEventListener('click', applyPromoCode);

    document.addEventListener('input', function(event) {
        if (event.target.matches('input[type="number"]')) {
            const title = event.target.getAttribute('data-title');
            const price = parseFloat(event.target.getAttribute('data-price'));
            const quantity = parseInt(event.target.value);
            updateProductQuantity(title, price, quantity);
        }
    });

    document.addEventListener('click', function(event) {
        const action = event.target.getAttribute('data-action');
        if (action === 'delete') {
            const title = event.target.getAttribute('data-title');
            const price = parseFloat(event.target.getAttribute('data-price'));
            deleteProduct(title, price);
        } else if (action === 'removeOne') {
            const title = event.target.getAttribute('data-title');
            const price = parseFloat(event.target.getAttribute('data-price'));
            removeOneProduct(title, price);
        } else if (action === 'select') {
            const title = event.target.getAttribute('data-title');
            const price = parseFloat(event.target.getAttribute('data-price'));
            selectProduct(title, price);
        }
    });

    loadProducts();
});
