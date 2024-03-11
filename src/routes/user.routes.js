import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";
import { authjwt, verifySignup, userExist } from "../middlewares";

const router = Router();

router.get("/", userCtrl.getUsers);  // solo es para obtener los socios

router.post("/", [  authjwt.verifyToken,
                     authjwt.isAdmin, 
                     verifySignup.validateFields,
                     verifySignup.checkDuplicateEmail,
                    verifySignup.verifyExistedRole], userCtrl.createUser);


router.delete("/:userId",[authjwt.verifyToken,
                         authjwt.isAdmin], userCtrl.deleteUser);

router.patch("/:userId", [authjwt.verifyToken, userExist], userCtrl.changePassword);



export default router;
