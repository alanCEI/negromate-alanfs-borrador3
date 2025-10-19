/**
 * ============================================
 * Página de Contact "Contacto"
 * ============================================
 */

import { useState } from "react";
import "@/css/pages/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    user: "",
    email: "",
    tel: "",
    type: "private",
    info: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Manejador de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Manejador del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de llamada a la API de 1 segundo
    setTimeout(() => {
      console.log("Formulario enviado:", formData);
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };
  // Mostrar mensaje de éxito si el formulario fue enviado
  if (submitted) {
    return (
      <div className="contact-success-message">
        <div className="contact-success-box">
          <h2>¡Gracias por tu mensaje!</h2>
          <p>Nos pondremos en contacto contigo lo antes posible.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="section contact-page">
      <div className="container contact-container">
        {/* Título y descripción */}
        <div className="contact-header">
          <h1>Contacto</h1>
          <p>¿Tienes un proyecto en mente? Ponte en contacto con nosotros.</p>
        </div>
        {/* Formulario de contacto */}
        <form onSubmit={handleSubmit} className="contact-form">
          {/* Campo nombre/empresa*/}
          <div className="form-group">
            <label htmlFor="user">Nombre / Empresa</label>
            <input
              type="text"
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              required
            />
          </div>
          {/* Campo email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* Campo teléfono */}
          <div className="form-group">
            <label htmlFor="tel">Teléfono (Opcional)</label>
            <input
              type="tel"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
            />
          </div>
          {/* Botones para seleccionar tipo de cliente */}
          <fieldset className="fieldset">
            <legend>Tipo de cliente</legend>
            <div className="radio-group">
              {/* Cliente particular por defecto */}
              <label className="radio-label">
                <input
                  id="private"
                  name="type"
                  type="radio"
                  value="private"
                  checked={formData.type === "private"}
                  onChange={handleChange}
                />
                <span>Particular</span>
              </label>
              {/* Cliente empresa */}
              <label className="radio-label">
                <input
                  id="company"
                  name="type"
                  type="radio"
                  value="company"
                  checked={formData.type === "company"}
                  onChange={handleChange}
                />
                <span>Empresa</span>
              </label>
            </div>
          </fieldset>
          {/* Campo de texto para comentarios */}
          <div className="form-group">
            <label htmlFor="info">Comentarios</label>
            <textarea
              id="info"
              name="info"
              rows="5"
              value={formData.info}
              onChange={handleChange}
              placeholder="Coméntanos brevemente sobre tu proyecto..."
            ></textarea>
          </div>
          {/* Botón de envío */}
          <button type="submit" disabled={loading} className="button">
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
