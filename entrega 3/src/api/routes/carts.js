import express from 'express';
import fs from 'fs';
import path from 'path';
import { getAllProducts, deleteProduct, generateId, getCarts } from '../utils/utils.js'; // Asegúrate de que la ruta a utils.js sea correcta

const router = express.Router();

// Obtener un carrito específico por ID
router.get('/:pid', (req, res) => {
  const carts = getCarts();
  const cartId = parseInt(req.params.pid, 10);
  const cart = carts.find(p => p.id === cartId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).send(`No se logró encontrar el carrito con ID: ${cartId}`);
  }
});

// Crear un nuevo carrito
router.post("/", (req, res) => {
  const { id, products = [] } = req.body;
  const list = getCarts();
  const newCart = {
    id: generateId(list),
    products
  };
  const carts = getCarts();
  carts.push(newCart);
  fs.writeFileSync(path.join(__dirname, '../api/carts.json'), JSON.stringify(carts, null, 2), 'utf8');
  res.json({ message: "Nuevo carrito creado" });
});

// Agregar producto a un carrito
router.post("/:pidc/products/:pidp", (req, res) => {
  const cartId = parseInt(req.params.pidc, 10);
  const productId = parseInt(req.params.pidp, 10);
  const products = getAllProducts();
  const carts = getCarts();

  const cart = carts.find(p => p.id === cartId);
  const cartProducts = cart ? cart.products : [];
  
  const cartIndex = carts.findIndex(p => p.id === cartId); // Busco el carrito en el que deseo agregar un producto
  const productIndex = products.findIndex(p => p.id === productId); // Busco el producto que se desea agregar

  if (cartIndex !== -1) {
    if (productIndex !== -1) {
      const productExists = cartProducts.findIndex(p => p.id_product === productId); // Reviso si el producto ya existe en el carrito
      
      if (productExists !== -1) {
        carts[cartIndex].products[productExists].quantity += 1;
      } else {
        const newProduct = { "id_product": productId, "quantity": 1 };
        cartProducts.push(newProduct);
      }
      
      fs.writeFileSync(path.join(__dirname, '../api/carts.json'), JSON.stringify(carts, null, 2), 'utf8');
      res.status(201).json(carts[cartIndex]);
    } else {
      res.status(404).send(`Producto con ID: ${productId} no encontrado`);
    }
  } else {
    res.status(404).send(`Carrito con ID: ${cartId} no encontrado`);
  }
});

export default router;