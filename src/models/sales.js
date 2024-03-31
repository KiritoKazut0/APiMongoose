import { Schema, model } from "mongoose";

const SalesSchema = new Schema({

    idProduct: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    amount: { type: Number, required: true },
    total: { type: Number, required: true },

    date: {
        type: String,
        required: true,
        default: () => new Date().toISOString().split('T')[0]
    }


}, {
    versionKey: false
});


export default model("Sales", SalesSchema);
