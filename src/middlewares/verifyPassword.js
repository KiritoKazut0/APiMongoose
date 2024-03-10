import User from "../models/User"

export const userExist = async (req, res, next) => {

    try {

        if (!req.params.userId || !req.body.password) {
            return res.status(401).json({message: "Please provide all required data"})
        }

        const userExist = User.findById(req.params.userId);
        if (!userExist) return res.status().json({ message: "User not found" });

        next();
    } catch (error) {
        return res.status().json({ message: "Error Server" });
    }



}