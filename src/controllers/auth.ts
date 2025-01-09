import { prismaClient } from '..';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { Request, Response } from 'express';
import { SignUpSchema } from '../schema/user';
import { compareSync, hashSync } from 'bcrypt';
import { ErrorCode } from '../exceptions/root';
import { NotFoundException } from '../exceptions/not-found';
import { BadRequestException } from '../exceptions/bad-request';

export const signup = async (req: Request, res: Response) => {
  SignUpSchema.parse(req.body);
  const { email, password } = req.body;

  const user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    throw new BadRequestException(ErrorCode.USER_ALREADY_EXISTS, 'User already exists!', null);
  }
  const createUser = await prismaClient.user.create({
    data: {
      email,
      password: hashSync(password, 10),
    },
  });

  delete (createUser as any).password;

  res.json(createUser);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException(ErrorCode.USER_NOT_FOUND, 'User not found');
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestException(ErrorCode.INCORRECT_PASSWORD, 'Incorrect password!', null);
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );

  delete (user as any).password;

  res.json({ user, token });
};

