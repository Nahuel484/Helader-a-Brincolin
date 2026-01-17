// backend/src/scripts/createMyAdmin.ts
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const createMyAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Conectado a MongoDB");

    const adminEmail = "nahuelruiz4848@gmail.com";
    const adminPassword = "N4huelRu1z484";

    // Eliminar el admin existente si tiene contraseña sin hashear
    await User.deleteOne({ email: adminEmail });
    console.log("🗑️ Usuario anterior eliminado");

    // Crear admin con contraseña hasheada
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      nombre: "Nahuel",
      apellido: "Ruiz",
      email: adminEmail,
      password: hashedPassword, // ✅ Hasheada correctamente
      rol: "admin",
    });

    await admin.save();
    console.log("✅ Admin creado exitosamente con contraseña segura");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log("👑 Rol: admin");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createMyAdmin();
