import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action, productData, imageFile, productId } = await req.json();
    let data, error;

    // 1. جلب الإحصائيات
    if (action === "getStats") {
      const { data: orders } = await supabaseClient.from("orders").select("total, status");
      const totalSales = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === "pending").length;
      const { count: productsCount } = await supabaseClient.from("products").select("*", { count: "exact", head: true });
      data = { totalSales, totalOrders, pendingOrders, productsCount };
    }
    // 2. جلب آخر الطلبات
    else if (action === "getRecentOrders") {
      const { data: orders } = await supabaseClient.from("orders").select("*").order("created_at", { ascending: false }).limit(5);
      data = orders;
    }
    // 3. جلب كل المنتجات
    else if (action === "getProducts") {
      const { data: products } = await supabaseClient.from("products").select("*").order("created_at", { ascending: false });
      data = products;
    }
    // 4. جلب كل الطلبات
    else if (action === "getOrders") {
      const { data: orders } = await supabaseClient.from("orders").select("*").order("created_at", { ascending: false });
      data = orders;
    }
    // 5. جلب الكوبونات
    else if (action === "getCoupons") {
      const { data: coupons } = await supabaseClient.from("coupons").select("*").order("created_at", { ascending: false });
      data = coupons;
    }
    // 6. إضافة منتج جديد (مع رفع الصورة)
    else if (action === "addProduct") {
      let imageUrl = "";
      
      // رفع الصورة لو موجودة
      if (imageFile) {
        const fileBytes = Uint8Array.from(atob(imageFile.split(",")[1]), c => c.charCodeAt(0));
        const fileName = `${Date.now()}-${productData.name.replace(/\s+/g, '_')}.png`;
        
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
          .from("product-images")
          .upload(fileName, fileBytes, { contentType: "image/png" });

        if (uploadError) throw uploadError;

        // الحصول على الرابط العام للصورة
        const { data: urlData } = supabaseClient.storage.from("product-images").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      // إضافة المنتج للداتابيز
      const { data: newProduct, error: productError } = await supabaseClient
        .from("products")
        .insert([{
          name: productData.name,
          category: productData.category,
          price: productData.price,
          old_price: productData.old_price || null,
          description: productData.description || "",
          image_url: imageUrl
        }])
        .select()
        .single();

      if (productError) throw productError;
      data = newProduct;
    }
    // 7. تعديل منتج
    else if (action === "updateProduct") {
      let imageUrl = productData.image_url; // الصورة القديمة افتراضياً
      
      // لو رفع صورة جديدة
      if (imageFile) {
        const fileBytes = Uint8Array.from(atob(imageFile.split(",")[1]), c => c.charCodeAt(0));
        const fileName = `${Date.now()}-${productData.name.replace(/\s+/g, '_')}.png`;
        
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
          .from("product-images")
          .upload(fileName, fileBytes, { contentType: "image/png", upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabaseClient.storage.from("product-images").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const { data: updatedProduct, error: productError } = await supabaseClient
        .from("products")
        .update({
          name: productData.name,
          category: productData.category,
          price: productData.price,
          old_price: productData.old_price || null,
          description: productData.description || "",
          image_url: imageUrl
        })
        .eq("id", productId)
        .select()
        .single();

      if (productError) throw productError;
      data = updatedProduct;
    }
    // 8. حذف منتج
    else if (action === "deleteProduct") {
      const { error: productError } = await supabaseClient
        .from("products")
        .delete()
        .eq("id", productId);

      if (productError) throw productError;
      data = { success: true };
    }
    else {
      throw new Error("Invalid action");
    }

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});