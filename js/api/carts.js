const express = require("express")
const fs=require('fs')
const router = express.Router()


const getCarts = () => {
    const data = fs.readFileSync("./api/carts.json", 'utf8');
    return JSON.parse(data);
  };


  const getProducts = () => {
    const data = fs.readFileSync("./api/products.json", 'utf8');
    return JSON.parse(data);
  };
  
/////////////Generar Id automatico
  const generateId = () => {
    const carts = getCarts();
    const maxId = carts.reduce((max, cart) => Math.max(max, cart.id), 0);
    return maxId + 1;
  };


////////////////// GET///////////////////////////////
router.get('/:pid', (req, res) => {
    const carts = getCarts();
    const cartId = parseInt(req.params.pid, 10);
    const cart = carts.find(p => p.id === cartId);
  
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).send(`No se sogro encontrar el cart con ID:${cartId}`);
    }
  });

///////////////////////////// POST //////////////////////////////////////////////////////////

/////Crea un carrito//////////////////////////////
router.post("/", (req, res) => {
    
    const { id,products = [] } = req.body;

    const newCart = {
        id: generateId(),
        products
    };
    const carts=getCarts();
    carts.push(newCart)
    fs.writeFileSync("./api/carts.JSON", JSON.stringify(carts, null, 2), 'utf8');
    res.json({ message: "Nuevo carrito creado" })
})

/////////////////cargar producto///////////////
router.post("/:pidc/products/:pidp", (req, res) => {
    const cartId = parseInt(req.params.pidc, 10);
    const productId = parseInt(req.params.pidp, 10);
    const products=getProducts();
    const carts=getCarts();

    const cart = carts.find(p => p.id === cartId);
    const cartProducts=cart.products;
    
    const cartIndex = carts.findIndex(p => p.id === cartId);/////busco el carrito en el que deseo agregar un producto
    const productIndex = products.findIndex(p => p.id === productId);/////busco el producto que se dea agregar

    if(cartIndex!==-1){
        if(productIndex!==-1){
            const productExists=cartProducts.findIndex(p => p.id_product === productId);/////reviso si el producto ya exiiste en el carrito
                
            if (productExists!==-1){
                console.log(productExists);
                console.log(carts[cartIndex].products[productExists]);
                carts[cartIndex].products[productExists].quantity= cartProducts[productExists].quantity+1;

            }else{
                const newProduct={"id_product":productId,"quantity":1}
           
                cartProducts.push(newProduct);
         
            }
          //  console.log(carts[cartIndex].products[productExists]);
            fs.writeFileSync("./api/carts.JSON", JSON.stringify(carts, null, 2), 'utf8');
        
            res.status(201).json(carts[cartIndex]);
        }
        
    }else{
        res.status(404).send(`Carrito con ID: ${productId} no encontrado`);
    }
    
   
})

module.exports = router