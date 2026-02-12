import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const hashPassword = (password) => bcrypt.hash(password, 10);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);
export const signToken = (payload) => jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
export const verifyToken = (token) => jwt.verify(token, config.jwtSecret);
