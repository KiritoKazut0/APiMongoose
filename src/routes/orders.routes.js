import { Router } from "express";
import * as ordersCtrl from "../controllers/orders.controller"
import {ordersValidate,authjwt, authLimiter} from "../middlewares"


const router = Router();


router.get('/', [authjwt.verifyToken,
                 authjwt.isAdmin, 
                 authLimiter.getsLimit],  ordersCtrl.getOrders);

                 
router.post("/", [  authjwt.verifyToken,
                    authLimiter.amountLimit,
                    authjwt.isAdmin,
                    ordersValidate.verifyFields], ordersCtrl.createOrders);


export default router;