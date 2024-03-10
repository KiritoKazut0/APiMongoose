import Products from "../models/Products";

export const createProduct = async (req, res) => {
    const { name, description, imgUrl, price, typeProduct, amount, content } = req.body;
    const newProduct = new Products({ name, description, imgUrl, price, typeProduct, amount, content })

    const ProductSave = await newProduct.save();
    res.status(201).json(ProductSave);
}

export const getProducts =  async (req, res) => {
   const ProductsSaved = await Products.find()
    res.status(200).json(ProductsSaved);
  
}

export const getProductById = async (req, res) => {
const product = await Products.findById(req.params.productId);
    res.status(200).json(product);
}

export const updateProducById = async (req, res) => {
    const updateProduct = await Products.findByIdAndUpdate(req.params.productId, req.body, {
        new: true
    })
    res.status(200).json(updateProduct);
}

export const deleteProductsById =  async (req, res) => {
    const {productId} = req.params;
     await Products.findByIdAndDelete(productId);
    res.status(204).json()
}

