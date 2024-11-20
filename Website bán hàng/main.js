document.addEventListener('DOMContentLoaded', function() {
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cartProducts')) || [];
        let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProductIndex = cart.findIndex(item => item.title === product.title && item.price === product.price);
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }

        localStorage.setItem('cartProducts', JSON.stringify(cart));
        cartCount += 1;
        localStorage.setItem('cartCount', cartCount);

        // Cập nhật số lượng hàng trên trang chính
        updateCartCount();
        // Phát sự kiện để đồng bộ hóa giỏ hàng giữa các trang
        window.dispatchEvent(new Event('storage'));
    }

    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                image: productCard.querySelector('.product-image').src,
                title: productCard.querySelector('.product-title').textContent,
                description: productCard.querySelector('.product-description').textContent,
                price: parseFloat(productCard.querySelector('.product-price').getAttribute('data-price')),
            };
            addToCart(product);
        });
    });

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        const cartCount = localStorage.getItem('cartCount') || 0;
        cartCountElement.textContent = cartCount;
    }

    // Gọi hàm để cập nhật số lượng khi trang tải
    updateCartCount();

    // Lắng nghe sự kiện lưu trữ để cập nhật giỏ hàng khi có thay đổi từ các trang khác
    window.addEventListener('storage', updateCartCount);

    // Thêm sự kiện để thay đổi src của iframe khi nhấn vào biểu tượng giỏ hàng
    document.querySelector('.fa-cart-shopping').addEventListener('click', function() {
        const iframe = document.getElementById('main-frame');
        iframe.src = 'cart.html';
    });

    // Hiển thị thông báo chào mừng khi trang chủ được tải
    if (window.location.href.includes('Menu.html')) {
        alert('Chào mừng đến shop vui vẻ của chúng tôi!');
    }

    // Hàm để chuyển hướng về trang chủ và hiển thị thông báo chào mừng
    window.redirectToHome = function() {
        if (confirm('Chào mừng đến shop vui vẻ của chúng tôi!')) {
            window.location.href = 'Mywebsite.html'; // Chuyển hướng đến trang chủ
        }
    };
});
