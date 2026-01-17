// src/models/User.ts
import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "cliente";
}

const userSchema = new Schema<IUser>({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["admin", "cliente"], default: "cliente" },
});

export default model<IUser>("User", userSchema);
