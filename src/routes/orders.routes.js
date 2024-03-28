import { Router } from "express";
import * as ordersCtrl from "../controllers/orders.controller"
import { ordersValidate, authjwt, authLimiter, duplicateP, changeStatus } from "../middlewares"

//usara el patch, // post


const router = Router();

router.get('/', [authjwt.verifyToken,
                authLimiter.getsLimit,
                authjwt.isAdmin,
                changeStatus], ordersCtrl.getPendingOrders);


router.patch('/',  [
                    authLimiter.patchLimit,
                    ordersValidate.verifyStatusAndIds],  ordersCtrl.changeStatusOrders);


router.post("/",[authLimiter.postLimits,
                ordersValidate.verifyFields,
                duplicateP.verifyIdValid], ordersCtrl.createOrders);

                


export default router;