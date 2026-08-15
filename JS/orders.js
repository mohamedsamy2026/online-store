// Import
import { supabase } from './import_supabase.js';
import { showToast } from './script-supabase.js';

//  ثوابت عامة 
const SHIPPING_COST = 0;

// مصفوفة أسعار الشحن حسب المحافظة
const SHIPPING_RATES = {
    cairo: 60, giza: 55, alex: 50, dakahlia: 45, sharqia: 45,
    qalyubia: 35, kafr_el_sheikh: 50, gharbia: 45, menofia: 40,
    beheira: 45, ismailia: 45, suez: 40, port_said: 45, damietta: 50,
    fayoum: 45, beni_suef: 50, minya: 55, asyut: 55, sohag: 60,
    qena: 60, luxor: 65, aswan: 70, red_sea: 70, new_valley: 75,
    matrouh: 75, north_sinai: 70, south_sinai: 75
};

// أسماء المحافظات بالعربي
const GOVERNORATE_NAMES = {
    cairo: 'القاهرة', giza: 'الجيزة', alex: 'الإسكندرية',
    dakahlia: 'الدقهلية', sharqia: 'الشرقية', qalyubia: 'القليوبية',
    kafr_el_sheikh: 'كفر الشيخ', gharbia: 'الغربية', menofia: 'المنوفية',
    beheira: 'البحيرة', ismailia: 'الإسماعيلية', suez: 'السويس',
    port_said: 'بورسعيد', damietta: 'دمياط', fayoum: 'الفيوم',
    beni_suef: 'بني سويف', minya: 'المنيا', asyut: 'أسيوط',
    sohag: 'سوهاج', qena: 'قنا', luxor: 'الأقصر', aswan: 'أسوان',
    red_sea: 'البحر الأحمر', new_valley: 'الوادي الجديد',
    matrouh: 'مطروح', north_sinai: 'شمال سيناء', south_sinai: 'جنوب سيناء'
};

const TELEGRAM_FUNCTION_NAME = 'send-order-notification';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('my_cart')) || [];
    } catch {
        return [];
    }
}

function getFormData() {
    const name = document.querySelector('#name')?.value?.trim() || '';
    const phone = document.querySelector('#phone')?.value?.trim() || '';
    const address = document.querySelector('#address')?.value?.trim() || '';
    const governorate = document.querySelector('#governorate')?.value?.trim() || '';
    return { name, phone, address, governorate };
}

function validateForm(data) {
    if (!data.name) return 'من فضلك أدخل الاسم';
    if (!data.phone) return 'من فضلك أدخل رقم الهاتف';
    if (!/^01[0125][0-9]{8}$/.test(data.phone.replace(/\s+/g, ''))) return 'رقم الهاتف غير صحيح';
    if (!data.governorate) return 'من فضلك اختر المحافظة أولاً لحساب الشحن';
    if (!data.address) return 'من فضلك أدخل العنوان';
    return null;
}

function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(String(item.price).replace('$', '').trim()) || 0;
        const qty = parseInt(item.qty) || 1;
        return sum + (price * qty);
    }, 0);

    const governorate = document.querySelector('#governorate')?.value?.trim() || '';
    const shipping = SHIPPING_RATES[governorate] || SHIPPING_COST;

    let totalBeforeDiscount = subtotal + shipping;
    let finalTotal = totalBeforeDiscount;
    let couponCode = null;
    let discountAmount = 0;

    const appliedCoupon = JSON.parse(localStorage.getItem('applied_coupon'));

    if (appliedCoupon && appliedCoupon.discountValue) {
        if (appliedCoupon.discountType === 'percent') {
            discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
        } else {
            discountAmount = appliedCoupon.discountValue;
        }
        finalTotal = totalBeforeDiscount - discountAmount;
        couponCode = appliedCoupon.code;
    }

    if (finalTotal < 0) finalTotal = 0;

    return {
        subtotal: Math.round(subtotal),
        shipping,
        discountAmount: Math.round(discountAmount),
        total: Math.round(finalTotal),
        couponCode,
        governorate: GOVERNORATE_NAMES[governorate] || 'غير محدد'
    };
}

async function placeOrder(event) {
    event.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
        showToast('السلة فارغة! أضف منتجات أولاً', 'error');
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        showToast('يجب تسجيل الدخول أولاً لإتمام الطلب', 'error');
        window.location.href = 'login.html';
        return;
    }

    const formData = getFormData();
    const validationError = validateForm(formData);
    if (validationError) {
        showToast(validationError, 'error');
        return;
    }

    const totals = calculateTotals(cart);

    const placeOrderBtn = document.querySelector('#placeOrderBtn');
    const originalBtnText = placeOrderBtn ? placeOrderBtn.innerText : 'Place Order';

    if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerText = '...جاري ارسال الطلب';
        placeOrderBtn.classList.add('opacity-70', 'cursor-not-allowed');
    }

    try {
        // 6. حفظ الطلب في جدول orders (مع إضافة governorate)
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: user.id,
                customer_name: formData.name,
                phone: formData.phone,
                address: formData.address,
                governorate: totals.governorate,  // ✅ أضفنا المحافظة هنا
                subtotal: totals.subtotal,
                shipping: totals.shipping,
                discount_amount: totals.discountAmount,
                total: totals.total,
                coupon_code: totals.couponCode,
                status: 'pending'
            }])
            .select()
            .single();

        if (orderError) {
            console.error('❌ Error saving order:', orderError);
            showToast('حدث خطأ أثناء حفظ الطلب، حاول مرة أخرى', 'error');
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerText = originalBtnText;
                placeOrderBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            }
            return;
        }

        const orderNumber = order.id.split('-')[0].toUpperCase();

        // 7. حفظ المنتجات في جدول order_items
        const orderItems = cart.map(item => {
            const cleanPrice = parseFloat(String(item.price).replace('$', '').trim()) || 0;
            const qty = parseInt(item.qty) || 1;

            return {
                order_id: order.id,
                product_id: null, 
                name: item.name,
                price: cleanPrice,
                quantity: qty,
                image: item.img || item.image || '../public/Imgs/product/0.png'
            };
        });

        const { data: insertedItems, error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)
            .select();

        if (itemsError) {
            console.error('❌ Error saving order items:', itemsError);
            showToast('حدث خطأ أثناء حفظ تفاصيل المنتجات', 'error');
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerText = originalBtnText;
                placeOrderBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            }
            throw itemsError;
        }

        console.log('✅ تم حفظ المنتجات بنجاح:', insertedItems);

        // 8. تسجيل الكوبون لو موجود
        if (totals.couponCode) {
            await supabase
                .from('coupon_redemptions')
                .insert([{
                    order_id: order.id,
                    user_id: user.id,
                    coupon_code: totals.couponCode,
                    discount_amount: totals.discountAmount
                }]);
        }

        // 9. إرسال إشعار Telegram
        try {
            const { error: telegramError } = await supabase.functions.invoke(TELEGRAM_FUNCTION_NAME, {
                body: {
                    orderNumber: `#${orderNumber}`,
                    customerName: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    governorate: totals.governorate,
                    items: cart,
                    subtotal: totals.subtotal,
                    shipping: totals.shipping,
                    discount: totals.discountAmount,
                    total: totals.total,
                    couponCode: totals.couponCode
                }
            });

            if (telegramError) {
                console.error('❌ Telegram notification failed:', telegramError);
            }
        } catch (telegramErr) {
            console.error('❌ Telegram error:', telegramErr);
        }

        // 10. مسح السلة
        localStorage.removeItem('my_cart');
        localStorage.removeItem('applied_coupon');

        // 11. التوجيه لصفحة النجاح
        showToast('تم إرسال طلبك بنجاح!', 'success');
        setTimeout(() => {
            window.location.href = `success.html?orderId=${orderNumber}`;
        }, 1100);

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        showToast('حدث خطأ غير متوقع، حاول مرة أخرى', 'error');
        if (placeOrderBtn) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerText = originalBtnText;
            placeOrderBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const placeOrderBtn = document.querySelector('#placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }
});


