document.addEventListener('DOMContentLoaded', function() {
    // Chức năng thêm sản phẩm vào giỏ hàng
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

    // Xử lý sự kiện nhấn nút mua hàng
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

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const cartCount = localStorage.getItem('cartCount') || 0;
            cartCountElement.textContent = cartCount;
        }
    }

    // Gọi hàm để cập nhật số lượng khi trang tải
    updateCartCount();

    // Chức năng tự động chuyển ảnh banner
    const banner = document.getElementById('banner');
    const images = [
        'img/banner1.jpg',  
        'img/banner2.jpg',
        'img/banner3.jpg',
        'img/banner4.jpg'
    ];

    let currentIndex = 0;

    function changeBannerImage(index) {
        if (index >= 0 && index < images.length) {
            const nextIndex = (index + 1) % images.length;
            banner.classList.remove('fade-in');
            banner.classList.add('fade-out');
            setTimeout(() => {
                banner.src = images[nextIndex];
                banner.classList.remove('fade-out');
                banner.classList.add('fade-in');
                currentIndex = nextIndex;
            }, 1000); // Thời gian để hiệu ứng fade-out hoàn tất
        }
    }

    // Chuyển đổi ảnh mỗi 5 giây
    setInterval(() => {
        changeBannerImage((currentIndex + 1) % images.length);
    }, 5000);

    // Xử lý sự kiện nhấn mũi tên trái
    document.getElementById('prev-button').addEventListener('click', function() {
        changeBannerImage((currentIndex - 1 + images.length) % images.length);
    });

    // Xử lý sự kiện nhấn mũi tên phải
    document.getElementById('next-button').addEventListener('click', function() {
        changeBannerImage((currentIndex + 1) % images.length);
    });

    // Khởi tạo ảnh đầu tiên
    banner.src = images[currentIndex];
    banner.classList.add('fade-in');
});
