import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart";

const cartRoutes: Router = Router();

/**
 * @openapi
 * /api/carts:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add a product to the cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add to the cart
 *                 example: "cm0jqdbad0000c0fy7lt17g6h"
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product to add
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product added to the cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 productId:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
cartRoutes.post('/', [authMiddleware], errorHandler(addItemToCart));

/**
 * @openapi
 * /api/carts:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get all products in the cart
 *     responses:
 *       200:
 *         description: List of products in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       cartId:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       tags:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 */
cartRoutes.get('/', [authMiddleware], errorHandler(getCart));

/**
 * @openapi
 * /api/carts/{cartId}:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Delete a cart item
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
cartRoutes.delete('/:id', [authMiddleware], errorHandler(deleteItemFromCart));

/**
 * @openapi
 * /api/carts/{cartId}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Update the quantity of a product in the cart
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 productId:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
cartRoutes.put('/:id', [authMiddleware], errorHandler(changeQuantity));

export default cartRoutes;