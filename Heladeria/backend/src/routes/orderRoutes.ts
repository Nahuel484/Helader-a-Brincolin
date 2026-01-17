import express from "express";
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  cancelOrder, // ✅ Nueva función
} from "../controllers/orderController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get("/my-orders", authenticateToken, getOrdersByUser);
router.get("/", authenticateToken, getAllOrders);
router.patch("/:id/cancel", authenticateToken, cancelOrder); // ✅ Nueva ruta

export default router;
