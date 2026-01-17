// middlewares/authMiddleware.ts

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// 👇 1. Definimos el payload del JWT
interface JwtPayload {
  id: string;
  rol: string;
}

// 👇 2. Extendemos la interfaz de Express.Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // opcional porque no todas las rutas lo tendrán
    }
  }
}

// 👇 3. Middleware de autenticación
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido." });
  }
};

// 👇 4. Middleware para admin
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.rol !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }
  next();
};
