import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";

const API_URL = "http://localhost:3000/api";

interface DashboardProps {
  user: {
    nombre: string;
    rol: string;
    token: string;
  };
  onNavigate: (
    view: "dashboard" | "products" | "orders" | "suggestions" | "admin"
  ) => void; // ✅ Tipo específico
}

interface TopFlavor {
  nombre: string;
  sabor: string;
  totalSold: number;
}

interface Stats {
  totalHelados: number;
  heladosDisponibles: number;
  misOrdenes: number;
  topFlavors: TopFlavor[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [stats, setStats] = useState<Stats>({
    totalHelados: 0,
    heladosDisponibles: 0,
    misOrdenes: 0,
    topFlavors: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Obtener helados
      const heladosRes = await fetch(`${API_URL}/helados`);
      const helados = await heladosRes.json();

      // Obtener mis órdenes
      const ordenesRes = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const ordenes = await ordenesRes.json();

      // Obtener top flavors
      const topRes = await fetch(`${API_URL}/helados/top-selling`);
      const topFlavors = await topRes.json();

      setStats({
        totalHelados: helados.length,
        heladosDisponibles: helados.filter((h: any) => h.stock > 0).length,
        misOrdenes: ordenes.length,
        topFlavors: Array.isArray(topFlavors) ? topFlavors.slice(0, 5) : [],
      });
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>
          {getCurrentGreeting()}, {user.nombre}! 👋
        </h1>
        <p className="welcome-subtitle">Bienvenido a Heladería Brincolin</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🍦</div>
          <div className="stat-content">
            <h3>{stats.totalHelados}</h3>
            <p>Sabores Totales</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.heladosDisponibles}</h3>
            <p>Disponibles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.misOrdenes}</h3>
            <p>Mis Pedidos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{stats.topFlavors.length}</h3>
            <p>Top Sabores</p>
          </div>
        </div>
      </div>

      <div className="featured-section">
        <div className="featured-card">
          <h2>🏆 Sabores Más Vendidos</h2>
          {stats.topFlavors.length > 0 ? (
            <div className="top-flavors-list">
              {stats.topFlavors.map((flavor, index) => (
                <div key={index} className="flavor-item">
                  <div className="flavor-rank">#{index + 1}</div>
                  <div className="flavor-info">
                    <h4>{flavor.nombre}</h4>
                    <p>{flavor.sabor}</p>
                  </div>
                  <div className="flavor-sales">
                    <span className="sales-count">{flavor.totalSold}</span>
                    <span className="sales-label">vendidos</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No hay estadísticas disponibles aún</p>
          )}
        </div>

        <div className="featured-card">
          <h2>📢 Anuncios</h2>
          <div className="announcements">
            <div className="announcement-item">
              <span className="announcement-icon">🎉</span>
              <div>
                <h4>¡Nuevos Sabores!</h4>
                <p>Descubre nuestras últimas creaciones artesanales</p>
              </div>
            </div>
            <div className="announcement-item">
              <span className="announcement-icon">💝</span>
              <div>
                <h4>Promoción Especial</h4>
                <p>Descuentos en pedidos mayores a 10 unidades</p>
              </div>
            </div>
            <div className="announcement-item">
              <span className="announcement-icon">🌟</span>
              <div>
                <h4>Programa de Fidelidad</h4>
                <p>Acumula puntos con cada compra</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ACCIONES RÁPIDAS CON FUNCIONALIDAD */}
      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="action-buttons">
          <button
            className="action-btn primary"
            onClick={() => onNavigate("products")}
          >
            <span className="btn-icon">🛍️</span>
            Ver Productos
          </button>
          <button
            className="action-btn secondary"
            onClick={() => onNavigate("orders")}
          >
            <span className="btn-icon">📋</span>
            Mis Pedidos
          </button>
          <button
            className="action-btn tertiary"
            onClick={() => onNavigate("suggestions")}
          >
            <span className="btn-icon">💬</span>
            Hacer Sugerencia
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
