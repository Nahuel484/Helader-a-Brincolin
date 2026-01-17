// controllers/heladoController.ts
import { Request, Response } from "express";
import Helado from "../models/Helado";
import Order from "../models/Order";
import { z, ZodError } from "zod";

// Esquema de validación con Zod (creación)
const createHeladoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  sabor: z.string().min(1, "El sabor es obligatorio"), // ❌ "Helado" → ✅ "sabor"
  baño: z.string().optional(),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  marca: z.string().min(1, "La marca es obligatoria"),
  tipo: z.string().min(1, "El tipo es obligatorio"),
  precio: z.number().min(0, "El precio no puede ser negativo"),
});

// Esquema de validación para actualización (campos opcionales)
const updateHeladoSchema = createHeladoSchema.partial();

// ─── CRUD ─────────────────────────────────────────────

export const getAllHelados = async (req: Request, res: Response) => {
  // ❌ "Heladoes" → ✅ "Helados"
  try {
    const helados = await Helado.find(); // ❌ "Heladoes" → ✅ "helados"
    res.json(helados);
  } catch (error) {
    console.error("Error en getAllHelados:", error);
    res.status(500).json({ message: "Error al obtener los helados" });
  }
};

export const getHeladoById = async (req: Request, res: Response) => {
  try {
    const helado = await Helado.findById(req.params.id); // ❌ "Helado" → ✅ "helado"
    if (!helado) {
      return res.status(404).json({ message: "Helado no encontrado" });
    }
    res.json(helado);
  } catch (error) {
    console.error("Error en getHeladoById:", error);
    res.status(500).json({ message: "Error al obtener el helado" });
  }
};

export const createHelado = async (req: Request, res: Response) => {
  try {
    const data = createHeladoSchema.parse(req.body);
    const nuevoHelado = new Helado(data);
    await nuevoHelado.save();
    res.status(201).json(nuevoHelado);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Datos inválidos", errors: error.issues });
    }
    console.error("Error en createHelado:", error);
    res.status(500).json({ message: "Error al crear el helado" });
  }
};

export const updateHelado = async (req: Request, res: Response) => {
  try {
    const data = updateHeladoSchema.parse(req.body);
    const helado = await Helado.findByIdAndUpdate(req.params.id, data, {
      // ❌ "Helado" → ✅ "helado"
      new: true,
    });
    if (!helado) {
      return res.status(404).json({ message: "Helado no encontrado" });
    }
    res.json(helado);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Datos inválidos", errors: error.issues });
    }
    console.error("Error en updateHelado:", error);
    res.status(500).json({ message: "Error al actualizar el helado" });
  }
};

export const deleteHelado = async (req: Request, res: Response) => {
  try {
    const helado = await Helado.findByIdAndDelete(req.params.id); // ❌ "Helado" → ✅ "helado"
    if (!helado) {
      return res.status(404).json({ message: "Helado no encontrado" });
    }
    res.json({ message: "Helado eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteHelado:", error);
    res.status(500).json({ message: "Error al eliminar el helado" });
  }
};

// ─── ENDPOINT DE AGREGACIÓN ───────────────────────────

export const getTopSellingFlavors = async (req: Request, res: Response) => {
  try {
    const topFlavors = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.heladoId", // ❌ "HeladoId" → ✅ "heladoId" (debe coincidir con tu modelo Order)
          totalSold: { $sum: "$items.cantidad" },
        },
      },
      {
        $lookup: {
          from: "helados", // ❌ "Heladoes" → ✅ "helados" (nombre real de la colección)
          localField: "_id",
          foreignField: "_id",
          as: "heladoInfo", // ❌ "HeladoInfo" → ✅ "heladoInfo"
        },
      },
      { $unwind: "$heladoInfo" },
      {
        $project: {
          _id: 0,
          heladoId: "$_id",
          nombre: "$heladoInfo.nombre",
          sabor: "$heladoInfo.sabor", // ❌ "Helado" → ✅ "sabor"
          totalSold: 1,
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json(topFlavors);
  } catch (error) {
    console.error("Error en getTopSellingFlavors:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los helados más vendidos" });
  }
};
