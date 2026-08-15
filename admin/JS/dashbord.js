// ==========================================
// 1. رابط الـ Edge Function الآمن
// ==========================================
const EDGE_FUNCTION_URL = 'https://vjvrpabmbereiegvsmam.supabase.co/functions/v1/dashboard-api';

// متغير لتخزين ID المنتج الجاري تعديله
let editingProductId = null;

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
    if (!recentOrdersBody) return;

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
// 7. دوال إدارة المنتجات
// ==========================================

// فتح Modal إضافة منتج
function openAddProductModal() {
    document.getElementById('add-product-modal').classList.remove('hidden');
    document.getElementById('add-product-modal').classList.add('flex');
}

// إغلاق Modal إضافة منتج
function closeAddProductModal() {
    document.getElementById('add-product-modal').classList.add('hidden');
    document.getElementById('add-product-modal').classList.remove('flex');
    document.getElementById('add-product-form').reset();
    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('new-category-div').classList.add('hidden');
    
    // إعادة الزر لحالته الأصلية
    const submitBtn = document.querySelector('#add-product-form button[type="submit"]');
    submitBtn.innerHTML = '<i class="fa-solid fa-plus ml-2"></i>إضافة المنتج';
    submitBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
    submitBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
    
    editingProductId = null;
}

// معاينة الصورة قبل الرفع
function previewImage(input) {
    const preview = document.getElementById('image-preview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// إظهار/إخفاء حقل القسم الجديد
document.getElementById('product-category')?.addEventListener('change', function (e) {
    const newCategoryDiv = document.getElementById('new-category-div');
    if (e.target.value === 'new') {
        newCategoryDiv.classList.remove('hidden');
    } else {
        newCategoryDiv.classList.add('hidden');
    }
});

// تحويل ملف إلى Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// جلب وعرض المنتجات (لصفحة إدارة المنتجات)
async function loadProducts() {
    const productsTableBody = document.getElementById('products-table-body');
    if (!productsTableBody) return;

    try {
        const products = await callEdgeFunction('getProducts');
        productsTableBody.innerHTML = '';

        if (!products || products.length === 0) {
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="py-8 text-center text-gray-400">لا توجد منتجات حالياً</td>
                </tr>
            `;
            return;
        }

        products.forEach(product => {
            const row = `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="py-4 px-4">
                        <img src="${product.image_url}" alt="${product.name}" class="w-16 h-16 object-cover rounded-lg">
                    </td>
                    <td class="py-4 px-4 font-bold">${product.name}</td>
                    <td class="py-4 px-4">
                        <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">${product.category}</span>
                    </td>
                    <td class="py-4 px-4 font-bold text-gray-800">$${formatNumber(product.price)}</td>
                    <td class="py-4 px-4 text-sm text-gray-500">${product.old_price ? '$' + formatNumber(product.old_price) : '-'}</td>
                    <td class="py-4 px-4 text-center">
                        <button data-edit-id="${product.id}" class="btn-edit-product text-blue-600 hover:text-blue-800 mx-1" title="تعديل">
                            <i class="fa-solid fa-edit"></i>
                        </button>
                        <button data-delete-id="${product.id}" class="btn-delete-product text-red-600 hover:text-red-800 mx-1" title="حذف">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            productsTableBody.innerHTML += row;
        });

    } catch (error) {
        console.error('خطأ في جلب المنتجات:', error);
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="py-8 text-center text-red-400">حدث خطأ في تحميل المنتجات</td>
            </tr>
        `;
    }
}

// حذف منتج
async function deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
        const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'deleteProduct',
                productId: productId
            })
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        alert('✅ تم حذف المنتج بنجاح!');
        await loadProducts();
        await loadStats();

    } catch (error) {
        console.error('خطأ في حذف المنتج:', error);
        alert('❌ حدث خطأ في حذف المنتج: ' + error.message);
    }
}

// تعديل منتج (جلب البيانات وملء الفورم)
async function editProduct(productId) {
    try {
        const products = await callEdgeFunction('getProducts');
        const product = products.find(p => p.id == productId);

        if (!product) {
            alert('❌ لم يتم العثور على المنتج');
            return;
        }

        // حفظ ID المنتج
        editingProductId = productId;

        // ملء الفورم بالبيانات الحالية
        document.getElementById('product-name').value = product.name || '';
        document.getElementById('product-category').value = product.category || '';
        document.getElementById('product-price').value = product.price || '';
        document.getElementById('product-old-price').value = product.old_price || '';
        document.getElementById('product-description').value = product.description || '';

        // عرض الصورة الحالية
        if (product.image_url) {
            const preview = document.getElementById('image-preview');
            preview.src = product.image_url;
            preview.classList.remove('hidden');
        }

        // تغيير شكل الزر ليعرف المستخدم أنه في وضع "تحديث"
        const submitBtn = document.querySelector('#add-product-form button[type="submit"]');
        submitBtn.innerHTML = '<i class="fa-solid fa-sync-alt ml-2"></i> تحديث المنتج';
        submitBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        submitBtn.classList.add('bg-green-600', 'hover:bg-green-700');

        // فتح الـ Modal
        openAddProductModal();

    } catch (error) {
        console.error('خطأ في جلب بيانات المنتج:', error);
        alert('❌ حدث خطأ في تحميل بيانات المنتج');
    }
}

// تحديث منتج (بعد التعديل)
async function updateProduct() {
    if (!editingProductId) return;

    try {
        const name = document.getElementById('product-name').value;
        let category = document.getElementById('product-category').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const oldPrice = parseFloat(document.getElementById('product-old-price').value) || null;
        const description = document.getElementById('product-description').value;

        if (category === 'new') {
            category = document.getElementById('new-category-name').value;
            if (!category) {
                alert('الرجاء إدخال اسم القسم الجديد');
                return;
            }
        }

        // التعامل مع الصورة
        const imageInput = document.getElementById('product-image');
        let imageBase64 = null;

        if (imageInput.files && imageInput.files[0]) {
            imageBase64 = await fileToBase64(imageInput.files[0]);
        }

        // إرسال البيانات للـ Edge Function
        const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'updateProduct',
                productId: editingProductId,
                productData: {
                    name,
                    category,
                    price,
                    old_price: oldPrice,
                    description,
                },
                imageFile: imageBase64
            })
        });

        const result = await response.json();
        if (result.error) throw new Error(result.error);

        alert('✅ تم تحديث المنتج بنجاح!');
        closeAddProductModal();
        await loadProducts();
        await loadStats();
        editingProductId = null;

    } catch (error) {
        console.error('خطأ في تحديث المنتج:', error);
        alert(' حدث خطأ في تحديث المنتج: ' + error.message);
    }
}

// ==========================================
// Event Delegation لأزرار الحذف والتعديل
// ==========================================
document.addEventListener('click', async function(e) {
    // زر الحذف
    const deleteBtn = e.target.closest('.btn-delete-product');
    if (deleteBtn) {
        const productId = deleteBtn.dataset.deleteId;
        await deleteProduct(productId);
    }

    // زر التعديل
    const editBtn = e.target.closest('.btn-edit-product');
    if (editBtn) {
        const productId = editBtn.dataset.editId;
        await editProduct(productId);
    }
});

// ==========================================
// معالجة فورم إضافة/تحديث منتج
// ==========================================
const productForm = document.getElementById('add-product-form');

if (productForm) {
    productForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        console.log('Form submitted! editingProductId =', editingProductId);

        // لو في وضع التعديل
        if (editingProductId) {
            console.log('Updating product...');
            await updateProduct();
            return;
        }

        // لو في وضع الإضافة
        try {
            const name = document.getElementById('product-name').value;
            let category = document.getElementById('product-category').value;
            const price = parseFloat(document.getElementById('product-price').value);
            const oldPrice = parseFloat(document.getElementById('product-old-price').value) || null;
            const description = document.getElementById('product-description').value;

            if (category === 'new') {
                category = document.getElementById('new-category-name').value;
                if (!category) {
                    alert('الرجاء إدخال اسم القسم الجديد');
                    return;
                }
            }

            let imageBase64 = null;
            const imageInput = document.getElementById('product-image');
            if (imageInput.files && imageInput.files[0]) {
                imageBase64 = await fileToBase64(imageInput.files[0]);
            }

            const response = await fetch(EDGE_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'addProduct',
                    productData: {
                        name,
                        category,
                        price,
                        old_price: oldPrice,
                        description,
                    },
                    imageFile: imageBase64
                })
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            alert('✅ تم إضافة المنتج بنجاح!');
            closeAddProductModal();

            if (document.getElementById('products-table-body')) {
                await loadProducts();
            }

            if (document.getElementById('section-overview') && document.getElementById('section-overview').classList.contains('active')) {
                await loadStats();
            }

        } catch (error) {
            console.error('خطأ في إضافة المنتج:', error);
            alert('❌ حدث خطأ في إضافة المنتج: ' + error.message);
        }
    });
}

// ==========================================
// التشغيل النهائي عند تحميل الصفحة
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // تحميل البيانات الأساسية
    await loadStats();
    await loadRecentOrders();
    await loadProducts();

    // ربط زر إضافة منتج
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', openAddProductModal);
    }

    // تحديث البيانات عند التنقل بين الأقسام
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            link.classList.add('active');
            const targetId = `section-${link.dataset.target}`;
            document.getElementById(targetId).classList.add('active');
            pageTitle.textContent = link.querySelector('span').textContent;

            // تحديث البيانات حسب القسم المفتوح
            if (link.dataset.target === 'overview') {
                await loadStats();
                await loadRecentOrders();
            } else if (link.dataset.target === 'products') {
                await loadProducts();
            }
        });
    });
});