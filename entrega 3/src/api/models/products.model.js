import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";


// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
      
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: [String],
        required: false
    }
});

// Crear el modelo del producto
productSchema.plugin(mongoosePaginate)
const Products = mongoose.model('Products', productSchema);

export default Products;