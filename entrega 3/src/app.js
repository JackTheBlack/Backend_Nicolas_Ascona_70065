import express from 'express';
import * as fs from 'fs';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './api/routes/views.router.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import productRouters from "./api/routes/products.js";
import { generateId, deleteProduct, getAllProducts } from './api/utils/utils.js';
import cartRouter from "./api/routes/carts.js";
import realTimeProductsRouter from "./api/routes/views.realTimeProducts.js";
import mongoose from "mongoose";
import Products from './api/models/products.model.js';
import Carts from './api/models/carts.model.js';


const app = express();
const PORT = 8080;
const server = createServer(app);


const user = "jack";
const password = "1234";
const dbName = "api_db";
const uri = `mongodb+srv://jack:${password}@cluster0.z70zv.mongodb.net/${dbName}?retryWrites=true&w=majority`;


mongoose
  .connect("mongodb://127.0.0.1:27017/Comision_70065", {
   
  })
  .then(() => console.log("conexion exitosa"))
  .catch((e) => console.log(e));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

const socketServer = new Server(server);

app.use((req, res, next) => {
    req.io = socketServer;
    next();
});

app.use('/', viewsRouter);
app.use("/realTimeProducts", realTimeProductsRouter);
app.use("/products", productRouters);
app.use("/carts", cartRouter);

socketServer.on('connection', socket => {
  


    socket.on("message", data => {
        let messages = [];
        messages.push(data);
        socketServer.emit("messageLogs", messages);
    });

    ////////////////////////   add product to cart/////////////////////


    socketServer.on("addToCart", async (productId) => {
        try {
            let cart = await Carts.findOne();
            if (!cart) {
                cart = new Carts();
            }
            
            const product = await Products.findById(productId);
            
            const existingProduct = cart.products.find(p => p.product.toString() === productId);

            if (existingProduct) {
                if (product.stock > 0) {
                    existingProduct.quantity += 1;
                    product.stock -= 1;
                    await cart.save();
                    await product.save();
                    console.log("Cantidad del producto actualizada en el carrito");
                } else {
                    console.log('Stock insuficiente');
                    return
                }
            } else {
                cart.products.push({ product: productId, quantity: 1 });
                product.stock -= 1;
                await cart.save();
                await product.save();
                console.log("Producto agregado al carrito correctamente");
            }

        
        } catch (error) {
            console.error("Error al agregar el producto al carrito", error);
        }
    })


/////////////////////// ADD PRODUCT/////////////////////////////////////////////////////////

    socket.on("addProduct", data => {
        const newProduct = {
            id: generateId(getAllProducts()),
            title: data.title,
            description: data.description,
            code: data.code,
            price: data.price,
            status: data.status,
            stock: data.stock,
            category: data.category,
            thumbnails: data.thumbnails
        };

        let products = getAllProducts();
        products.push(newProduct); 

        fs.writeFileSync("./src/api/products.JSON", JSON.stringify(products, null, 2), 'utf8');
        socketServer.emit("newList", newProduct);
    });

    socket.on("delete", data => {
        const idp = Number(data);
        const success = deleteProduct(idp);
        Products.deleteOne({id:idp})
        // socketServer.emit("newList", getAllProducts());
    });
});

server.listen(PORT, () => console.log(`Escuchando en el puerto ${PORT}`));