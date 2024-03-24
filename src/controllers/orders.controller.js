import Orders from "../models/Orders";

export const getOrders = async (req, res) =>{  
    
    try {
        const ordersSave = await Orders.find();
        return res.status(200).json(ordersSave);
    } catch (error) {
        return res.status(500).json({message: "error the server"});
    }

    
}

export const createOrders = async (req, res) =>{
    
    try {
        const {buyerData, products} = req.body;
        const newOrder = new Orders({ buyerData,products });

        const ordersSave = await newOrder.save();

       return res.status(201).json({ordersSave});

    } catch (error) {
      return res.status(500).json({message: "Error the server"});
    }

}


