import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";
import { authjwt, verifySignup } from "../middlewares";

const router = Router();
// [authjwt.verifyToken, authjwt.isAdmin]

router.post("/", [  authjwt.verifyToken,
                     authjwt.isAdmin, 
                     verifySignup.validateFields,
                     verifySignup.checkDuplicateEmail,
                    verifySignup.verifyExistedRole], userCtrl.createUser);

router.get("/", [authjwt.verifyToken, authjwt.isAdmin], userCtrl.getUsers);



export default router;
