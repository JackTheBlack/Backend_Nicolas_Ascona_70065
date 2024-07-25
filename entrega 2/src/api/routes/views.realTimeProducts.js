import express from 'express';
import fs from 'fs';
import path from 'path';
import { getAllProducts, deleteProduct, generateId } from '../utils/utils.js'; // Asegúrate de que la ruta a utils.js sea correcta

const router = express.Router();

/*
router.get("/", (req, res) => {
  console.log("ddsds");
  const products = getAllProducts();
  res.json(products);
});
*/
router.get("/", (req, res) => {
  const products = getAllProducts();
  res.render('realTimeProducts',{products}); // Ajusta la ruta de la vista según tu configuración
});


router.get('/', (req, res) => {
  const products = getAllProducts();
  res.render('index', { products });
});


// Crear un nuevo producto 
/*
router.post('/', (req, res) => {
  console.log("estoy acaa");
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
  }

  const products = getAllProducts();
  const newProduct = {
    id: generateId(products),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };

  products.push(newProduct);
  fs.writeFileSync(path.join(__dirname, '../api/products.json'), JSON.stringify(products, null, 2), 'utf8');
  return res.status(201).json(newProduct);
});
*/
// Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  const success = deleteProduct(productId);

  if (success) {
    res.status(200).send(`Producto con ID: ${productId} eliminado`);
  } else {
    res.status(404).send(`Producto con ID: ${productId} no encontrado`);
  }
});


export default router;