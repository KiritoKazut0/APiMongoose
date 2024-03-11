import { Router } from "express";
import * as ProductsCtrl from "../controllers/products.controller"
import { authjwt, duplicateP } from "../middlewares";

const router = Router();


router.get("/", ProductsCtrl.getProducts );
router.get("/:productId", ProductsCtrl.getProductById);

router.post("/",[authjwt.verifyToken, authjwt.isAdmin,
                 duplicateP.validateFields, duplicateP.verifyDuplicate
                ], ProductsCtrl.createProduct);

router.put("/:productId", [authjwt.verifyToken, authjwt.isAdmin, 
                            duplicateP.validateFields],  ProductsCtrl.updateProducById);
                            
router.delete("/:productId", [authjwt.verifyToken, authjwt.isAdmin],  ProductsCtrl.deleteProductsById);



export default router;