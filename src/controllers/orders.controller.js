import Orders from "../models/Orders";
import Products from "../models/Products";

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


export const changeStatusOrders = async (req, res) => {
    const { id, status } = req.body;

    if (!id || id.length === 0)  return res.status(401).json({ message: "Se requiere el campo 'id' y no puede estar vacío" });

    if (!status) return res.status(401).json({message: "se requiere el campo de status"});

    if (!["Completado", "Cancelado"].includes(status)) {
        return res.status(400).json({ message: "El estado proporcionado no es válido" });
    }

    

    try {

        // Actualizar todos los documentos que coincidan con las IDs proporcionadas
        const result = await Orders.updateMany(
            { _id: { $in: id } }, // Filtrar documentos por IDs en el arreglo 'id'
            { $set: { status: status } } // Actualizar el campo 'status' a 'Completado'
        );

        // Verificar si se actualizaron documentos
        if (result.n === 0) {
            return res.json({ message: "No se encontraron pedidos para actualizar" });
        } else {
            return res.json({ message: "El estado de los pedidos ha sido actualizado correctamente" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al intentar actualizar los pedidos", error: error.message });
    }
}



export const getPendingOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página solicitada, por defecto es la primera
        const pageSize = parseInt(req.query.pageSize) || 5; // Tamaño de página, por defecto es 5

        const skip = (page - 1) * pageSize; // Cantidad de documentos para saltar

        // Consulta los pedidos pendientes con paginación
        const pendingOrders = await Orders.find({ status: "Pendiente" })
            .skip(skip)
            .limit(pageSize);

        if (pendingOrders.length === 0) {
          return res.status(404).json({ message: "No hay más resultados disponibles" });
        }

        // Aquí itera sobre cada pedido
        const ordersWithDetails = await Promise.all(pendingOrders.map(async (order) => {
            try {
                // Aquí se obtienen los detalles de cada pedido
                const productDetails = await Promise.all(order.products.map(async (product) => {
                    const productDetail = await Products.findById(product._id);
                    if (!productDetail) {
                        throw new Error(`No se encontró ningún producto con el ID ${product._id}`);
                    }
                    return {
                        name: productDetail.name,
                        price: productDetail.price,
                        typeProduct: productDetail.typeProduct,
                        content: productDetail.content,
                        quantityToOrder: product.quantity,
                        total_price: product.total_price
                    };
                }));

                return {
                    buyerData: order.buyerData,
                    products: productDetails,
                    status: order.status,
                    date: order.date,
                    id: order.id
                
                };
            } catch (error) {
                // Captura cualquier error ocurrido durante la obtención de los detalles del pedido
                return { error: "Error al obtener detalles de productos:" + error.message }; // Devolvemos el error en la respuesta JSON
            }
        }));

        // Devolver los detalles de cada pedido con estado pendiente y los detalles de los productos
        return res.json(ordersWithDetails);
    } catch (error) {
        return res.status(500).json({ error: error.message }); // Devuelve el error general en la respuesta JSON
    }
}





