import mongoose from "mongoose";

export const verifyFields = async (req, res, next) => {
    try {
        
        const { name, email, phone } = req.body.buyerData;

        if (!name || !email || !phone) {
            return res.json({ message: "Error, the buyer's data is incomplete" });
        }

        const validateProducts = verifyFieldsProducts(req.body.products);

        if (Object.keys(validateProducts).length > 0) {
            return res.json({ message: "Error in products", errors: validateProducts });
        }
        
        next();
        
    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
};

function verifyFieldsProducts(products) {
    const requiredFields = ['_id', 'quantity', 'total_price'];
    const errorsMessage = {};

    if (!products || !products.length) {
        return { message: "There are no products" };
    }

    for (let i = 0; i < products.length; i++) {
        const productErrors = {};

        for (const field of requiredFields) {
            if (!products[i][field]) {
                productErrors[field] = `The ${field} is required`;
            }
        }

        // Validar la existencia y el formato del ID del producto utilizando isValidObjectId
        if (!mongoose.Types.ObjectId.isValid(products[i]._id)) {
            productErrors['_id'] = 'Invalid product ID';
        }

        if (Object.keys(productErrors).length > 0) {
            errorsMessage[`Product ${i + 1}`] = productErrors;
        }
    }

    return errorsMessage;
}