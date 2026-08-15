import { supabase } from './import_supabase.js';
import { showToast } from './script-supabase.js';


// ثوابت عامة (لازم تكون هنا عشان refreshCheckoutTotals تستخدمها)
const SHIPPING_COST = 0;

const SHIPPING_RATES = {
    cairo: 60,
    giza: 55,
    alex: 50,
    dakahlia: 45,
    sharqia: 45,
    qalyubia: 35,
    kafr_el_sheikh: 50,
    gharbia: 45,
    menofia: 40,
    beheira: 45,
    ismailia: 45,
    suez: 40,
    port_said: 45,
    damietta: 50,
    fayoum: 45,
    beni_suef: 50,
    minya: 55,
    asyut: 55,
    sohag: 60,
    qena: 60,
    luxor: 65,
    aswan: 70,
    red_sea: 70,
    new_valley: 75,
    matrouh: 75,
    north_sinai: 70,
    south_sinai: 75
};

const GOVERNORATE_NAMES = {
    cairo: 'القاهرة',
    giza: 'الجيزة',
    alex: 'الإسكندرية',
    dakahlia: 'الدقهلية',
    sharqia: 'الشرقية',
    qalyubia: 'القليوبية',
    kafr_el_sheikh: 'كفر الشيخ',
    gharbia: 'الغربية',
    menofia: 'المنوفية',
    beheira: 'البحيرة',
    ismailia: 'الإسماعيلية',
    suez: 'السويس',
    port_said: 'بورسعيد',
    damietta: 'دمياط',
    fayoum: 'الفيوم',
    beni_suef: 'بني سويف',
    minya: 'المنيا',
    asyut: 'أسيوط',
    sohag: 'سوهاج',
    qena: 'قنا',
    luxor: 'الأقصر',
    aswan: 'أسوان',
    red_sea: 'البحر الأحمر',
    new_valley: 'الوادي الجديد',
    matrouh: 'مطروح',
    north_sinai: 'شمال سيناء',
    south_sinai: 'جنوب سيناء'
};



// 1. دالة إرجاع الزرار لحالته الأصلية
function resetButtonState(button) {
    if (button) {
        button.disabled = false;
        button.innerText = "Apply Coupon";
    }
}


// 2. تحديث الأسعار مباشرة بناءً على localStorage فقط
function refreshCheckoutTotals() {
    const subtotalEl = document.querySelector("#checkout .held .space-y-3 div:nth-child(1) small");
    const shippingEl = document.querySelector("#checkout .held .space-y-3 div:nth-child(2) small");
    const totalEl = document.querySelector("#checkout .held .space-y-3 div:nth-child(3) small");

    if (!subtotalEl || !totalEl) return;

    let subtotalText = subtotalEl.innerText.replace('$', '').trim();
    let subtotal = parseFloat(subtotalText) || 0;

    // نقرأ المحافظة
    const governorateInput = document.getElementById('governorate');
    const governorate = governorateInput ? governorateInput.value.trim() : '';

    // لو مفيش محافظة مختارة، نظهر "حدد المحافظة"
    let shipping = 0;
    if (shippingEl) {
        if (!governorate) {
            shippingEl.innerText = 'حدد المحافظة اولا';
            shippingEl.classList.add('text-gray-400'); // لون رمادي فاتح
        } else {
            shipping = SHIPPING_RATES[governorate] || SHIPPING_COST;
            shippingEl.innerText = '$' + shipping;
            shippingEl.classList.remove('text-gray-400');
            shippingEl.classList.add('text-main');
            shippingEl.classList.add('text-[20px]');
        }
    }

    let finalTotal = subtotal + shipping;

    const appliedCoupon = JSON.parse(localStorage.getItem("applied_coupon"));

    if (appliedCoupon && appliedCoupon.discountValue) {
        let discountAmount = 0;
        if (appliedCoupon.discountType === 'percent') {
            discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
        } else {
            discountAmount = appliedCoupon.discountValue;
        }

        finalTotal = finalTotal - discountAmount;
        if (finalTotal < 0) finalTotal = 0;
    }

    totalEl.innerText = '$' + Math.round(finalTotal);
}


// 3. دالة مزامنة الواجهة عند تحميل الصفحة (تم تصحيحها جذرياً)
async function syncCouponUI() {
    const buttonCoupon = document.querySelector(".btn-coupon");
    const inputCoupon = document.querySelector(".input-coupon");
    if (!buttonCoupon || !inputCoupon) return;

    const { data: { user } } = await supabase.auth.getUser();

    // لو مفيش يوزر، نظف كل حاجة
    if (!user) {
        localStorage.removeItem("applied_coupon");
        resetButtonState(buttonCoupon);
        inputCoupon.value = "";
        inputCoupon.disabled = false;
        inputCoupon.placeholder = "Enter Your Coupon Code";
        refreshCheckoutTotals();
        return;
    }

    // ✅ التعديل الجذري: نعتمد على localStorage كمصدر وحيد للحالة الحالية
    // لا نبحث في الداتا بيز عن كوبونات قديمة لنعيد تطبيقها تلقائياً
    const appliedCoupon = JSON.parse(localStorage.getItem("applied_coupon"));

    if (appliedCoupon && appliedCoupon.userId === user.id) {
        // الكوبون موجود وصاحب الحساب هو المستخدم الحالي (حالة سليمة)
        resetButtonState(buttonCoupon);
        inputCoupon.disabled = false;
        inputCoupon.placeholder = `مطبق: ${appliedCoupon.code}`;
    } else {
        // لا يوجد كوبون حالي في السلة، نظف أي آثار قديمة
        localStorage.removeItem("applied_coupon");
        resetButtonState(buttonCoupon);
        inputCoupon.value = "";
        inputCoupon.disabled = false;
        inputCoupon.placeholder = "Enter Your Coupon Code";
    }

    // تحديث السعر بناءً على ما هو موجود في localStorage فقط
    refreshCheckoutTotals();
}



// 4. عند تحميل الصفحة أول مرة
document.addEventListener("DOMContentLoaded", () => {
    syncCouponUI();
    // استرجع المحافظة المحفوظة من localStorage
    const savedGovernorate = localStorage.getItem('selected_governorate');
    const savedGovernorateText = localStorage.getItem('selected_governorate_text');

    if (savedGovernorate && savedGovernorateText && governorateInput && selectedGovernorate) {
        governorateInput.value = savedGovernorate;
        selectedGovernorate.textContent = savedGovernorateText;
        selectedGovernorate.classList.remove('text-[#7b7b7b]');
        selectedGovernorate.classList.add('text-gray-900');

        // حدث السعر فوراً
        if (typeof refreshCheckoutTotals === 'function') {
            refreshCheckoutTotals();
        }
    }
});



// 5. مراقبة حالة تسجيل الدخول أو الخروج
supabase.auth.onAuthStateChange(async (event) => {
    if (event === 'SIGNED_OUT') {
        localStorage.removeItem("applied_coupon");
        const buttonCoupon = document.querySelector(".btn-coupon");
        const inputCoupon = document.querySelector(".input-coupon");
        if (buttonCoupon) resetButtonState(buttonCoupon);
        if (inputCoupon) {
            inputCoupon.value = "";
            inputCoupon.disabled = false;
        }
        refreshCheckoutTotals();
    }

    if (event === 'SIGNED_IN') {
        setTimeout(async () => {
            await syncCouponUI();
        }, 300);
    }
});




// 6. حدث الضغط على زرار تطبيق الكوبون (هنا فقط نبحث في الداتا بيز)
document.addEventListener("click", async (event) => {
    const buttonCoupon = event.target.closest(".btn-coupon");
    if (!buttonCoupon) return;

    const inputCoupon = document.querySelector(".input-coupon");
    if (!inputCoupon) return;

    const couponCode = inputCoupon.value.trim();
    if (!couponCode) {
        showToast("من فضلك ادخل كود الكوبون", "error");
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        showToast("يجب تسجيل الدخول أولاً لاستخدام الكوبون", "error");
        return;
    }

    buttonCoupon.disabled = true;
    buttonCoupon.innerText = "...جاري التحقق";

    // 1. البحث عن الكوبون وتفاصيله
    const { data: couponData, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode)
        .eq('is_active', true)
        .maybeSingle();

    if (couponError || !couponData) {
        showToast("الكوبون غير صحيح أو منتهي الصلاحية", "error");
        inputCoupon.value = "";
        resetButtonState(buttonCoupon);
        return;
    }

    // 2. التحقق من عدم الاستخدام المسبق من جدول coupon_redemptions
    const { data: userUsage } = await supabase
        .from('coupon_redemptions')
        .select('id')
        .eq('coupon_code', couponData.code)
        .eq('user_id', user.id);

    if (userUsage && userUsage.length > 0) {
        showToast("لقد استخدمت هذا الكوبون من قبل!", "error");
        inputCoupon.value = "";
        resetButtonState(buttonCoupon);
        return;
    }

    // 3. حفظ الكوبون في الـ Local Storage (ليصبح سارياً للسلة الحالية فقط)
    const couponInfo = {
        code: couponData.code,
        discountValue: couponData.discount_value,
        discountType: couponData.discount_type,
        userId: user.id,
        couponId: couponData.id
    };

    localStorage.setItem("applied_coupon", JSON.stringify(couponInfo));
    showToast("تم تطبيق الكوبون بنجاح!", "success");

    // تفريغ الحقل والسماح بإدخال كوبون آخر
    inputCoupon.value = "";
    resetButtonState(buttonCoupon);
    inputCoupon.disabled = false;

    // التحديث المباشر والمضمون للسعر فوراً
    refreshCheckoutTotals();
});


// عند تغيير المحافظة، حدث السعر فوراً
document.addEventListener("change", (event) => {
    if (event.target.id === 'governorate') {
        refreshCheckoutTotals();
    }
});




// عشان يبقي جلوبل لكله
window.refreshCheckoutTotals = refreshCheckoutTotals;







// Custom Dropdown Logic Start
const governorateBtn = document.getElementById('governorateBtn');
const governorateDropdown = document.getElementById('governorateDropdown');
const selectedGovernorate = document.getElementById('selectedGovernorate');
const dropdownArrow = document.getElementById('dropdownArrow');
const governorateInput = document.getElementById('governorate');
const governorateOptions = document.querySelectorAll('.governorate-option');

if (governorateBtn && governorateDropdown) {
    // فتح/إغلاق الـ Dropdown
    governorateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        governorateDropdown.classList.toggle('hidden');
        if (dropdownArrow) {
            dropdownArrow.classList.toggle('rotate-180');
        }
    });

    // اختيار محافظة
    governorateOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.getAttribute('data-value');
            const text = option.textContent;

            if (selectedGovernorate) {
                selectedGovernorate.textContent = text;

                if (!value) {
                    selectedGovernorate.classList.add('text-[#7b7b7b]');
                    selectedGovernorate.classList.remove('text-gray-900');
                } else {
                    selectedGovernorate.classList.remove('text-[#7b7b7b]');
                    selectedGovernorate.classList.add('text-gray-900');
                }
            }

            if (governorateInput) {
                governorateInput.value = value;
            }

            // ✅ احفظ المحافظة في localStorage
            if (value) {
                localStorage.setItem('selected_governorate', value);
                localStorage.setItem('selected_governorate_text', text);
            } else {
                localStorage.removeItem('selected_governorate');
                localStorage.removeItem('selected_governorate_text');
            }

            governorateDropdown.classList.add('hidden');
            if (dropdownArrow) {
                dropdownArrow.classList.remove('rotate-180');
            }

            if (typeof refreshCheckoutTotals === 'function') {
                refreshCheckoutTotals();
            }
        });
    });

    // إغلاق الـ Dropdown لما تدوس بره
    document.addEventListener('click', () => {
        governorateDropdown.classList.add('hidden');
        if (dropdownArrow) {
            dropdownArrow.classList.remove('rotate-180');
        }
    });
} else {
    console.log(" عناصر الـ Dropdown مش موجودة في الصفحة");
}
// Custom Dropdown Logic End
