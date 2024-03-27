import mongoose from 'mongoose';

export const validateFields = async (req, res, next) => {
    const requiredFields = ['name', 'description', 'imgUrl', 'price', 'amount', 'typeProduct', 'content'];
    const errorsMessage = {};

    for (const field of requiredFields) {
        if (!req.body[field]) {
            errorsMessage[field] = `The ${field} is required`;
        }
    }

    if (Object.keys(errorsMessage).length > 0) {
        return res.status(400).json(errorsMessage);
    }


    next();
};


export const verifyDuplicate = async (req, res, next) => {
    try {
        const isDuplicate = await Products.findOne(req.body);

        if (isDuplicate) {
            return res.status(409).json({ message: "The product is a duplicate" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Product search failed" });
    }
};


export const verifyIdValid = async (req, res, next) => {
    const { products } = req.body;

    try {
        const errors =[];

        for (let i = 0; i < products.length; i++) {

            if (!mongoose.Types.ObjectId.isValid(products[i]._id)) {
                errors.push(`${[i+1]}. Product ID ${products[i]._id} is not valid`)
            }
        }

        if (errors.length>0) return res.status(400).json({message: errors});

        next();


    } catch (error) {
        return res.status(500).json({message: "Error the server"});
    }


}