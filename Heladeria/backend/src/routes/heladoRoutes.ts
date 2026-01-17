// routes/heladoRoutes.ts
import { Router } from "express";
import {
  getAllHelados,
  getHeladoById,
  createHelado,
  updateHelado,
  deleteHelado,
  getTopSellingFlavors,
} from "../controllers/heladoController";
import {
  authenticateToken,
  authorizeAdmin,
} from "../middleware/authMiddleware";

const router = Router();

// ⚠️ IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas con parámetros
// Endpoint de agregación (debe ir ANTES de /:id)
router.get("/top-selling", getTopSellingFlavors); // ✅ Movido aquí arriba

// Rutas públicas (lectura)
router.get("/", getAllHelados);
router.get("/:id", getHeladoById); // ✅ Ahora va después de /top-selling

// Rutas protegidas (solo admin)
router.post("/", authenticateToken, authorizeAdmin, createHelado);
router.put("/:id", authenticateToken, authorizeAdmin, updateHelado);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteHelado);

export default router;
