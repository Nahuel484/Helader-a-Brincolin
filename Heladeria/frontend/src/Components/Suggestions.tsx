import React, { useState, useEffect } from "react";
import "../styles/Suggestions.css";

interface Suggestion {
  id: string;
  userId: string;
  userName: string;
  tipo: "nuevo-sabor" | "mejora" | "queja" | "otro";
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: "pendiente" | "en-revision" | "implementado" | "rechazado";
  respuesta?: string;
}

interface SuggestionsProps {
  user: {
    nombre: string;
    rol: string;
    token: string;
  };
}

const Suggestions: React.FC<SuggestionsProps> = ({ user }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "nuevo-sabor" as const,
    titulo: "",
    descripcion: "",
  });

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = () => {
    // Cargar sugerencias desde localStorage (simulación)
    const stored = localStorage.getItem("suggestions");
    if (stored) {
      setSuggestions(JSON.parse(stored));
    }
  };

  const saveSuggestions = (newSuggestions: Suggestion[]) => {
    localStorage.setItem("suggestions", JSON.stringify(newSuggestions));
    setSuggestions(newSuggestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSuggestion: Suggestion = {
      id: Date.now().toString(),
      userId: user.nombre,
      userName: user.nombre,
      tipo: formData.tipo,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fecha: new Date().toISOString(),
      estado: "pendiente",
    };

    const updated = [newSuggestion, ...suggestions];
    saveSuggestions(updated);

    setFormData({ tipo: "nuevo-sabor", titulo: "", descripcion: "" });
    setShowForm(false);
    alert("¡Sugerencia enviada con éxito! Gracias por tu aporte 😊");
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "nuevo-sabor":
        return "🍦";
      case "mejora":
        return "⭐";
      case "queja":
        return "😟";
      case "otro":
        return "💡";
      default:
        return "📝";
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "nuevo-sabor":
        return "Nuevo Sabor";
      case "mejora":
        return "Mejora";
      case "queja":
        return "Queja";
      case "otro":
        return "Otro";
      default:
        return tipo;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "estado-pendiente";
      case "en-revision":
        return "estado-revision";
      case "implementado":
        return "estado-implementado";
      case "rechazado":
        return "estado-rechazado";
      default:
        return "";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "⏳";
      case "en-revision":
        return "👀";
      case "implementado":
        return "✅";
      case "rechazado":
        return "❌";
      default:
        return "📋";
    }
  };

  const mySuggestions = suggestions.filter((s) => s.userId === user.nombre);

  return (
    <div className="suggestions">
      <div className="suggestions-header">
        <div>
          <h1>💬 Sugerencias</h1>
          <p>Tu opinión nos ayuda a mejorar</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "❌ Cancelar" : "➕ Nueva Sugerencia"}
        </button>
      </div>

      {showForm && (
        <div className="suggestion-form-card">
          <h2>Nueva Sugerencia</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tipo de Sugerencia</label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value as any })
                }
                required
              >
                <option value="nuevo-sabor">🍦 Nuevo Sabor</option>
                <option value="mejora">⭐ Mejora</option>
                <option value="queja">😟 Queja</option>
                <option value="otro">💡 Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                placeholder="Ej: Helado de dulce de leche con brownies"
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Cuéntanos más sobre tu sugerencia..."
                required
                rows={5}
                maxLength={500}
              />
              <small>{formData.descripcion.length}/500 caracteres</small>
            </div>

            <button type="submit" className="btn-submit">
              Enviar Sugerencia
            </button>
          </form>
        </div>
      )}

      <div className="suggestions-stats">
        <div className="stat-card">
          <span className="stat-number">{mySuggestions.length}</span>
          <span className="stat-label">Mis Sugerencias</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {mySuggestions.filter((s) => s.estado === "pendiente").length}
          </span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {mySuggestions.filter((s) => s.estado === "implementado").length}
          </span>
          <span className="stat-label">Implementadas</span>
        </div>
      </div>

      <div className="suggestions-content">
        <div className="suggestions-section">
          <h2>Mis Sugerencias</h2>
          {mySuggestions.length === 0 ? (
            <div className="no-suggestions">
              <div className="no-suggestions-icon">💭</div>
              <p>Aún no has enviado ninguna sugerencia</p>
              <p className="suggestion-hint">
                ¡Comparte tus ideas con nosotros!
              </p>
            </div>
          ) : (
            <div className="suggestions-list">
              {mySuggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion-card">
                  <div className="suggestion-header">
                    <div className="suggestion-tipo">
                      <span className="tipo-icon">
                        {getTipoIcon(suggestion.tipo)}
                      </span>
                      <span className="tipo-label">
                        {getTipoLabel(suggestion.tipo)}
                      </span>
                    </div>
                    <div
                      className={`suggestion-estado ${getEstadoColor(
                        suggestion.estado
                      )}`}
                    >
                      <span>
                        {getEstadoIcon(suggestion.estado)} {suggestion.estado}
                      </span>
                    </div>
                  </div>

                  <h3>{suggestion.titulo}</h3>
                  <p className="suggestion-description">
                    {suggestion.descripcion}
                  </p>

                  <div className="suggestion-footer">
                    <span className="suggestion-date">
                      📅{" "}
                      {new Date(suggestion.fecha).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    {suggestion.respuesta && (
                      <div className="suggestion-response">
                        <strong>Respuesta del equipo:</strong>
                        <p>{suggestion.respuesta}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="suggestions-section">
          <h2>Todas las Sugerencias</h2>
          {suggestions.length === 0 ? (
            <div className="no-suggestions">
              <p>No hay sugerencias aún</p>
            </div>
          ) : (
            <div className="suggestions-list compact">
              {suggestions.slice(0, 10).map((suggestion) => (
                <div key={suggestion.id} className="suggestion-card-compact">
                  <div className="compact-header">
                    <span className="tipo-icon">
                      {getTipoIcon(suggestion.tipo)}
                    </span>
                    <div className="compact-info">
                      <h4>{suggestion.titulo}</h4>
                      <p className="compact-meta">
                        Por {suggestion.userName} •{" "}
                        {new Date(suggestion.fecha).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <div
                      className={`compact-estado ${getEstadoColor(
                        suggestion.estado
                      )}`}
                    >
                      {getEstadoIcon(suggestion.estado)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="suggestions-info">
        <h3>💡 ¿Cómo funciona?</h3>
        <div className="info-grid">
          <div className="info-card">
            <span className="info-icon">1️⃣</span>
            <h4>Envía tu idea</h4>
            <p>
              Comparte tu sugerencia de nuevo sabor, mejora o cualquier
              comentario
            </p>
          </div>
          <div className="info-card">
            <span className="info-icon">2️⃣</span>
            <h4>Revisión</h4>
            <p>Nuestro equipo evaluará tu propuesta</p>
          </div>
          <div className="info-card">
            <span className="info-icon">3️⃣</span>
            <h4>Implementación</h4>
            <p>Las mejores ideas se harán realidad</p>
          </div>
          <div className="info-card">
            <span className="info-icon">4️⃣</span>
            <h4>Reconocimiento</h4>
            <p>Te notificaremos cuando tu idea sea implementada</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
