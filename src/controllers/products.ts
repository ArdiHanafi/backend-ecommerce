import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { count } from "console";

export const createProduct = async (req: Request, res: Response) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags.join(",");
    }
    const updatedProduct = await prismaClient.product.update({
      where: {
        id: req.params.id,
      },
      data: product,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new NotFoundException(
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => { };

export const listProducts = async (req: Request, res: Response) => {
  const count = await prismaClient.product.count();
  const products = await prismaClient.product.findMany({
    skip: +req.query.skip || 0,
    take: 5,
  });
  res.json({
    count,
    data: products,
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
      "Product not found!",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const searchProduct = async (req: Request, res: Response) => {
  const searchTerm = req.query.q ? String(req.query.q) : null;

  const products: any[] = searchTerm
    ? await prismaClient.$queryRaw`
      SELECT * FROM "products"
      WHERE to_tsvector('english', name || ' ' || description || ' ' || tags) @@ plainto_tsquery('english', ${searchTerm});
    `
    : await prismaClient.product.findMany();

  res.json({
    count: products.length,
    products
  });
};
