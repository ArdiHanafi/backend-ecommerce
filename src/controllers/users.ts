import { Request, Response } from 'express';
import { Address } from '@prisma/client';
import { AddressSchema, updateUserSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';
import { BadRequestException } from '../exceptions/bad-request';
import { prismaClient } from '..';

export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);

  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: true });
  } catch (error) {
    throw new NotFoundException(
      'Address not found.',
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};

export const listAddress = async (req: Request, res: Response) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(addresses);
};

export const updateUser = async (req: Request, res: Response) => {
  const validatedData = updateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validatedData.defaultShippingAddressId) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddressId,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        'Address not found.',
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (shippingAddress.userId !== req.user.id) {
      throw new BadRequestException(
        'Address does not belong to user',
        null,
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }

  if (validatedData.defaultBillingAddressId) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddressId,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        'Address not found.',
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (billingAddress.userId !== req.user.id) {
      throw new BadRequestException(
        'Address does not belong to user',
        null,
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: {
      id: req.user.id,
    },
    data: validatedData,
  });
  res.json(updatedUser);
};

export const listUsers = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 5 } = req.query;

  const pageNumber = Math.max(1, +page);
  const pageSizeNumber = Math.max(1, +pageSize);

  const users = await prismaClient.user.findMany({
    skip: (pageNumber - 1) * pageSizeNumber,
    take: pageSizeNumber,
  });
  const resUsers = users.map((usr) => {
    delete (usr as any).password;
    return { ...usr };
  });
  const totalItems = await prismaClient.user.count();

  res.json({
    items: resUsers,
    page: pageNumber,
    pageSize: pageSizeNumber,
    totalItems,
  });
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: req.params.id,
      },
      include: {
        addresses: true,
      },
    });
    delete (user as any).password;
    res.json(user);
  } catch (error) {
    throw new NotFoundException('User not found!', ErrorCode.USER_NOT_FOUND);
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        role: req.body.role,
      },
    });
    delete (user as any).password;
    res.json(user);
  } catch (error) {
    throw new NotFoundException('User not found!', ErrorCode.USER_NOT_FOUND);
  }
};
