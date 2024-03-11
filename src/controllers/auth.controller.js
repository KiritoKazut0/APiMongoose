import User from "../models/User";
import jwt from "jsonwebtoken";
import config from "../config";
import Role from "../models/Role";


export const signUp = async (req, res) => {
    try {
        const { username, email, password, roles } = req.body;

        const newUser = new User({
            username,
            email,
            password: await User.encryptPassword(password),
            
        })

        if (roles) {
            const foundRoles = await Role.find({ name: { $in: roles } })
            newUser.roles =  foundRoles.map(role => role._id);
            console.log(newUser);
            

        } else {
            const role = await Role.findOne({ name: "Socio" });
            newUser.roles = [role._id]
        }

        const savedUser = await newUser.save();

        const token = await jwt.sign({ id: savedUser._id }, config.SECRET, {
            expiresIn: 900
        })

        return res.status(200).json({ token })

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
        const dateUser = await User.findOne({}, 'id roles username email');


        return res.json({  dateUser, token });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });

    }
};  

