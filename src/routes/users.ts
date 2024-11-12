import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { addAddress, deleteAddress, listAddress, updateUser } from "../controllers/users";

const usersRoutes: Router = Router();

/**
 * @openapi
 * /api/users/address:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add a new address for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lineOne:
 *                 type: string
 *               lineTwo:
 *                 type: string
 *                 nullable: true
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 lineOne:
 *                   type: string
 *                 lineTwo:
 *                   type: string
 *                   nullable: true
 *                 city:
 *                   type: string
 *                 country:
 *                   type: string
 *                 pincode:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 formattedAddress:
 *                   type: string
 */
usersRoutes.post('/address', [authMiddleware], errorHandler(addAddress));

/**
 * @openapi
 * /api/users/address/{addressId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user address
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the address to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
usersRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));

/**
 * @openapi
 * /api/users/address:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a list of user addresses
 *     responses:
 *       200:
 *         description: A list of addresses associated with the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   lineOne:
 *                     type: string
 *                   lineTwo:
 *                     type: string
 *                     nullable: true
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *                   pincode:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   formattedAddress:
 *                     type: string
 */
usersRoutes.get('/address', [authMiddleware], errorHandler(listAddress));

/**
 * @openapi
 * /api/users:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               defaultShippingAddressId:
 *                 type: string
 *               defaultBillingAddressId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 role:
 *                   type: string
 *                 defaultShippingAddressId:
 *                   type: string
 *                 defaultBillingAddressId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
usersRoutes.put('/', [authMiddleware], errorHandler(updateUser));

export default usersRoutes;