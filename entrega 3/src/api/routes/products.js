import express from 'express';
import fs from 'fs';
import path from 'path';
import { getAllProducts, deleteProduct, generateId } from '../utils/utils.js'; // Asegúrate de que la ruta a utils.js sea correcta
import { fileURLToPath } from 'url';
import Products from '../models/products.model.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const app=express();
// Obtener todos los productos
router.get("/", async(req, res) => {
 
  try{
    let productsQ = await Products.paginate({id:1018},{limit:20,page:1})
    
    res.json(productsQ);
  }catch(e){
    console.log(e)
  }
   
  
  
  //const products = getAllProducts();
  
});


router.get('/realtimeproducts', async(req, res) => {
 
  let productsQ =await Products.find()
  res.render('realTimeProducts', { productsQ });
});


// Obtener un producto específico por ID//////////////////////////////////////////////////////////////
router.get('/:pid', async(req, res) => {
 // const products = getAllProducts();
  const productId = parseInt(req.params.pid, 10);
// const product = products.find(p => p.id === productId);
let product = await Products.findOne({ id: productId });
console.log(product);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send(`Producto con ID: ${productId} no encontrado`);
  }
});

////////////////////////////////////////////// Crear un nuevo producto/////////////////////////////////////////////////////////////////////////////////
router.post('/', async(req, res) => {
  console.log("estoy acaa")
 const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

 if (!title || !description || !code || !price || !stock || !category) {
     return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
 }
 console.log(generateId(getAllProducts()))
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
       const nProduct= new Products(newProduct);
//   products.push(newProduct);

   await nProduct.save();
    
   
  // fs.writeFileSync("./src/api/products.JSON", JSON.stringify(products, null, 2), 'utf8');
   req.io.emit("newList", newProduct);


   res.status(201).json(newProduct);
 });


////////////////////////////////DELETE////////////////////////////////

router.delete('/:pid', async(req, res) => {
  const productId = parseInt(req.params.pid, 10);

  const success = deleteProduct(productId);
 
  try {
   await Products.deleteOne({id:productId})
    req.io.emit("deleted", productId);
    res.status(200).send(`Producto con ID: ${productId} eliminado`);
} catch (error) {
   // console.log("Error:", error.message);
    res.status(404).send(`Producto con ID: ${productId} no encontrado`);
}
 
 
});



export default router;