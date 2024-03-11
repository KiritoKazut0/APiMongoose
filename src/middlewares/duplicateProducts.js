import Products from '../models/Products'

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
            return res.json({ message: "The product is a duplicate" });
        }

        next();
    } catch (error) {
        return res.status(500).json({message: "Product search failed"});
    }
};
