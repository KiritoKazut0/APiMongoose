import { Router } from "express";
import * as ordersCtrl from "../controllers/orders.controller"
import {ordersValidate,authjwt, authLimiter} from "../middlewares"


const router = Router();

// [authjwt.verifyToken,
//     authjwt.isAdmin, 
//     authLimiter.getsLimit],

// [  authjwt.verifyToken,
//     authLimiter.amountLimit,
//     authjwt.isAdmin,
//     ordersValidate.verifyFields],

router.get('/', ordersCtrl.getOrders);

                 
router.post("/",  ordersCtrl.createOrders);


export default router;