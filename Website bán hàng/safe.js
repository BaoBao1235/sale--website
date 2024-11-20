document.addEventListener('DOMContentLoaded', function() {
    const setPromoButton = document.getElementById('set-promo-time');
    const resetPromoButton = document.getElementById('reset-promo-time');
    const countdownElement = document.getElementById('countdown');
    const promoStatusElement = document.getElementById('promo-status');

    function updateCountdown() {
        const promoEndTime = localStorage.getItem('promoEndTime');
        const now = new Date().getTime();

        if (promoEndTime) {
            const endTime = new Date(promoEndTime).getTime();
            const distance = endTime - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                countdownElement.textContent = `Còn lại: ${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
                promoStatusElement.textContent = '';

                setTimeout(updateCountdown, 1000); // Cập nhật đếm ngược mỗi giây
            } else {
                countdownElement.textContent = 'Còn lại: 0 ngày 0 giờ 0 phút 0 giây';
                promoStatusElement.textContent = 'Hiện tại thời gian khuyến mãi đã hết.';
            }
        } else {
            countdownElement.textContent = 'Còn lại: 0 ngày 0 giờ 0 phút 0 giây';
            promoStatusElement.textContent = 'Chưa đặt thời gian khuyến mãi.';
        }
    }

    setPromoButton.addEventListener('click', function() {
        const promoEndTime = document.getElementById('promo-end-time').value;
        if (promoEndTime) {
            localStorage.setItem('promoEndTime', new Date(promoEndTime).toISOString());
            alert('Đã đặt thời gian khuyến mãi!');
            updateCountdown();
        } else {
            alert('Vui lòng chọn thời gian kết thúc khuyến mãi.');
        }
    });

    resetPromoButton.addEventListener('click', function() {
        localStorage.removeItem('promoEndTime');
        countdownElement.textContent = 'Còn lại: 0 ngày 0 giờ 0 phút 0 giây';
        promoStatusElement.textContent = 'Chưa đặt thời gian khuyến mãi.';
        alert('Đã reset thời gian khuyến mãi!');
    });

    // Hiển thị đếm ngược khi tải trang
    updateCountdown();
});
