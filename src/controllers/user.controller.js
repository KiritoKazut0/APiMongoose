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


export const getUsers = async (req, res) =>{
    try {
        const ROLE = await Role.find({name: "Socio"});
        
        const users = await User.find({roles: ROLES});
        console.log(users)
        
       return res.status(200).json(users);

    } catch (error) {
        return res.status(500).json({message: "error al buscar al los socios"})
    }
}

