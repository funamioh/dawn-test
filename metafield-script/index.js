const axios = require('axios');
require('dotenv').config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const STORE_URL = process.env.STORE_URL;
const PRODUCT_ID = process.argv[2]; // takes PRODUCT_ID from command argument

const headers = {
  'X-Shopify-Access-Token': ACCESS_TOKEN,
  'Content-Type': 'application/json',
};

async function getProductMetafields(productId) {
  try {
    const response = await axios.get(`${STORE_URL}/admin/api/2023-01/products/${productId}/metafields.json`, {
      headers,
    });
    return response.data.metafields;
  } catch (error) {
    console.error('Error fetching metafields:', error);
    throw error;
  }
}

async function createOrUpdateMetafield(productId, metafield) {
  try {
    // update metafield, adding 1 to the value
    if (metafield) {
      metafield.value = parseInt(metafield.value, 10) + 1;
      await axios.put(`${STORE_URL}/admin/api/2023-01/metafields/${metafield.id}.json`, { metafield }, { headers });
      console.log('Metafield updated:', metafield);
    } else {
      // create metafield with value 0
      const newMetafield = {
        namespace: 'global',
        key: 'test',
        value: 0,
        type: 'integer',
      };
      await axios.post(
        `${STORE_URL}/admin/api/2023-01/products/${productId}/metafields.json`,
        { metafield: newMetafield },
        { headers }
      );
      console.log('Metafield created:', newMetafield);
    }
  } catch (error) {
    console.error('Error creating or updating metafield:', error);
    throw error;
  }
}

async function main() {
  try {
    const metafields = await getProductMetafields(PRODUCT_ID);
    const existingMetafield = metafields.find((mf) => mf.namespace === 'global' && mf.key === 'test');

    await createOrUpdateMetafield(PRODUCT_ID, existingMetafield);
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main();
