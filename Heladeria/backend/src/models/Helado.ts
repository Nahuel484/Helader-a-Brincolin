import mongoose, { Schema, model, Document } from "mongoose";

export interface IHelado extends Document {
  nombre: string;
  sabor: string;
  baño?: string;
  stock: number;
  marca: string;
  tipo: string;
  precio: number;
}

const heladoSchema = new Schema<IHelado>(
  {
    nombre: { type: String, required: true },
    sabor: { type: String, required: true },
    baño: { type: String },
    stock: { type: Number, required: true, min: 0 },
    marca: { type: String, required: true },
    tipo: { type: String, required: true },
    precio: { type: Number, required: true, min: 0 },
  },
  { collection: "helados" }
); // Asegura que apunte a la colección correcta

export default mongoose.models.Helado ||
  model<IHelado>("Helado", heladoSchema, "helados");
