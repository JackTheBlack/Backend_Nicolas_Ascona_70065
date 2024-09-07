import express from 'express';
import fs from 'fs';
import path from 'path';
import Carts from '../models/carts.model.js';
import Products from '../models/products.model.js';
import { getAllProducts, deleteProduct, generateId, getCarts } from '../utils/utils.js'; // Asegúrate de que la ruta a utils.js sea correcta

const router = express.Router();


router.delete("/",async(req,res)=>{

  try {
    const result = await Carts.delete(req.id)
    res.render('cart', { payload: result.docs, });
      
} catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el carrito');
}

})


router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort === 'asc' ? 'price' : req.query.sort === 'desc' ? '-price' : null;

  // Verifica si el filtro de stock está activado
  const stockFilter = req.query.stockFilter === '1' ? { stock: { $gt: 0 } } : {};
  const query = req.query.query ? { type: req.query.query, ...stockFilter } : stockFilter;

 
  
  const options = {
      page: page,
      limit: limit,
      sort: sort,
      lean: true, // Devuelve objetos JavaScript puros en lugar de documentos de Mongoose
  };

  try {
      const result = await Products.paginate(query, options);
      res.render('cart', { payload: result.docs, });
        
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener productos');
  }
});





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
router.post('/', async (req, res) => {

  try {
      const newCart = new Carts(req.body);
      await newCart.save();
      res.status(201).json(newCart);
  } catch (error) {
      res.status(500).json({ message: 'Error saving new cart', error: error.message });
  }
});


// Agregar producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
      const cart = await Carts.findById(cartId);
      if (!cart) {
          return res.status(404).json({message: 'Cart not found'});
      }

      const existingProductIndex = cart.products.findIndex(item => item.product._id.toString() == productId);

      if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += quantity;

      } else {
          cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      res.status(201).json(cart);

  } catch (error) {
      res.status(500).json({ message: 'Error saving new product in cart', error: error.message });
  }
});




//PUT  by cart_id and product_id Update Quantity  
router.put('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
      const cart = await Carts.findById(cartId);
      if (!cart) {
          return res.status(404).json({message: 'Cart not found'});
      }

      const existingProductIndex = cart.products.findIndex(item => item.product._id.toString() == productId);

      if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity = quantity;

      } else {
          return res.status(404).json({message: 'Product not found in cart'});
      }

      await cart.save();
      res.status(201).json(cart);

  } catch (error) {
      res.status(500).json({ message: 'Error updating product in cart', error: error.message });
  }
});

//Delete  cart product by cart id and product id
router.delete('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const product= await Products.findById(productId);
  
  const cart = await Carts.findById(cartId);

  if (!cart) {
      return res.status(404).json({message: 'Cart not found'});
   
  }


  
  const existingProductIndex = cart.products.findIndex(item => item.product._id.toString() == productId);

  try {
      if (existingProductIndex !== -1) {
          cart.products.splice(existingProductIndex, 1);
      }
    
      await cart.save();
      res.status(204).json(cart);

  } catch (error) {
      res.status(500).json({ message: 'Error deleting product from cart', error: error.message });
  }

});


// Delete all products from cart
router.delete('/:cid', async (req, res) => {
  const id = req.params.cid;
  try {
      const cart = await cartModel.findById(id);
      if (!cart) {
          return res.status(404).json({message: 'Cart not found'});
      }
      cart.products = [];
      await cart.save();
      res.status(204).json(cart);
  } catch (error) {
      res.status(500).json({ message: 'Error deleting products from cart', error: error.message });
  }
})

export default router;