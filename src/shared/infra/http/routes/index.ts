import { Router } from "express";

import { authenticateRoutes } from "./authenticate.routes";
import { orderRoutes } from "./orders.routes";
import { productRoutes } from "./products.routes";
import { shoppingCartRoutes } from "./shoppingCarts.routes";
import { usersRoutes } from "./users.routes";

export const router = Router();

router.use("/api/users", usersRoutes);
router.use("/api/orders", orderRoutes);
router.use("/api/products", productRoutes);
router.use("/api/shoppingCarts", shoppingCartRoutes);

router.use(authenticateRoutes);
