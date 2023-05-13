import { Router } from "express";

import { ensurePrefix } from "../middlewares/ensurePrefix";
import { authenticateRoutes } from "./authenticate.routes";
import { orderRoutes } from "./orders.routes";
import { productRoutes } from "./products.routes";
import { shoppingCartRoutes } from "./shoppingCarts.routes";
import { usersRoutes } from "./users.routes";

export const router = Router();

router.use(ensurePrefix);
router.use("users", usersRoutes);
router.use("orders", orderRoutes);
router.use("products", productRoutes);
router.use("shoppingCarts", shoppingCartRoutes);

router.use(authenticateRoutes);
