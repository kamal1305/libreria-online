import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const webhookUrl =
      process.env.N8N_ORDER_WEBHOOK ||
      "https://3fxpxm31.rpcld.cc/webhook/pedido-recibido";

    // Generar un ID legible de pedido si no viene dado, ej. PED-2026-A83F
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderId = body.orderId || `PED-${new Date().getFullYear()}-${randomSuffix}`;

    const items = (body.items || []).map((item: any) => ({
      sku: item.sku || (item.slug ? `SVL-${item.slug}` : "SVL-WEB"),
      title: item.title || "Libro",
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
    }));

    const customerName = body.customerName?.trim() || "Cliente WhatsApp";
    const customerEmail = body.customerEmail?.trim() || "pedido-web@masquelibros.es";
    const deliveryMethod = body.deliveryMethod || "envio";
    const shippingAddress =
      deliveryMethod === "recogida"
        ? "Recogida local en Jerez (Gratis)"
        : body.customerAddress?.trim() || "Envío a domicilio peninsular";

    const n8nPayload = {
      order_id: orderId,
      customer_name: customerName,
      customer_email: customerEmail,
      platform: "WhatsApp / Web",
      shipping_address: shippingAddress,
      payment_status: "pending",
      total: Number(body.total || 0),
      items: items,
    };

    // Llamada con timeout de 6 segundos para garantizar agilidad
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    let n8nSuccess = false;
    let n8nData: any = null;

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload),
        signal: controller.signal,
      });

      if (res.ok) {
        n8nData = await res.json().catch(() => null);
        n8nSuccess = true;
      }
    } catch (err: any) {
      console.warn("Aviso al notificar a n8n:", err.message);
    } finally {
      clearTimeout(timeoutId);
    }

    return NextResponse.json({
      success: true,
      orderId,
      notionReserved: n8nSuccess,
      data: n8nData,
    });
  } catch (error: any) {
    console.error("Error en /api/orders/reserve:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error procesando reserva" },
      { status: 500 }
    );
  }
}
