// controllers/orderController.ts
import { Request, Response } from "express";
import Order from "../models/Order";
import Helado from "../models/Helado";
import { createOrderSchema } from "../validations/orderValidations";
import { ZodError } from "zod";

// Asegúrate de que req.user esté definido (extiende Express.Request)
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; rol: string }; // Ajusta según tu JWT payload
    }
  }
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    // Validar datos con Zod
    const validatedData = createOrderSchema.parse(req.body);

    // Verificar stock para cada ítem
    for (const item of validatedData.items) {
      const helado = await Helado.findById(item.heladoId);
      if (!helado || helado.stock < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para el helado: ${helado?.nombre}`,
        });
      }
    }

    // Calcular total usando el precio real de cada helado
    let total = 0;
    for (const item of validatedData.items) {
      const helado = await Helado.findById(item.heladoId);
      if (helado) {
        total += helado.precio * item.cantidad;
      }
    }

    // ✅ Verificar que req.user exista
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Crear el pedido
    const newOrder = new Order({
      userId: req.user.id,
      items: validatedData.items,
      total,
      estado: "pendiente",
    });

    await newOrder.save();

    // Actualizar stock
    for (const item of validatedData.items) {
      await Helado.findByIdAndUpdate(
        item.heladoId,
        { $inc: { stock: -item.cantidad } },
        { new: true }
      );
    }

    res.status(201).json(newOrder);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Datos de pedido inválidos",
        errors: error.issues,
      });
    }
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getOrdersByUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const orders = await Order.find({ userId: req.user.id }).populate(
      "items.heladoId"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    // Opcional: proteger esta ruta solo para admin
    const orders = await Order.find()
      .populate("userId", "nombre email")
      .populate("items.heladoId", "nombre sabor");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ✅ NUEVA FUNCIÓN: Cancelar pedido
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // Verificar que el pedido pertenece al usuario (excepto si es admin)
    if (req.user.rol !== "admin" && order.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para cancelar este pedido" });
    }

    // Solo se pueden cancelar pedidos pendientes
    if (order.estado !== "pendiente") {
      return res
        .status(400)
        .json({ message: "Solo se pueden cancelar pedidos pendientes" });
    }

    // Devolver el stock de los productos
    for (const item of order.items) {
      await Helado.findByIdAndUpdate(
        item.heladoId,
        { $inc: { stock: item.cantidad } }, // Devolver al stock
        { new: true }
      );
    }

    // Cambiar estado a cancelado
    order.estado = "cancelado";
    await order.save();

    res.json({ message: "Pedido cancelado exitosamente", order });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
