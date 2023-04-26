import { Router } from "express";

import { authenticateRoutes } from "./authenticate.routes";
import { orderRoutes } from "./orders.routes";
import { usersRoutes } from "./users.routes";

export const router = Router();

router.use("/users", usersRoutes);
router.use("/orders", orderRoutes);

router.use(authenticateRoutes);
