import express from 'express'
import { getAllProducts, deleteProduct, generateId } from '../utils/utils.js'; // Asegúrate de que la ruta a utils.js sea correcta
import Products from '../models/products.model.js';
import mongoose from 'mongoose';

const router = express.Router()

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort === 'asc' ? 'price' : req.query.sort === 'desc' ? '-price' : null;
  const query = req.query.query ? { type: req.query.query } : {};

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
        isValid: result.docs.length > 0 });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener productos');
  }
});

export default router