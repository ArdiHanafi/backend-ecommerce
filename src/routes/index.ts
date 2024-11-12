import { Router } from "express";
import healthRoutes from "./healthCheck";
import authRoutes from "./auth";
import productsRoutes from "./products";
import usersRoutes from "./users";
import cartRoutes from "./carts";
import orderRoutes from "./orders";
import adminRoutes from "./admin";

const rootRouter: Router = Router()

rootRouter.use('/health', healthRoutes)
rootRouter.use('/auth', authRoutes)
rootRouter.use('/products', productsRoutes)
rootRouter.use('/users', usersRoutes)
rootRouter.use('/carts', cartRoutes)
rootRouter.use('/orders', orderRoutes)
rootRouter.use('/admin', adminRoutes)

export default rootRouter