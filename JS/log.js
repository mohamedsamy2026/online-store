import { supabase } from './import_supabase.js';

// ==========================================
// 1. دالة ترجمة أخطاء سوبابيز للغة العربية
// ==========================================
function translateError(errorMessage) {
    if (!errorMessage) return "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.";

    const msg = errorMessage.toLowerCase();

    if (msg.includes("password should be at least")) {
        return "كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل.";
    }
    if (msg.includes("user already registered") || msg.includes("already exists")) {
        return "هذا البريد الإلكتروني مسجل بالفعل! يمكنك تسجيل الدخول بدلاً من ذلك.";
    }
    if (msg.includes("invalid login credentials") || msg.includes("invalid email or password")) {
        return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    }
    if (msg.includes("invalid email") || msg.includes("unable to validate email")) {
        return "البريد الإلكتروني غير صحيح، يرجى إعادة كتابته بشكل مضبوط.";
    }
    if (msg.includes("rate limit")) {
        return "تم إرسال محاولات كثيرة، يرجى الانتظار دقيقة والمحاولة مجدداً.";
    }

    return "تعذر إنشاء الحساب، يرجى التأكد من البيانات والمحاولة لاحقاً.";
}

// ==========================================
// 2. دالة إظهار التنبيهات المضمونة 100% (Toast)
// ==========================================
function showToast(message, type = 'success') {
    // إزالة أي توست قديم لو موجود
    const oldToast = document.getElementById('custom-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.id = 'custom-toast';

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? '#10b981' : '#f43f5e';

    // تنسيق مباشر وصريح لضمان الظهور فوق أي عنصر في الصفحة
    toast.style.cssText = `
        position: fixed;
        top: 25px;
        right: 25px;
        background-color: ${bgColor};
        color: #ffffff;
        padding: 14px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 99999999999999;
        font-size: 15px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
        direction: rtl;
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0;
        transform: translateY(-20px);
    `;

    const icon = isSuccess
        ? '<i class="fa-solid fa-circle-check text-xl"></i>'
        : '<i class="fa-solid fa-circle-xmark text-xl"></i>';

    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // أجبار المتصفح على رسم العنصر (Forced Reflow) للأنيميشن
    toast.offsetHeight;

    // إظهار التوست
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    // إخفاء التوست بعد 3.5 ثواني
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ==========================================
// 3. تهيئة الصفحة والاستماع للأحداث
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // كود إظهار وإخفاء كلمة المرور
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (togglePassword && password && eyeIcon) {
        togglePassword.addEventListener('click', () => {
            const isPassword = password.getAttribute('type') === 'password';
            password.setAttribute('type', isPassword ? 'text' : 'password');
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }

    // جلب حالة المستخدم
    try {
        const { data: { user } } = await supabase.auth.getUser();
        updateHeaderUI(user);
    } catch (e) {
        console.error("Supabase Error:", e);
    }

    // متابعة حالة التسجيل
    supabase.auth.onAuthStateChange((event, session) => {
        const currentUser = session?.user || null;
        updateHeaderUI(currentUser);
    });

    // ربط فورس الدخول والتسجيل
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const signupForm = document.getElementById('signupForm');
    if (signupForm) signupForm.addEventListener('submit', handleSignUp);
});

// ==========================================
// 4. دالة تسجيل الدخول
// ==========================================
async function handleLogin(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    submitBtn.disabled = true;
    submitBtn.innerText = "جاري تسجيل الدخول...";

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            showToast(translateError(error.message), "error");
            return;
        }

        showToast("تم تسجيل الدخول بنجاح! 👋", "success");

        const isSubFolder = window.location.pathname.includes('/HTML/');
        setTimeout(() => {
            window.location.href = isSubFolder ? '../index.html' : './index.html';
        }, 1200);
    } catch (err) {
        console.error(err);
        showToast("حدث خطأ غير متوقع، حاول مرة أخرى.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Sign In";
    }
}

// ==========================================
// 5. دالة إنشاء حساب جديد
// ==========================================
async function handleSignUp(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    submitBtn.disabled = true;
    submitBtn.innerText = "جاري إنشاء الحساب...";

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } }
        });

        if (error) {
            showToast(translateError(error.message), "error");
            return;
        }

        showToast(`أهلاً بك يا ${name}! تم إنشاء حسابك بنجاح 🥳`, "success");

        const isSubFolder = window.location.pathname.includes('/HTML/');
        setTimeout(() => {
            window.location.href = isSubFolder ? '../index.html' : './index.html';
        }, 1200);
    } catch (err) {
        console.error(err);
        showToast("حدث خطأ غير متوقع أثناء التسجيل.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Create Account";
    }
}

// ==========================================
// 6. دالة تسجيل الخروج السريعة واللحظية (Logout)
// ==========================================
window.handleLogout = async function (e) {
    if (e) e.preventDefault(); 

    try {
        showToast("تم تسجيل الخروج بنجاح 👋", "success");
        updateHeaderUI(null);
        await supabase.auth.signOut();
    } catch (err) {
        console.error("Logout Error:", err);
    }
};
// ==========================================
// 7. دالة تحديث أزرار الـ Header
// ==========================================
function updateHeaderUI(user) {
    const desktopContainer = document.getElementById('auth-container-desktop');
    const mobileContainer = document.getElementById('auth-container-mobile');

    const isSubFolder = window.location.pathname.includes('/HTML/');
    const loginPath = isSubFolder ? 'login.html' : 'HTML/login.html';
    const signupPath = isSubFolder ? 'signup.html' : 'HTML/signup.html';

    if (user) {
        const userName = user.user_metadata?.full_name || 'حسابي';

        const loggedInDesktopHTML = `
            <span class="text-white bg-green-500 px-5 py-2.5 cursor-pointer hover:bg-green-700 duration-200 rounded-[10px] font-bold text-lg xl:flex hidden">Hello ${userName}</span>
            <button type="button" onclick="handleLogout(event)" class="cursor-pointer bg-red-600 text-white px-5 py-2.5 mt-10 xl:mt-0 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 duration-300">
                <span>Log Out</span>
                <i class="fa-solid fa-right-from-bracket"></i>
            </button>
        `;

        

        if (desktopContainer) desktopContainer.innerHTML = loggedInDesktopHTML;
        if (mobileContainer) mobileContainer.innerHTML = loggedInDesktopHTML;
    } else {
        const loggedOutDesktopHTML = `
            <a href="${loginPath}" class="bg-main text-white px-6 py-3 font-bold flex items-center gap-2 hover:bg-orange-500 duration-300">
                <span>Login</span>
                <i class="fa-solid fa-right-to-bracket"></i>
            </a>
            <a href="${signupPath}" class="bg-main text-white px-6 py-3 font-bold flex items-center gap-2 hover:bg-orange-500 duration-300">
                <span>Sign UP</span>
                <i class="fa-solid fa-user-plus"></i>
            </a>
        `;

        const loggedOutMobileHTML = `
            <a href="${loginPath}" class="text-center bg-main text-white w-full ps-8 pe-3 py-3 font-bold flex items-center gap-2 hover:bg-orange-500 duration-300">
                <span>Log In</span>
                <i class="fa-solid fa-right-to-bracket"></i>
            </a>
            <a href="${signupPath}" class="text-center bg-main text-white px-6 w-full py-3 font-bold flex items-center gap-2 hover:bg-orange-500 duration-300">
                <span>Sign UP</span>
                <i class="fa-solid fa-user-plus"></i>
            </a>
        `;

        if (desktopContainer) desktopContainer.innerHTML = loggedOutDesktopHTML;
        if (mobileContainer) mobileContainer.innerHTML = loggedOutMobileHTML;
    }
}