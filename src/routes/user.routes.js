import { Router } from "express";
import * as userCtrl from "../controllers/user.controller";
import { authjwt, verifySignup, userExist } from "../middlewares";

const router = Router();
// [authjwt.verifyToken, authjwt.isAdmin]

router.post("/", [  authjwt.verifyToken,
                     authjwt.isAdmin, 
                     verifySignup.validateFields,
                     verifySignup.checkDuplicateEmail,
                    verifySignup.verifyExistedRole], userCtrl.createUser);

                    // [authjwt.verifyToken,
                    //     authjwt.isAdmin],

router.get("/", userCtrl.getUsers);  

router.delete("/:userId",[authjwt.verifyToken,
                         authjwt.isAdmin], userCtrl.deleteUser);

router.patch("/:userId", [userExist], userCtrl.changePassword)



export default router;
