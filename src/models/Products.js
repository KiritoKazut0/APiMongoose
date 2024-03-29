import {Schema, model} from "mongoose";

const ProductSchema = new Schema ({
    name: {
        type: String, required: true
    } ,
    description: {
        type: String, required: true
    },
    imgUrl: {
        type: String, required: true
    },
    price: {
        type: Number, required: true
    },
    amount: {
        type: Number,  required: true
    },
    typeProduct: {
        type: String, required: true
    },
    content: {
        type: String, required: true
    } 
    
}, {
    versionKey: false //sirve para que las id no tengan _

})

export default model ('Product', ProductSchema);