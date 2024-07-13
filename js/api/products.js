const express = require("express")
const fs=require('fs')
const router = express.Router()
const { getAllProducts,deleteProduct } = require('./utils/utils.js'); // Asegúrate de que la ruta a utils.js sea correcta




/**
const getProducts = () => {
  const data = fs.readFileSync("./api/products.json", 'utf8');
  return JSON.parse(data);
};




const generateId = () => {
  const products = getProducts();
  const id=products.length()+1001;
  return id;
};
/////////////////generar id de manera automatica sin repetir///////////////
/* const generateId = () => {
  const products = getProducts();
  const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
  return maxId + 1;
};
*/

//   Obtener todos los productos
router.get("/", (req, res) => {
  console.log("ddsds")
  const products=getAllProducts();
  res.json(products)
})


/////////////////////GET//////////////////////////////////////////



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


///////////////////////////////////// POST///////////////////////////
router.post('/', (req, res) => {
   console.log("estoy acaa")
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
  }
  console.log("estoy acaa")
  const newProduct = {
      id: generateId(),
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
    

    fs.writeFileSync("./api/products.JSON", JSON.stringify(products, null, 2), 'utf8');
     return res.status(201).json(newProduct);
  });



////////////////////////////////DELETE////////////////////////////////

  router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid, 10);

    const success = deleteProduct(productId);
  
    if (success) {
      res.status(200).send(`Producto con ID: ${productId} eliminado`);
    } else {
      res.status(404).send(`Producto con ID: ${productId} no encontrado`);
    }
  });


////////////////////PUT////////////////////////////////////

router.put('/:pid', (req, res) => {
    const products = getAllProducts();
    const productId = parseInt(req.params.pid, 10);
    const productIndex = products.findIndex(p => p.id === productId);
  
    if (productIndex !== -1) {
      const updatedProduct = { ...products[productIndex], ...req.body };
      updatedProduct.id = productId; // Asegurarse de que el ID no se actualice
      products[productIndex] = updatedProduct;
  
      fs.writeFileSync("./api/products.JSON", JSON.stringify(products, null, 2), 'utf8');
    return  res.json(updatedProduct);
    } else {
    return  res.status(404).send(`Producto con ID: ${productId} no encontrado`);
    }
  });

module.exports = router