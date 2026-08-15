// Import Supabase
import { supabase } from './import_supabase.js';

// تعريف عناصر الـ HTML
const ordersContainer = document.getElementById('orders-container');
const emptyState = document.getElementById('empty-state');
const totalOrdersCount = document.getElementById('total-orders-count');
const searchInput = document.getElementById('search-input');

// إعدادات حالات الطلب
const statusConfig = {
  pending: {
    bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500',
    icon: 'fa-hourglass-half', label1: 'Pending', label2: 'Processing'
  },
  shipping: {
    bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500',
    icon: 'fa-truck-fast', label1: 'Shipping', label2: 'In Transit'
  },
  delivered: {
    bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500',
    icon: 'fa-circle-check', label1: 'Delivered', label2: 'Done'
  }
};

// دوال مساعدة
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}


function formatPrice(price) {
  return Number(price).toLocaleString('en-US');
}

// دالة بناء كارت الطلب
function createOrderCard(order) {
  const status = statusConfig[order.status] || statusConfig.pending;
  const orderIdShort = order.id.substring(0, 8);
  const orderDate = formatDate(order.created_at);
  const cardBorder = order.status === 'shipping' ? 'border-orange-200/60' : 'border-gray-200';

  const productsHTML = order.order_items.map((item, index) => {
    const separator = index > 0 ? 'border-t-2 border-gray-200 pt-4 mt-2' : '';
    const imageUrl = item.image && item.image.trim() !== '' ? item.image : '../public/Imgs/product/0.png';

    return `
          <div class="flex items-center md:flex-row flex-col md:justify-between gap-4 py-2 ${separator}">
            <div class="flex items-center flex-col md:flex-row gap-3 md:gap-4 flex-1">
              <div class="group cursor-pointer w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 shrink-0 shadow-inner overflow-hidden">
                <img src="${imageUrl}" class="group-hover:scale-110 transition-transform duration-300 w-full h-full object-contain" alt="${item.name}">
              </div>
              <div>
                <h4 class="font-bold text-black lg:text-lg hover:text-orange-600 transition-colors cursor-pointer">${item.name}</h4>
                <p class="text-heading text-[15px] md:text-sm mt-1 flex items-center gap-3">
                  <span><i class="fa-solid fa-layer-group text-heading"></i> Qty: <strong class="text-heading">${item.quantity}</strong></span>
                </p>
              </div>
            </div>
            <div class="text-center md:text-right">
              <span class="font-black text-main text-[20px] md:text-[23px] block">${item.price} $</span>
            </div>
          </div>
        `;
  }).join('');

  const couponHTML = order.coupon_code ? `
        <div class="flex justify-between text-[15px]">
          <span class="ps-8">Coupon <strong class="text-main">(${order.coupon_code}):</strong></span>
          <span class="font-black text-blue-500 text-[16px]">${order.discount_amount} $</span>
        </div>
      ` : '';

  // دمج المحافظة والعنوان بشكل نظيف
  const fullAddress = (order.governorate && order.governorate !== 'غير محدد')
    ? `${order.governorate} - ${order.address}`
    : (order.address || 'N/A');

  return `
        <div class="bg-white rounded-2xl shadow-sm border ${cardBorder} overflow-hidden hover:shadow-md transition-all duration-300 mb-16 mt-10">
          <div class="bg-gray-100 px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex flex-col md:flex-row space-y-3 md:justify-between items-center gap-3 md:gap-4">
            <div class="flex flex-wrap items-center gap-3 md:gap-6 space-x-6">
              <div>
                <span class="text-[14px] font-bold text-gray-600 mb-2 block">Order ID</span>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-[16px] font-black text-black">#${orderIdShort}</span>
                </div>
              </div>
              <div class="h-14 w-[1.5px] bg-gray-400"></div>
              <div>
                <span class="text-[14px] font-bold text-gray-600 block">Order Date</span>
                <span class="text-[16px] font-bold text-black mt-0.5 block">${orderDate}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="${status.bg} ${status.text} text-[14px] font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-xl border ${status.border} flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full ${status.dot} animate-pulse"></span>
                <i class="fa-solid ${status.icon}"></i>
                <span>${status.label1}</span>
                <span>${status.label2}</span>
              </span>
            </div>
          </div>

          <div class="p-4 md:p-6">
            ${productsHTML}
          </div>

          <div class="px-4 md:px-6 py-4 border-t-2 border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-100 p-3 rounded-xl border border-gray-200 space-y-4">
              <h5 class="text-[18px] font-bold text-heading uppercase mb-3 flex items-center gap-1 border-gray-300 border-b-2 pb-2">
                <i class="fa-solid fa-truck text-orange-500"></i> Shipping
              </h5>
              <div class="flex justify-between items-center">
                <p class="text-[16px] text-black font-bold ps-7">Name:</p>
                <span class="text-blue-500">${order.customer_name}</span>
              </div>
              <div class="flex justify-between items-center">
                <p class="text-[16px] text-black font-bold ps-7">Address:</p>
                <!-- ✅ السطر ده تم تصليحه ليكون كاملاً ويعرض العنوان بدون قص -->
                <span class="text-blue-500 text-right break-words" title="${fullAddress}">${fullAddress}</span>
              </div>
            </div>

            <div class="bg-gray-100 p-3 rounded-xl border border-gray-200">
              <h5 class="text-[18px] font-bold text-heading uppercase mb-2 flex items-center gap-1 border-gray-300 border-b-2 pb-2">
                <i class="fa-solid fa-receipt text-orange-500"></i> Summary
              </h5>
              <div class="space-y-4 mt-3">
                <div class="flex justify-between text-black text-[15px]">
                  <span class="ps-8">Subtotal:</span>
                  <span class="font-bold text-[16px] text-black text-blue-500">${formatPrice(order.subtotal)} $</span>
                </div>
                ${couponHTML}
                <div class="flex justify-between text-black text-[15px]">
                  <span class="ps-8">Shipping:</span>
                  <span class="font-bold text-[16px] text-black text-blue-500">${order.shipping} $</span>
                </div>
                <div class="flex justify-between text-blue-500 text-[18px]">
                  <span class="ps-8">Total:</span>
                  <span class="text-[18px] text-black text-blue-800">${formatPrice(order.total)} $</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
}

// الدالة الرئيسية
async function loadOrders() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    ordersContainer.innerHTML = '<p class="text-center text-red-500 py-10">Please log in to view your orders.</p>';
    emptyState.classList.add('hidden');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, order_items (*)`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      ordersContainer.innerHTML = '';
      emptyState.classList.remove('hidden');
      totalOrdersCount.textContent = '0';
      return;
    }

    emptyState.classList.add('hidden');
    totalOrdersCount.textContent = data.length;
    ordersContainer.innerHTML = data.map(createOrderCard).join('');

  } catch (error) {
    console.error('Error fetching orders:', error);
    ordersContainer.innerHTML = '<p class="text-center text-red-500 py-10 text-2xl">Error loading orders.</p>';
  }
}

// ميزة البحث
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const orderCards = ordersContainer.querySelectorAll('.bg-white.rounded-2xl');
    orderCards.forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
    });
  });
}

document.addEventListener('DOMContentLoaded', loadOrders);