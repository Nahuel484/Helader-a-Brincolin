import React, { useEffect, useState } from "react";
import "../styles/Products.css";

const API_URL = "http://localhost:3000/api";

interface Product {
  _id: string;
  nombre: string;
  sabor: string;
  baño?: string;
  stock: number;
  marca: string;
  tipo: string;
  precio: number;
}

interface ProductsProps {
  user: {
    nombre: string;
    rol: string;
    token: string;
  };
}

const Products: React.FC<ProductsProps> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    sabor: "",
    baño: "",
    stock: 0,
    marca: "",
    tipo: "",
    precio: 5.0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterType]);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/helados`); // ✅ Corregido
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sabor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.marca.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((p) => p.tipo === filterType);
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (productId: string) => {
    setCart({
      ...cart,
      [productId]: (cart[productId] || 0) + 1,
    });
  };

  const removeFromCart = (productId: string) => {
    const newCart = { ...cart };
    if (newCart[productId] > 1) {
      newCart[productId]--;
    } else {
      delete newCart[productId];
    }
    setCart(newCart);
  };

  const handleOrder = async () => {
    const items = Object.entries(cart).map(([heladoId, cantidad]) => ({
      heladoId,
      cantidad,
    }));

    if (items.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    // Debug: ver qué estamos enviando
    console.log("Enviando orden:", { items });

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ items }),
      });

      if (response.ok) {
        alert("¡Pedido realizado con éxito!");
        setCart({});
        loadProducts();
      } else {
        const error = await response.json();
        console.error("Error del servidor:", error); // Debug
        alert(error.message || "Error al realizar el pedido");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct
      ? `${API_URL}/helados/${editingProduct._id}` // ✅ Corregido: sabores → helados
      : `${API_URL}/helados`; // ✅ Corregido: sabores → helados

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(editingProduct ? "Producto actualizado" : "Producto creado");
        setShowModal(false);
        setEditingProduct(null);
        setFormData({
          nombre: "",
          sabor: "",
          baño: "",
          stock: 0,
          marca: "",
          tipo: "",
          precio: 5.0,
        });
        loadProducts();
      } else {
        const error = await response.json();
        alert(error.message || "Error en la operación");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`${API_URL}/helados/${id}`, {
        // ✅ Corregido: sabores → helados
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        alert("Producto eliminado");
        loadProducts();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      sabor: product.sabor,
      baño: product.baño || "",
      stock: product.stock,
      marca: product.marca,
      tipo: product.tipo,
      precio: product.precio,
    });
    setShowModal(true);
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, cantidad]) => {
      const product = products.find((p) => p._id === productId);
      return total + (product ? product.precio * cantidad : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="products">
      <div className="products-header">
        <h1>🍦 Nuestros Helados</h1>
        {user.rol === "admin" && (
          <button
            className="btn-primary"
            onClick={() => {
              setEditingProduct(null);
              setFormData({
                nombre: "",
                sabor: "",
                baño: "",
                stock: 0,
                marca: "",
                tipo: "",
                precio: 5.0,
              });
              setShowModal(true);
            }}
          >
            ➕ Agregar Producto
          </button>
        )}
      </div>

      <div className="products-controls">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, sabor o marca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todos los tipos</option>
          {[...new Set(products.map((p) => p.tipo))].map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      {user.rol === "cliente" && getCartItemCount() > 0 && (
        <div className="cart-summary">
          <div className="cart-info">
            <span className="cart-icon">🛒</span>
            <span>{getCartItemCount()} productos</span>
            <span className="cart-total">
              Total: ${getCartTotal().toFixed(2)}
            </span>
          </div>
          <button className="btn-primary" onClick={handleOrder}>
            Realizar Pedido
          </button>
        </div>
      )}

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-header">
              <div className="product-icon">🍨</div>
              <div className="product-badge">{product.tipo}</div>
            </div>

            <h3>{product.nombre}</h3>
            <p className="product-flavor">{product.sabor}</p>
            {product.baño && (
              <p className="product-coating">🍫 {product.baño}</p>
            )}

            <div className="product-details">
              <span className="product-brand">🏷️ {product.marca}</span>
              <span
                className={`product-stock ${
                  product.stock > 0 ? "in-stock" : "out-stock"
                }`}
              >
                {product.stock > 0
                  ? `✅ Stock: ${product.stock}`
                  : "❌ Sin stock"}
              </span>
            </div>

            <div className="product-price">${product.precio.toFixed(2)}</div>

            {user.rol === "cliente" ? (
              <div className="product-actions">
                {cart[product._id] ? (
                  <div className="quantity-controls">
                    <button onClick={() => removeFromCart(product._id)}>
                      -
                    </button>
                    <span>{cart[product._id]}</span>
                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={cart[product._id] >= product.stock}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn-add-cart"
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock === 0}
                  >
                    🛒 Agregar
                  </button>
                )}
              </div>
            ) : (
              <div className="admin-actions">
                <button
                  className="btn-edit"
                  onClick={() => openEditModal(product)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(product._id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No se encontraron productos</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h2>
            <form onSubmit={handleCreateOrUpdate}>
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Sabor"
                value={formData.sabor}
                onChange={(e) =>
                  setFormData({ ...formData, sabor: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Baño (opcional)"
                value={formData.baño}
                onChange={(e) =>
                  setFormData({ ...formData, baño: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value) })
                }
                required
                min="0"
              />
              <input
                type="text"
                placeholder="Marca"
                value={formData.marca}
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Tipo"
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    precio: parseFloat(e.target.value),
                  })
                }
                required
                min="0"
                step="0.01"
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingProduct ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
