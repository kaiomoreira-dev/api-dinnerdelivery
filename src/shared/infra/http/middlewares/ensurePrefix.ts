import { NextFunction, Request, Response } from "express";

export function ensurePrefix(
  request: Request,
  response: Response,
  next: NextFunction
) {
  request.url = `/api${request.url}`;
  next();
}
