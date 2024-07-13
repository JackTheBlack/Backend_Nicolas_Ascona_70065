const express = require("express")
const fs=require('fs')
const path = require('path');
const router = express.Router()


const getAllProducts = () => {
  console.log("entro");
  const data = fs.readFileSync(path.join(__dirname, '../products.json'), 'utf8');
  return JSON.parse(data);
  };

////////////////////////Genreacion automatica de ID/////////////////////////////////////


  const generateId = () => {
    const products = getAllProducts();
    const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
    return maxId + 1;
  };
  

  const deleteProduct = (productId) => {
    
    let products = getAllProducts();
    const newProducts = products.filter(product => product.id !== productId);
    if (newProducts.length === products.length) {
      return false; // No se encontró el producto
    }
    ////////////guardo el producto///////////////////
    fs.writeFileSync(path.join(__dirname, '../products.json'), JSON.stringify(newProducts, null, 2), 'utf8'); // Corregir la ruta del archivo
  return true; // Se eliminó el producto
  };
  
  
  module.exports = {
    getAllProducts,deleteProduct,generateId

  };