import express from 'express';
import fs from 'fs';
import path from 'path';
import { getAllProducts, deleteProduct, generateId } from '../utils/utils.js'; // Asegúrate de que la ruta a utils.js sea correcta
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const app=express();
// Obtener todos los productos
router.get("/", (req, res) => {
  
  const products = getAllProducts();
  res.json(products);
});

router.get("/index", (req, res) => {
  const products = getAllProducts();
  res.render('home',{products}); // Ajusta la ruta de la vista según tu configuración
});


router.get('/realtimeproducts', (req, res) => {
  const products = getAllProducts();
  res.render('realTimeProducts', { products });
});


// Obtener un producto específico por ID
router.get('/:pid', (req, res) => {
  const products = getAllProducts();
  const productId = parseInt(req.params.pid, 10);
  const product = products.find(p => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).send(`Producto con ID: ${productId} no encontrado`);
  }
});

// Crear un nuevo producto
router.post('/', (req, res) => {
  console.log("estoy acaa")
 const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

 if (!title || !description || !code || !price || !stock || !category) {
     return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
 }
 console.log("estoy acaa")
 const newProduct = {
     id: generateId(getAllProducts()),
     title,
     description,
     code,
     price,
     status,
     stock,
     category,
     thumbnails
 };
   const products =getAllProducts();
       
  // newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
   products.push(newProduct);
   
    // Emitir un evento a través de Socket.IO para actualizar la lista de productos en tiempo real
   
   fs.writeFileSync("./src/api/products.JSON", JSON.stringify(products, null, 2), 'utf8');
   req.io.emit("newList", newProduct);

   res.status(201).json(newProduct);
 });


////////////////////////////////DELETE////////////////////////////////

router.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid, 10);

  const success = deleteProduct(productId);

  if (success) {
    req.io.emit("deleted", productId);
    res.status(200).send(`Producto con ID: ${productId} eliminado`);
  } else {
    res.status(404).send(`Producto con ID: ${productId} no encontrado`);
  }
});



export default router;