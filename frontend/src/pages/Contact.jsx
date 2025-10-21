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
      <div className="ContactPage-successMessage">
        <div className="ContactPage-successBox">
          <h2>¡Gracias por tu mensaje!</h2>
          <p>Nos pondremos en contacto contigo lo antes posible.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="section ContactPage">
      <div className="container ContactPage-container">
        {/* Título y descripción */}
        <div className="ContactPage-header">
          <h1>Contacto</h1>
          <p>¿Tienes un proyecto en mente? Ponte en contacto con nosotros.</p>
        </div>
        {/* Formulario de contacto */}
        <form onSubmit={handleSubmit} className="ContactForm bg-sub p-8 rounded-lg shadow-lg border-accent flex flex-col gap-6">
          {/* Campo nombre/empresa*/}
          <div className="FormGroup">
            <label htmlFor="user">Nombre / Empresa</label>
            <input
              type="text"
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              required
              className="ContactForm-input"
            />
          </div>
          {/* Campo email */}
          <div className="FormGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="ContactForm-input"
            />
          </div>
          {/* Campo teléfono */}
          <div className="FormGroup">
            <label htmlFor="tel">Teléfono (Opcional)</label>
            <input
              type="tel"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              className="ContactForm-input"
            />
          </div>
          {/* Botones para seleccionar tipo de cliente */}
          <fieldset className="ContactForm-fieldset">
            <legend>Tipo de cliente</legend>
            <div className="ContactForm-radioGroup">
              {/* Cliente particular por defecto */}
              <label className="ContactForm-radioLabel">
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
              <label className="ContactForm-radioLabel">
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
          <div className="FormGroup">
            <label htmlFor="info">Comentarios</label>
            <textarea
              id="info"
              name="info"
              rows="5"
              value={formData.info}
              onChange={handleChange}
              placeholder="Coméntanos brevemente sobre tu proyecto..."
              className="ContactForm-input"
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
