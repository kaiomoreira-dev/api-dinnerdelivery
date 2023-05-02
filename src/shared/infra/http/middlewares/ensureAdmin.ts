/* eslint-disable consistent-return */
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { NextFunction, Request, Response } from "express";

import { AppError } from "@shared/errors/AppError";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { id } = request.user;

    const userRepository = new UsersRepository();

    const user = await userRepository.findById(id);

    if (!user.admin) {
      throw new AppError("Permission denied!");
    }

    return next();
  } catch (error) {
    throw new AppError("User not have permission to access this page", 401);
  }
}
