import auth from "@config/auth";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // destruturar do headers o toke
  const authHeader = request.headers.authorization;

  // validar no if pra ve se existe
  if (!authHeader) {
    throw new AppError("Miss token", 401);
  }
  // destruturar o token de dentro do authHeader
  const [, token] = authHeader.split(" ");
  // verificar no verify o token
  // retirar de dentro do verify o id do user que esta no token
  try {
    console.log(token);
    const { sub: user_id } = verify(token, auth.secret_token) as IPayload;

    // depois pesquisar em um método findbyid que vamos criar

    // adicionar user_id no request do express
    request.user = {
      id: user_id,
    };
    next();
  } catch {
    throw new AppError("Invalid token", 401);
  }
}
