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

const app = express();
const PORT = 8080;
const server = createServer(app);

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
    console.log("Nuevo cliente conectado");

    socket.on("message", data => {
        let messages = [];
        messages.push(data);
        socketServer.emit("messageLogs", messages);
    });

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

        const products = getAllProducts();
        products.push(newProduct);

        fs.writeFileSync("./src/api/products.JSON", JSON.stringify(products, null, 2), 'utf8');
        socketServer.emit("newList", newProduct);
    });

    socket.on("delete", data => {
        const id = Number(data);
        const success = deleteProduct(id);
        // socketServer.emit("newList", getAllProducts());
    });
});

server.listen(PORT, () => console.log(`Escuchando en el puerto ${PORT}`));