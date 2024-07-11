const express= require('express');
const path =require('path');
const app=express();
const PORT = 8080
const productsRouter = require("./api/products.js");
const cartsRouter=require("./api/carts.js");


app.use(express.json()) // Middleware body (cuando envio info desde una url)
app.use(express.urlencoded({ extended: true })) // Middleware para recibir parametros por url
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);



app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
  });
  
  app.listen(PORT, () => {
    console.log(`Servidor  ds escuchando en http://localhost:${PORT}`);
  });