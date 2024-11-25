import { Request, Response } from 'express';
import { prismaClient } from '..';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

export const createOrder = async (req: Request, res: Response) => {
  return prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return res.json({ message: 'Cart is empty' });
    }

    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);

    const address = await tx.address.findFirst({
      where: {
        id: req.user.defaultShippingAddressId as string,
      },
    });

    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address?.formattedAddress ?? '',
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });

    await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        userId: req.user.id,
      },
    });

    return res.json(order);
  });
};

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: 'CANCELLED',
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: 'CANCELLED',
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findUniqueOrThrow({
      where: {
        id: req.params.id,
      },
      include: {
        products: true,
        events: true,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 5, status } = req.query; // Extract query parameters

  // Validate pagination parameters
  const pageNumber = Math.max(1, +page); // Ensure page is at least 1
  const pageSizeNumber = Math.max(1, +pageSize); // Ensure pageSize is at least 1

  // Construct the where clause for filtering
  const whereClause: any = {};
  if (status) {
    whereClause.status = status; // Add status filter if provided
  }

  // Fetch orders with pagination
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: (pageNumber - 1) * pageSizeNumber, // Calculate skip
    take: pageSizeNumber, // Limit to pageSize
  });

  // Get total count for pagination metadata
  const totalItems = await prismaClient.order.count({
    where: whereClause,
  });

  // Send response with pagination metadata
  res.json({
    items: orders,
    page: pageNumber,
    pageSize: pageSizeNumber,
    totalItems,
  });
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: req.body.status,
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: req.body.status,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listUserOrders = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 5 } = req.body;
  const userId = req.params.id;
  const { status } = req.params;

  const pageNumber = Math.max(1, +page); // Ensure page is at least 1
  const pageSizeNumber = Math.max(1, +pageSize); // Ensure pageSize is at least 1

  // Construct the where clause
  const whereClause: any = { userId };
  if (status) {
    whereClause.status = status;
  }

  // Perform the query with pagination
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: (pageNumber - 1) * pageSizeNumber, // Skip records based on the page number
    take: pageSizeNumber, // Limit the number of records to pageSize
  });

  // Optionally, include total count for frontend
  const totalItems = await prismaClient.order.count({
    where: whereClause,
  });

  res.json({
    items: orders,
    page: pageNumber,
    pageSize: pageSizeNumber,
    totalItems,
  });
};
