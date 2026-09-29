const https = require('https');
const fs = require('fs');
const path = require('path');

// Leer variables desde .env si existen
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] || '';
        value = value.trim().replace(/^['"]|['"]$/g, '');
        process.env[match[1]] = value;
      }
    }
  }
}

loadEnv();

const NOTION_TOKEN = process.env.NOTION_API_KEY;
const INVENTORY_DB_ID = process.env.NOTION_INVENTARIO_DB_ID || '3e358b98-802d-8034-8058-f75a48890b65';
const ORDERS_DB_ID = process.env.NOTION_PEDIDOS_DB_ID || '3e658b98-802d-80fe-b360-f0a979af8118';

function notionRequest(apiPath, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    if (!NOTION_TOKEN) {
      return reject(new Error('NOTION_API_KEY no encontrada en .env'));
    }

    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: '/v1' + apiPath,
      method: method,
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function listInventory() {
  const res = await notionRequest(`/databases/${INVENTORY_DB_ID}/query`, 'POST', {});
  console.log(`\n📚 Inventario (${res.data.results?.length || 0} libros):\n`);
  for (const page of res.data.results || []) {
    const title = page.properties.Nombre?.title?.[0]?.plain_text || 'Sin título';
    const sku = page.properties.SKU?.rich_text?.[0]?.plain_text || 'Sin SKU';
    const isbn = page.properties.ISBN?.rich_text?.[0]?.plain_text || 'Sin ISBN';
    const estado = page.properties['Estado publicación']?.select?.name || 'Sin estado';
    console.log(`- [${sku}] ${title} | ISBN: ${isbn} | Estado: ${estado}`);
  }
}

async function listOrders() {
  const res = await notionRequest(`/databases/${ORDERS_DB_ID}/query`, 'POST', {});
  console.log(`\n🛒 Pedidos (${res.data.results?.length || 0}):\n`);
  for (const page of res.data.results || []) {
    const id = page.properties['Nº Pedido']?.title?.[0]?.plain_text || 'Sin Nº';
    const cliente = page.properties.Cliente?.rich_text?.[0]?.plain_text || 'Desconocido';
    const estado = page.properties['Estado pedido']?.select?.name || 'Sin estado';
    const total = page.properties['Importe total']?.number || 0;
    const articulos = page.properties['Artículos']?.rich_text?.[0]?.plain_text || '';
    console.log(`- #${id} | ${cliente} | Total: ${total} € | Estado: ${estado} | Items: ${articulos}`);
  }
}

async function findBook(query) {
  const res = await notionRequest(`/databases/${INVENTORY_DB_ID}/query`, 'POST', {
    filter: {
      or: [
        { property: 'SKU', rich_text: { contains: query } },
        { property: 'ISBN', rich_text: { contains: query } },
        { property: 'Nombre', title: { contains: query } }
      ]
    }
  });

  console.log(`\n🔍 Búsqueda "${query}" (${res.data.results?.length || 0} resultados):`);
  for (const page of res.data.results || []) {
    const title = page.properties.Nombre?.title?.[0]?.plain_text || 'Sin título';
    const sku = page.properties.SKU?.rich_text?.[0]?.plain_text || 'Sin SKU';
    const estado = page.properties['Estado publicación']?.select?.name || 'Sin estado';
    console.log(`- [${sku}] ${title} (${estado}) - ID: ${page.id}`);
  }
}

const command = process.argv[2] || 'inventory';
const arg = process.argv[3];

if (command === 'inventory') {
  listInventory().catch(console.error);
} else if (command === 'orders') {
  listOrders().catch(console.error);
} else if (command === 'find') {
  findBook(arg || '').catch(console.error);
} else {
  console.log('Uso: node scripts/notion-api.js [inventory|orders|find <query>]');
}

module.exports = { notionRequest, INVENTORY_DB_ID, ORDERS_DB_ID };
