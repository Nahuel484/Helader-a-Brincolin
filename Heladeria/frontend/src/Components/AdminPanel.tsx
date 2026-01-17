import React, { useEffect, useState } from "react";
import "../styles/AdminPanel.css";

const API_URL = "http://localhost:3000/api";

interface AdminPanelProps {
  user: {
    nombre: string;
    rol: string;
    token: string;
  };
}

interface TopFlavor {
  heladoId: string;
  nombre: string;
  sabor: string;
  totalSold: number;
}

interface OrderStats {
  _id: string;
  total: number;
  count: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: 0,
  });
  const [topFlavors, setTopFlavors] = useState<TopFlavor[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Cargar productos
      const productsRes = await fetch(`${API_URL}/helados`); // ✅ Corregido
      const products = await productsRes.json();

      // Cargar todos los pedidos
      const ordersRes = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const orders = await ordersRes.json();

      // Cargar top sabores
      const topRes = await fetch(`${API_URL}/helados/top-selling`); // ✅ Corregido
      const top = await topRes.json();

      const totalRevenue = orders.reduce(
        (sum: number, order: any) => sum + order.total,
        0
      );
      const lowStockCount = products.filter((p: any) => p.stock < 10).length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        lowStock: lowStockCount,
      });

      setTopFlavors(top);
      setAllOrders(orders);
    } catch (error) {
      console.error("Error cargando datos admin:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando panel de administración...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>👑 Panel de Administración</h1>
        <p>Gestión y estadísticas del negocio</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card primary">
          <div className="stat-icon">🍦</div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Productos Totales</p>
          </div>
        </div>

        <div className="admin-stat-card success">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Pedidos Totales</p>
          </div>
        </div>

        <div className="admin-stat-card warning">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.totalRevenue.toFixed(2)}</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>

        <div className="admin-stat-card danger">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{stats.lowStock}</h3>
            <p>Stock Bajo (&lt;10)</p>
          </div>
        </div>
      </div>

      <div className="admin-content-grid">
        <div className="admin-card">
          <h2>🏆 Top 5 Sabores Más Vendidos</h2>
          <div className="top-flavors-admin">
            {topFlavors.length > 0 ? (
              topFlavors.map((flavor, index) => (
                <div key={flavor.heladoId} className="flavor-row">
                  <div className="flavor-rank-badge">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : `#${index + 1}`}
                  </div>
                  <div className="flavor-details">
                    <h4>{flavor.nombre}</h4>
                    <p>{flavor.sabor}</p>
                  </div>
                  <div className="flavor-sales-badge">
                    <span className="sales-number">{flavor.totalSold}</span>
                    <span className="sales-text">vendidos</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No hay datos de ventas aún</p>
            )}
          </div>
        </div>

        <div className="admin-card">
          <h2>📊 Resumen de Ventas</h2>
          <div className="sales-summary">
            <div className="summary-row">
              <span>Total de Pedidos:</span>
              <strong>{stats.totalOrders}</strong>
            </div>
            <div className="summary-row">
              <span>Ingresos Totales:</span>
              <strong>${stats.totalRevenue.toFixed(2)}</strong>
            </div>
            <div className="summary-row">
              <span>Promedio por Pedido:</span>
              <strong>
                $
                {stats.totalOrders > 0
                  ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                  : "0.00"}
              </strong>
            </div>
            <div className="summary-row highlight">
              <span>Pedidos Hoy:</span>
              <strong>
                {
                  allOrders.filter((o) => {
                    const today = new Date().toDateString();
                    const orderDate = new Date(o.fecha).toDateString();
                    return today === orderDate;
                  }).length
                }
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card full-width">
        <h2>📋 Pedidos Recientes</h2>
        <div className="orders-table-container">
          {allOrders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.slice(0, 10).map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-8)}</td>
                    <td>
                      {order.userId?.nombre ||
                        order.userId?.email ||
                        "Usuario desconocido"}
                    </td>
                    <td>{order.items.length} productos</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge status-${order.estado}`}>
                        {order.estado}
                      </span>
                    </td>
                    <td>{new Date(order.fecha).toLocaleDateString("es-AR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No hay pedidos registrados</p>
          )}
        </div>
      </div>

      <div className="admin-actions-card">
        <h2>⚡ Acciones Rápidas</h2>
        <div className="quick-actions-grid">
          <button className="action-card">
            <span className="action-icon">➕</span>
            <span>Agregar Producto</span>
          </button>
          <button className="action-card">
            <span className="action-icon">📦</span>
            <span>Gestionar Stock</span>
          </button>
          <button className="action-card">
            <span className="action-icon">📊</span>
            <span>Ver Reportes</span>
          </button>
          <button className="action-card">
            <span className="action-icon">💬</span>
            <span>Ver Sugerencias</span>
          </button>
        </div>
      </div>

      <div className="admin-info">
        <div className="info-box">
          <h3>💡 Consejos de Gestión</h3>
          <ul>
            <li>Revisa regularmente el stock de productos populares</li>
            <li>
              Analiza los sabores más vendidos para optimizar el inventario
            </li>
            <li>
              Responde a las sugerencias de los clientes para mejorar el
              servicio
            </li>
            <li>Mantén los precios actualizados según costos y demanda</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
