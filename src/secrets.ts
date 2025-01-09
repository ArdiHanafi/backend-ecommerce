import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const { PORT } = process.env;
export const { API_KEY } = process.env;
export const { NODE_ENV } = process.env;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const { BASIC_AUTH_USER } = process.env;
export const { BASIC_AUTH_PASSWORD } = process.env;
