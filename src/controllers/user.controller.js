import User from "../models/User";
import Role from "../models/Role";

export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User(
            {
                username,
                email,
                password: await User.encryptPassword(password)
            });

        const role = await Role.findOne({ name: "Socio" });

        newUser.roles = [role._id]
        const userSave = await newUser.save();

        return res.status(201).json(userSave);

    } catch (error) {
        return res.status(500).json({ message: "error server " });
    }

};


export const getUsers = async (req, res) => {
    try {
        const ROLE = await Role.find({ name: "Socio" });

        const users = await User.find({ roles: ROLE });
        console.log(users)

        return res.status(200).json(users);

    } catch (error) {
        return res.status(500).json({ message: "error al buscar al los socios" })
    }
}


export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        return res.json({ message: "User deleted" })
    } catch (error) {
        return res.status(400).json({ message: "error deleting user" });
    }

}

export const changePassword = async (req, res) => {

    try {
        
        const {recevedPassword} = req.body.password;
        const matchPassword = await User.comparePassword(password, recevedPassword );
        // if (!);

        const shearchUser = await User.findByIdAndUpdate(req.params.userId, req.body.password, {
            new: true
        });
        if (!shearchUser) return res.status(401).json({ message: "User not found" });
        
    

        return res.status(201).json({ shearchUser });

    } catch (error) {
        return res.status(500).json({message: "Error Server "})
    }

}
