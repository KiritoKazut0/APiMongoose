import Orders from "../models/Orders";
import Products from "../models/Products";
import mongoose from "mongoose";

export const createOrders = async (req, res) => {

    try {
        const { buyerData, products } = req.body;

        const newOrder = new Orders({ buyerData, products });

        const ordersSave = await newOrder.save();

        return res.status(201).json({ ordersSave });

    } catch (error) {
        return res.status(500).json({ message: "Error the server" });
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


export const changeStatusOrders = async (req, res) => {
    try {
        const { id, status } = req.body;
        const completedOrders = [];
        const pendingOrders = [];

        if (status === "Cancelado") {
            try {
                const { status, id } = req.body;
                const result = await Orders.updateMany(
                    { _id: { $in: id } },
                    { $set: { status: status } }
                );

                if (result.n === 0) {
                    return res.json({ message: "No se encontraron pedidos para actualizar" });
                } else {
                    return res.json({ message: "El estado de los pedidos ha sido actualizado correctamente" });
                }
            } catch (error) {
                return res.status(500).json({ message: "Ocurrió un error al intentar actualizar los pedidos", error: error.message });
            }
        } else {
            // Verificar si los pedidos van a estar en espera o completados
            for (const orderId of id) {
                try {
                    const order = await Orders.findById(orderId);
                    const productsAvailability = await checkProductsAvailability(order.products);

                    if (productsAvailability) {
                        completedOrders.push(orderId);
                    } else {
                        pendingOrders.push(orderId);
                    }
                } catch (error) {
                    console.error("Error procesando pedido:", orderId, error);
                    return res.status(500).json({ message: "Error al procesar el pedido", error: error.message });
                }
            }

            // Actualizar los pedidos en espera y completados
            try {
                await Promise.all([
                    Orders.updateMany({ _id: { $in: completedOrders } }, { $set: { status: "Completado" } }),
                    Orders.updateMany({ _id: { $in: pendingOrders } }, { $set: { status: "En espera" } })
                ]);

                // Descuentos de productos
                await decreaseProductQuantities(completedOrders);

                const response = {
                    message: "El estado de los pedidos ha sido actualizado correctamente",
                    completedOrders,
                    pendingOrders
                };

                return res.json(response);
            } catch (error) {
                console.error("Error actualizando el estado de los pedidos:", error);
                return res.status(500).json({ message: "Error al actualizar el estado de los pedidos", error: error.message });
            }
        }
    } catch (error) {
        console.error("Error en el servidor:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}

async function checkProductsAvailability(products) {
    for (const product of products) {
        const ProductId = product._id.toString();
 
        const availableProduct = await Products.findById(`${ProductId}`);
        if (!availableProduct || availableProduct.amount < product.quantity) {
            return false; // No hay suficiente cantidad de este producto
        }
    }
    return true; // Todos los productos están disponibles en la cantidad requerida
}

async function decreaseProductQuantities(orderIds) {
    for (const orderId of orderIds) {
        const order = await Orders.findById(orderId);
        for (const product of order.products) {
            const dbProduct = await Products.findById(product._id);
            dbProduct.amount -= product.quantity;
            await dbProduct.save();
        }
    }
}



