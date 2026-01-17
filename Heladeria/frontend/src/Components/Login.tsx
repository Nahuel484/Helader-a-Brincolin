import React, { useState } from "react";
import "../styles/Login.css";

const API_URL = "http://localhost:3000/api";

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en la operación");
      }

      if (isLogin) {
        // Login exitoso
        onLogin({
          id: data.id,
          nombre: data.nombre || formData.email.split("@")[0],
          email: formData.email,
          rol: data.rol,
          token: data.token,
        });
      } else {
        // Registro exitoso, cambiar a login
        setIsLogin(true);
        setError("");
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        setFormData({ nombre: "", email: "", password: "" });
      }
    } catch (err: any) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="ice-cream-bg">🍦</div>
        <div className="ice-cream-bg">🍨</div>
        <div className="ice-cream-bg">🍧</div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-large">🍦</div>
          <h1>Heladería Brincolin</h1>
          <p>Los mejores helados artesanales</p>
        </div>

        <div className="login-tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? "Cargando..."
              : isLogin
              ? "Iniciar Sesión"
              : "Registrarse"}
          </button>
        </form>

        <div className="login-footer">
          <p>🍦 Disfruta de nuestros helados artesanales. 🍨</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
