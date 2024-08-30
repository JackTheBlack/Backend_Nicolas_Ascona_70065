import express from 'express'
import { getAllProducts, deleteProduct, generateId } from '../utils/utils.js'; // Asegúrate de que la ruta a utils.js sea correcta
import Products from '../models/products.model.js';
import Carts from '../models/carts.model.js';
import mongoose from 'mongoose';

const router = express.Router()

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
      res.render('home', { payload: result.docs,  totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink = result.hasPrevPage ? `http://localhost:8080/?page=${result.prevPage}` : null,
        nextLink: result.nextLink = result.hasNextPage ? `http://localhost:8080/?page=${result.nextPage}` : null,
        isValid: result.docs.length > 0 ,
        selectedSort: req.query.sort || '',   // Pasar el valor de sort seleccionado
        stockFilterActive: req.query.stockFilter === '1' , // Pasar el estado del filtro de stock
       
        });
        
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener productos');
  }
});


router.get("/cart", async (req, res) => {
  try {
        const cart = await Carts.findOne();

        if (!cart) {
            return res.render('cart', { products: [], total: 0 });
        }

        const productIds = cart.products.map(p => p.product);

        const products = await Products.find({ '_id': { $in: productIds } });

        const productsDetails = products.map(product => {
            const cartItem = cart.products.find(p => p.product.toString() === product._id.toString());
            const totalPrice = product.price * cartItem.quantity;

            return {
                ...product.toObject(),
                quantity: cartItem.quantity,
                totalPrice: totalPrice
            };
        });
          
      const total = productsDetails.reduce((acc, product) => acc + (product.price * product.quantity), 0);

        res.render('cart', { products: productsDetails, total });

  } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'No se pueden cargar los productos' });
  }

})


export default router