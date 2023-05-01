import { Router } from "express";

import { authenticateRoutes } from "./authenticate.routes";
import { orderRoutes } from "./orders.routes";
import { productRoutes } from "./products.routes";
import { shoppingCartRoutes } from "./shoppingCarts.routes";
import { usersRoutes } from "./users.routes";

export const router = Router();

router.use("/users", usersRoutes);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);
router.use("/shoppingCart", shoppingCartRoutes);

router.use(authenticateRoutes);
