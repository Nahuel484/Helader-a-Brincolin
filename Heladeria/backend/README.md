# 🍦 Heladería Brincolín - API REST

Este proyecto es una API REST profesional desarrollada con **Node.js**, **Express**, **TypeScript** y **MongoDB**. Está diseñada para gestionar el inventario de helados, la autenticación de usuarios (clientes y administradores) y el procesamiento de pedidos.

## 📖 Descripción del Proyecto

La API de **Heladería Brincolín** permite a los usuarios registrarse y realizar pedidos de helados, mientras que los administradores tienen el control total del inventario y la supervisión de todas las ventas. Se implementó una lógica de negocio que valida el stock en tiempo real y ofrece estadísticas mediante agregaciones de MongoDB.

## 🛠️ Tecnologías Utilizadas

- **Lenguaje:** TypeScript
- **Framework:** Express.js
- **Base de Datos:** MongoDB (Mongoose)
- **Seguridad:** JSON Web Tokens (JWT) y Bcrypt
- **Validación:** Zod
- **Entorno:** Dotenv, CORS

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MongoDB instalado localmente o una cuenta en MongoDB Atlas.
- Git

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio:**

   ```bash
   git clone [https://github.com/Nahuel484/Helader-a-Brincolin.git](https://github.com/Nahuel484/Helader-a-Brincolin.git)
   cd Heladeria/backend

    Instalación de dependencias:
        npm install
    Configurar variables de entorno: Crea un archivo .env en la carpeta backend con el siguiente contenido:
    PORT=3000
    MONGODB_URI=tu_uri_de_mongodb
    JWT_SECRET=tu_palabra_secreta_super_segura

    Ejecución
    npm run dev
   ```

   📑 Documentación de la API
   🔐 Autenticación
   POST /api/auth/register - Registro de nuevos usuarios.

POST /api/auth/login - Inicio de sesión (devuelve el Token JWT).

🍦 Helados (Inventario)
GET /api/helados - Listar todos los helados (Público).

GET /api/helados/:id - Detalle de un helado.

GET /api/helados/top-selling - [Agregación] Los 5 sabores más vendidos.

POST /api/helados - Crear helado (Solo Admin).

PUT /api/helados/:id - Actualizar helado (Solo Admin).

DELETE /api/helados/:id - Eliminar helado (Solo Admin).

🛒 Pedidos (Orders)
POST /api/orders - Crear un nuevo pedido (Requiere Login).

GET /api/orders/my-orders - Ver mis pedidos.

GET /api/orders - Ver todos los pedidos realizados (Solo Admin).

PATCH /api/orders/:id/cancel - Cancelar un pedido pendiente (Devuelve stock automáticamente).

📊 Ejemplo de Request y Response (Crear Pedido)
Endpoint: POST /api/orders

Header: Authorization: Bearer <token_jwt>

Request Body:
{
"items": [
{
"heladoId": "65a1234567890abcdef12345",
"cantidad": 2
}
]
}
Response (201 Created):

JSON

{
"\_id": "65b9876543210fedcba54321",
"userId": "65a111...",
"items": [...],
"total": 10.0,
"estado": "pendiente",
"fecha": "2024-05-20T..."
}
👤 Autor
Nahuel Ruiz - Nahuel484

---

### Unos últimos consejos para tu entrega:

1. **Archivo .gitignore:** Asegúrate de que tu `.gitignore` tenga `node_modules` y `.env` para que no se suban.
2. **Carpeta de scripts:** Como incluiste archivos como `createMyAdmin.ts` y `updatePrecios.ts`, es excelente porque demuestra que sabes manejar la base de datos fuera de la API.
3. **Endpoint de Agregación:** El endpoint `/top-selling` cumple perfectamente con el requisito de "Agregación" solicitado en la página 3 de la consigna.

¡Mucha suerte con la entrega final!
