const { notionRequest } = require('./notion-api');

async function main() {
  const pageId = '3e358b98-802d-81d2-8db4-dfd40f0f862a';
  await notionRequest(`/pages/${pageId}`, 'PATCH', {
    properties: {
      'Estado publicación': {
        select: {
          name: 'Publicado'
        }
      }
    }
  });
  console.log('SVL-0001 restablecido a Publicado para la prueba.');
}

main().catch(console.error);
