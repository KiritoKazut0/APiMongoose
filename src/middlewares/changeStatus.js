export const changeStatus = async (req, res, next)=>{

    const { id, status } = req.body;

    if (!id || id.length === 0) return res.status(401).json({ message: "Se requiere el campo 'id' y no puede estar vacío" });

    if (!status) return res.status(401).json({ message: "se requiere el campo de status" });

    if (!["Completado", "Cancelado", ].includes(status)) {
        return res.status(400).json({ message: "El estado proporcionado no es válido" });
    }

    next();

}

