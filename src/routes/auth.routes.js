import { Router } from "express";
const router = Router();
import * as authCtrl from "../controllers/auth.controller"
import { verifySignup } from "../middlewares";

router.post("/signin", [verifySignup.validateFields], authCtrl.signIn);

router.post("/signup", [verifySignup.validateFields,    
                        verifySignup.checkDuplicateEmail,
                        verifySignup.verifyExistedRole], authCtrl.signUp);

export default router;