import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAllProducts = () => {
  const data = fs.readFileSync(path.join(__dirname, '../products.json'), 'utf8');
  return JSON.parse(data);
};





const generateId = (list) => {
  const maxId = list.reduce((max, item) => Math.max(max, item.id), 0);
  return maxId + 1;
};

const deleteProduct = (productId) => {
  
  console.log(productId, "iddddddd")
  let products = getAllProducts();
  const newProducts = products.filter(product => product.id !== productId);
  if (newProducts.length === products.length) {
    return false; // No se encontró el producto
  }
  fs.writeFileSync(path.join(__dirname, '../products.json'), JSON.stringify(newProducts, null, 2), 'utf8');
  return true; // Se eliminó el producto
};

const getCarts = () => {
  const data = fs.readFileSync("./api/carts.json", 'utf8');
  return JSON.parse(data);
};

export { getAllProducts, deleteProduct, generateId, getCarts };