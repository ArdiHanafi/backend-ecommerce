import { Request, Response } from 'express';
import { compareSync, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { prismaClient } from '..';
import { JWT_SECRET } from '../secrets';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCode } from '../exceptions/root';
import { SignUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';

export const signup = async (req: Request, res: Response) => {
  SignUpSchema.parse(req.body);
  const { email, password, name } = req.body;

  const user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    throw new BadRequestException(
      'User already exists!',
      null,
      ErrorCode.USER_ALREADY_EXISTS
    );
  }
  const createUser = await prismaClient.user.create({
    data: {
      name,
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
    throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestException(
      'Incorrect password!',
      null,
      ErrorCode.INCORRECT_PASSWORD
    );
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

export const me = async (req: Request, res: Response) => {
  const resUser = req.user;
  delete (resUser as any).password;

  res.json(req.user);
};
