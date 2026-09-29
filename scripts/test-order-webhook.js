const https = require('https');

const WEBHOOK_URL = 'https://3fxpxm31.rpcld.cc/webhook-test/pedido-recibido';

const payload = {
  order_id: 'PED-2026-DEFINITIVO',
  customer_name: 'Carlos Arcos',
  customer_email: 'masquelibrosjerez@gmail.com',
  platform: 'Web',
  shipping_address: 'Calle Larga 15, 11402 Jerez de la Frontera',
  payment_status: 'paid',
  total: 12.50,
  items: [
    {
      sku: 'SVL-0001',
      title: 'Tenemos que hablar de Kevin',
      price: 12.50,
      quantity: 1
    }
  ]
};

const data = JSON.stringify(payload);
const url = new URL(WEBHOOK_URL);

const options = {
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname + url.search,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Lanzando pedido PED-2026-DEFINITIVO...');

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => {
    console.log('Status HTTP:', res.statusCode);
    console.log('Respuesta:', responseData);
  });
});

req.on('error', (err) => {
  console.error('Error al conectar con n8n:', err.message);
});

req.write(data);
req.end();
