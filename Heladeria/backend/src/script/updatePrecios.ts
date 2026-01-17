import mongoose from "mongoose";
import Helado from "../models/Helado"; // Sube un nivel desde config y entra a models

async function updatePrecios() {
  try {
    // Conexión a la base de datos Heladeria
    await mongoose.connect("mongodb://localhost:27017/Heladeria");
    console.log("📡 Conectado a la base de datos Heladeria");

    // Actualización masiva de la colección 'helados'
    const res = await Helado.updateMany({}, { $set: { precio: 5.0 } }); // El updateMany es un metdo de mongoose para actualizar varios documentos que cumplan con un criterio. En este caso, el criterio es un objeto vacío {}, lo que significa que se aplicará a todos los documentos en la colección que no posea el campo establecido em el segundo termino
    //  precio en este caso y el segundo argumento es el operador $set que establece el campo precio a 5.0 para todos los documentos seleccionados.

    console.log(`✅ ¡Éxito! Se actualizaron ${res.modifiedCount} helados.`);
  } catch (error) {
    console.error("❌ Error en la actualización:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updatePrecios();
