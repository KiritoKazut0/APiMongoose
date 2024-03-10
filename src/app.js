import express from "express";
import morgan from "morgan";
import { createRoles } from "./libs/initialSetup";
import ProductsRouter from "./routes/products.routes";
import authRoutes from "./routes/auth.routes"
import userRouts from "./routes/user.routes"

const app = express();
createRoles();
app.use(morgan('dev'));
app.use(express.json())

app.get ("/", (req, res)=>{
        res.status(200).json({
            name: "kirito",
            dev: "developper"
        });
})  

app.use('/products',ProductsRouter);
app.use('/api/auth/',authRoutes);
app.use('/api/users', userRouts);


export default app;

