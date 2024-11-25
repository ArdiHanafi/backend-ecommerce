import { Request, Response } from 'express';
import { prismaClient } from '..';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

export const createProduct = async (req: Request, res: Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(','),
    },
  });
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags.join(',');
    }
    const updatedProduct = await prismaClient.product.update({
      where: {
        id: req.params.id,
      },
      data: product,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new NotFoundException(
      'Product not found!',
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteProduct = async (req: Request, res: Response) => {};

export const listProducts = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 5 } = req.query;

  const pageNumber = Math.max(1, +page);
  const pageSizeNumber = Math.max(1, +pageSize);

  const products = await prismaClient.product.findMany({
    skip: (pageNumber - 1) * pageSizeNumber,
    take: pageSizeNumber,
  });
  const totalItems = await prismaClient.product.count();

  res.json({
    items: products,
    page: pageNumber,
    pageSize: pageSizeNumber,
    totalItems,
  });
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: req.params.id,
      },
    });
    res.json(product);
  } catch (error) {
    throw new NotFoundException(
      'Product not found!',
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const searchProduct = async (req: Request, res: Response) => {
  const searchTerm = req.query.q ? String(req.query.q) : null;

  const products: any[] = searchTerm
    ? await prismaClient.$queryRaw`
      SELECT * FROM "products"
      WHERE name ILIKE '%' || ${searchTerm} || '%' 
        OR description ILIKE '%' || ${searchTerm} || '%' 
        OR tags ILIKE '%' || ${searchTerm} || '%';
      `
    : await prismaClient.product.findMany();

  res.json({
    count: products.length,
    products,
  });
};
