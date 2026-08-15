import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action } = await req.json();

    let data, error;

    if (action === "getStats") {
      const { data: orders, error: ordersError } = await supabaseClient
        .from("orders")
        .select("total, status");

      if (ordersError) throw ordersError;

      const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.status === "pending").length;

      const { count: productsCount } = await supabaseClient
        .from("products")
        .select("*", { count: "exact", head: true });

      data = { totalSales, totalOrders, pendingOrders, productsCount };
    } else if (action === "getRecentOrders") {
      const { data: orders, error: ordersError } = await supabaseClient
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (ordersError) throw ordersError;
      data = orders;
    } else if (action === "getProducts") {
      const { data: products, error: productsError } = await supabaseClient
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      data = products;
    } else if (action === "getOrders") {
      const { data: orders, error: ordersError } = await supabaseClient
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      data = orders;
    } else {
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