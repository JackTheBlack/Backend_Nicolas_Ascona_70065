import mongoose from 'mongoose';
import mongoosePaginate, { paginate } from "mongoose-paginate-v2";

const cartCollection="carts"

// Esquema del carrito
const cartSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number, default: 1 },
            
        }
    ]
});
// Middleware para generar automáticamente un ID único antes de guardar el documento

// Crear el modelo del carrito
cartSchema.plugin(mongoosePaginate);
const Carts = mongoose.model(cartCollection, cartSchema);

export default Carts;