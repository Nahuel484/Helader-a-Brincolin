import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Products from "./Components/Products";
import Orders from "./Components/Orders";
import Suggestions from "./Components/Suggestions";
import AdminPanel from "./Components/AdminPanel";

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "cliente";
  token: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "products" | "orders" | "suggestions" | "admin"
  >("dashboard");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCurrentView("dashboard");
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="logo">🍦</span>
          <h1>Heladería Brincolin</h1>
        </div>
        <div className="navbar-menu">
          <button
            className={currentView === "dashboard" ? "active" : ""}
            onClick={() => setCurrentView("dashboard")}
          >
            Inicio
          </button>
          <button
            className={currentView === "products" ? "active" : ""}
            onClick={() => setCurrentView("products")}
          >
            Productos
          </button>
          <button
            className={currentView === "orders" ? "active" : ""}
            onClick={() => setCurrentView("orders")}
          >
            Mis Pedidos
          </button>
          <button
            className={currentView === "suggestions" ? "active" : ""}
            onClick={() => setCurrentView("suggestions")}
          >
            Sugerencias
          </button>
          {user.rol === "admin" && (
            <button
              className={currentView === "admin" ? "active" : ""}
              onClick={() => setCurrentView("admin")}
            >
              Panel Admin
            </button>
          )}
        </div>
        <div className="navbar-user">
          <span className="user-name">👤 {user.nombre}</span>
          <span className="user-role">
            {user.rol === "admin" ? "👑 Admin" : "🛍️ Cliente"}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="main-content">
        {/* ✅ Agregada prop onNavigate */}
        {currentView === "dashboard" && (
          <Dashboard user={user} onNavigate={setCurrentView} />
        )}
        {currentView === "products" && <Products user={user} />}
        {currentView === "orders" && <Orders user={user} />}
        {currentView === "suggestions" && <Suggestions user={user} />}
        {currentView === "admin" && user.rol === "admin" && (
          <AdminPanel user={user} />
        )}
      </main>
    </div>
  );
}

export default App;
