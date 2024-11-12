import { Router } from "express";
import { changeUserRole, getUserById, listUsers } from "../controllers/users";
import { errorHandler } from "../error-handler";
import adminMiddleware from "../middlewares/admin";
import authMiddleware from "../middlewares/auth";

const adminRoutes: Router = Router();

// * User
/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags:
 *       - AdminUser
 *     summary: List all users
 *     description: Retrieve a list of all users, including their details such as role and default addresses.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [ADMIN, USER]
 *                   defaultShippingAddressId:
 *                     type: string
 *                     nullable: true
 *                   defaultBillingAddressId:
 *                     type: string
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
adminRoutes.get('/users', [authMiddleware, adminMiddleware], errorHandler(listUsers));

/**
 * @openapi
 * /api/admin/users/{userId}:
 *   get:
 *     tags:
 *       - AdminUser
 *     summary: Retrieve a user by ID
 *     description: Fetch details of a user by their unique ID, including their addresses.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user.
 *     responses:
 *       200:
 *         description: User details retrieved successfully
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
 *                 role:
 *                   type: string
 *                   enum: [ADMIN, USER]
 *                 defaultShippingAddressId:
 *                   type: string
 *                   nullable: true
 *                 defaultBillingAddressId:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 addresses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       lineOne:
 *                         type: string
 *                       lineTwo:
 *                         type: string
 *                         nullable: true
 *                       city:
 *                         type: string
 *                       country:
 *                         type: string
 *                       pincode:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       formattedAddress:
 *                         type: string
 */
adminRoutes.get('/users/:id', [authMiddleware, adminMiddleware], errorHandler(getUserById));

/**
 * @openapi
 * /api/admin/users/{userId}/role:
 *   put:
 *     tags:
 *       - AdminUser
 *     summary: Edit user role
 *     description: Update the role of a specific user by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: ["ADMIN", "USER"]
 *                 description: The new role for the user.
 *     responses:
 *       200:
 *         description: User role updated successfully
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
 *                 role:
 *                   type: string
 *                   enum: ["ADMIN", "USER"]
 *                 defaultShippingAddressId:
 *                   type: string
 *                   nullable: true
 *                 defaultBillingAddressId:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
adminRoutes.put('/users/:id/role', [authMiddleware, adminMiddleware], errorHandler(changeUserRole));

export default adminRoutes;