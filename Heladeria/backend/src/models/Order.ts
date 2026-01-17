import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId; // Referencia al usuario que hizo el pedido
  items: Array<{
    heladoId: mongoose.Types.ObjectId; // Referencia al helado
    cantidad: number; // Cantidad solicitada
  }>;
  total: number; // Precio total del pedido
  estado: "pendiente" | "completado" | "cancelado"; // Estado del pedido
  fecha: Date; // Fecha de creación
}

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      heladoId: { type: Schema.Types.ObjectId, ref: "Helado", required: true },
      cantidad: { type: Number, required: true, min: 1 },
    },
  ],
  total: { type: Number, required: true, min: 0 },
  estado: {
    type: String,
    enum: ["pendiente", "completado", "cancelado"],
    default: "pendiente",
  },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>("Order", OrderSchema);
