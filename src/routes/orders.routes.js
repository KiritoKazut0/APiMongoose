import { Router } from "express";
import * as ordersCtrl from "../controllers/orders.controller"
import { ordersValidate, authjwt, authLimiter, duplicateP } from "../middlewares"

//usara el patch, // post


const router = Router();

router.get('/', [authjwt.verifyToken,
                authjwt.isAdmin,
                authLimiter.getsLimit], ordersCtrl.getPendingOrders);


router.patch('/',  [authjwt.verifyToken,
                    authLimiter.patchLimit,
                    authjwt.isAdmin,
                    ordersValidate.verifyFields],  ordersCtrl.changeStatusOrders);


router.post("/",[authjwt.verifyToken,
                authLimiter.postLimits,
                authjwt.isAdmin,
                ordersValidate.verifyFields,
                duplicateP.verifyIdValid], ordersCtrl.createOrders);

                


export default router;