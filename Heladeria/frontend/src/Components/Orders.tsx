import React, { useEffect, useState } from "react";
import "../styles/Orders.css";

const API_URL = "http://localhost:3000/api";

interface OrderItem {
  heladoId: {
    _id: string;
    nombre: string;
    sabor: string;
    precio: number;
  };
  cantidad: number;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  estado: "pendiente" | "completado" | "cancelado";
  fecha: string;
}

interface OrdersProps {
  user: {
    nombre: string;
    rol: string;
    token: string;
  };
}

const Orders: React.FC<OrdersProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NUEVA FUNCIÓN: Cancelar pedido
  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("¿Estás seguro de cancelar este pedido?")) return;

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: "cancelado" }),
      });

      if (response.ok) {
        alert("Pedido cancelado exitosamente");
        loadOrders(); // Recargar la lista
      } else {
        const error = await response.json();
        alert(error.message || "Error al cancelar el pedido");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "completado":
        return "status-completed";
      case "pendiente":
        return "status-pending";
      case "cancelado":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "completado":
        return "✅";
      case "pendiente":
        return "⏳";
      case "cancelado":
        return "❌";
      default:
        return "📦";
    }
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.estado === filterStatus);

  if (loading) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  return (
    <div className="orders">
      <div className="orders-header">
        <h1>📦 Mis Pedidos</h1>
        <div className="orders-stats">
          <div className="stat-badge">
            <span>Total: {orders.length}</span>
          </div>
          <div className="stat-badge pending">
            <span>
              ⏳ Pendientes:{" "}
              {orders.filter((o) => o.estado === "pendiente").length}
            </span>
          </div>
          <div className="stat-badge completed">
            <span>
              ✅ Completados:{" "}
              {orders.filter((o) => o.estado === "completado").length}
            </span>
          </div>
          <div className="stat-badge cancelled">
            <span>
              ❌ Cancelados:{" "}
              {orders.filter((o) => o.estado === "cancelado").length}
            </span>
          </div>
        </div>
      </div>

      <div className="orders-filters">
        <button
          className={filterStatus === "all" ? "active" : ""}
          onClick={() => setFilterStatus("all")}
        >
          Todos
        </button>
        <button
          className={filterStatus === "pendiente" ? "active" : ""}
          onClick={() => setFilterStatus("pendiente")}
        >
          Pendientes
        </button>
        <button
          className={filterStatus === "completado" ? "active" : ""}
          onClick={() => setFilterStatus("completado")}
        >
          Completados
        </button>
        <button
          className={filterStatus === "cancelado" ? "active" : ""}
          onClick={() => setFilterStatus("cancelado")}
        >
          Cancelados
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📭</div>
          <h2>No hay pedidos</h2>
          <p>
            {filterStatus === "all"
              ? "¡Haz tu primer pedido y disfruta de nuestros helados!"
              : `No tienes pedidos ${filterStatus}`}
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Pedido #{order._id.slice(-8)}</h3>
                  <p className="order-date">
                    📅{" "}
                    {new Date(order.fecha).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className={`order-status ${getStatusColor(order.estado)}`}>
                  <span>
                    {getStatusIcon(order.estado)} {order.estado.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Productos:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-icon">🍨</div>
                    <div className="item-details">
                      <p className="item-name">
                        {item.heladoId?.nombre || "Producto no disponible"}
                      </p>
                      <p className="item-flavor">{item.heladoId?.sabor}</p>
                    </div>
                    <div className="item-quantity">
                      <span>x{item.cantidad}</span>
                    </div>
                    <div className="item-price">
                      ${(item.heladoId?.precio * item.cantidad || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                {/* ✅ NUEVO: Botón de cancelar solo si está pendiente */}
                {order.estado === "pendiente" && (
                  <button
                    className="btn-cancel-order"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    ❌ Cancelar Pedido
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
