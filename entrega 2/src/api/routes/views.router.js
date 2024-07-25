import express from 'express'
import { getAllProducts, deleteProduct, generateId } from '../utils/utils.js'; // Asegúrate de que la ruta a utils.js sea correcta

const router = express.Router()

router.get('/', (req, res) => {
    const products=getAllProducts()
    res.render('home',{products})
})

export default router