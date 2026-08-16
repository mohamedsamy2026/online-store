// التبديل بين التبويبات
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // إضافة active للزر المضغوط
        btn.classList.add('active');

        // إظهار المحتوى المناسب
        const tabId = btn.dataset.tab;
        document.getElementById(`${tabId}-content`).classList.add('active');
    });
});

// كشف نوع الجهاز تلقائياً
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // لو موبايل، اعرض تاب الموبايل
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    document.querySelector('[data-tab="mobile"]').classList.add('active');
    document.getElementById('mobile-content').classList.add('active');
}