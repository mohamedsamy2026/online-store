// ==========================================
// 1. رابط الـ Edge Function الآمن
// ==========================================
const EDGE_FUNCTION_URL = 'https://vjvrpabmbereiegvsmam.supabase.co/functions/v1/dashboard-api';

// ==========================================
// 2. التنقل ما بين الأقسام
// ==========================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section-content');
const pageTitle = document.getElementById('page-title');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        link.classList.add('active');
        const targetId = `section-${link.dataset.target}`;
        document.getElementById(targetId).classList.add('active');
        pageTitle.textContent = link.querySelector('span').textContent;
    });
});

// ==========================================
// 3. دالة مساعدة للاتصال بالـ Edge Function
// ==========================================
async function callEdgeFunction(action) {
    try {
        const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: action })
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        return result.data;
    } catch (error) {
        console.error(`خطأ في استدعاء ${action}:`, error);
        throw error;
    }
}

// ==========================================
// 4. دوال تنسيق الأرقام والتاريخ
// ==========================================
function formatNumber(num) {
    return Number(num).toLocaleString('en-US');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ==========================================
// 5. دالة جلب الإحصائيات (عن طريق الـ Function)
// ==========================================
async function loadStats() {
    try {
        const stats = await callEdgeFunction('getStats');

        const statCards = document.querySelectorAll('#section-overview .text-3xl');
        if (statCards.length >= 4) {
            statCards[0].textContent = `$${formatNumber(stats.totalSales)}`;
            statCards[1].textContent = formatNumber(stats.totalOrders);
            statCards[2].textContent = formatNumber(stats.pendingOrders);
            statCards[3].textContent = formatNumber(stats.productsCount || 0);
        }
    } catch (error) {
        console.error('خطأ في جلب الإحصائيات:', error);
    }
}

// ==========================================
// 6. دالة جلب آخر 5 طلبات (عن طريق الـ Function)
// ==========================================
async function loadRecentOrders() {
    const recentOrdersBody = document.getElementById('recent-orders-body');

    try {
        const orders = await callEdgeFunction('getRecentOrders');
        recentOrdersBody.innerHTML = '';

        if (!orders || orders.length === 0) {
            recentOrdersBody.innerHTML = `
                <tr>
                    <td colspan="5" class="py-8 text-center text-gray-400">لا توجد طلبات حالياً</td>
                </tr>
            `;
            return;
        }

        orders.forEach(order => {
            let statusBadge = '';
            if (order.status === 'pending') {
                statusBadge = '<span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">قيد الانتظار</span>';
            } else if (order.status === 'shipping') {
                statusBadge = '<span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">قيد الشحن</span>';
            } else if (order.status === 'delivered') {
                statusBadge = '<span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">تم التسليم</span>';
            } else {
                statusBadge = `<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">${order.status}</span>`;
            }

            const row = `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="py-4 px-4 font-mono text-sm">#${order.id.substring(0, 8)}</td>
                    <td class="py-4 px-4 font-bold">${order.customer_name}</td>
                    <td class="py-4 px-4 text-sm text-gray-500">${formatDate(order.created_at)}</td>
                    <td class="py-4 px-4 font-bold text-gray-800">$${formatNumber(order.total)}</td>
                    <td class="py-4 px-4">${statusBadge}</td>
                </tr>
            `;
            recentOrdersBody.innerHTML += row;
        });

    } catch (error) {
        console.error('خطأ في جلب الطلبات:', error);
        recentOrdersBody.innerHTML = `
            <tr>
                <td colspan="5" class="py-8 text-center text-red-400">حدث خطأ في تحميل الطلبات</td>
            </tr>
        `;
    }
}

// ==========================================
// 7. تشغيل الدوال عند تحميل الصفحة
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadStats();
    await loadRecentOrders();
});