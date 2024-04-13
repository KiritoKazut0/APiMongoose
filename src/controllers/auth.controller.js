import User from "../models/User";
import jwt from "jsonwebtoken";
import config from "../config";
import Role from "../models/Role";


export const signUp = async (req, res) => {
    try {
        const { username, email, password, roles, telefono, img } = req.body;

        const newUser = new User({
            username,
            email,
            telefono,
            img,
            password: await User.encryptPassword(password), 
        })

        if (roles) {
            const foundRoles = await Role.find({ name: { $in: roles } })
            newUser.roles =  foundRoles.map(role => role._id);         

        } else {
            const role = await Role.findOne({ name: "Socio" });
            newUser.roles = [role._id]
        }

        await newUser.save();

        return res.status(201).json({ message: "add correct users" })

    } catch (error) {

        return res.status(500).json({ error: "Internal Server Error aqui" });

    }

}


export const signIn = async (req, res) => { 
    try {
        const { email, username, password } = req.body;
        const userFound = await User.findOne({ email, username });

        if (!userFound) return res.status(401).json({ message: "User not found" });

        const matchPassword = await User.comparePassword(password, userFound.password);

        if (!matchPassword) return res.status(401).json({ message: "Incorrect credentials" });

        const token = jwt.sign({ id: userFound._id }, config.SECRET, { expiresIn: 900 });
        const userWithRoles = await User.findOne({}).populate('roles')

        const dateUser = {
            username: userWithRoles.username,
            roles: userWithRoles.roles.map(role => role.name)
        };

        return res.json({dateUser, token });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });

    }
};  

