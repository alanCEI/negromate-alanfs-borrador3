/**
 * Contact - Página de formulario de contacto
 *
 * @description
 * Página que permite a los usuarios enviar consultas y solicitudes de presupuesto
 * a través de un formulario. Captura información del cliente, tipo de proyecto
 * y detalles de contacto. Actualmente simula el envío (sin backend real).
 *
 * @component
 * Características principales:
 * - Formulario controlado con validación HTML5
 * - Distinción entre clientes particulares y empresas
 * - Estados de carga y éxito para feedback del usuario
 * - Validación de campos requeridos (nombre, email)
 * - Campo de teléfono opcional
 *
 * @returns {JSX.Element} Página de contacto con formulario
 */

import { useState } from 'react';
import '@/css/pages/Contact.css';

const Contact = () => {
    /**
     * Estado del formulario - Almacena todos los datos ingresados por el usuario
     *
     * Campos:
     * - user: Nombre del usuario o empresa
     * - email: Correo electrónico de contacto
     * - tel: Número de teléfono (opcional)
     * - type: Tipo de cliente ('private' o 'company')
     * - info: Comentarios o descripción del proyecto
     */
    const [formData, setFormData] = useState({ user: '', email: '', tel: '', type: 'private', info: '' });

    // Estado para controlar si el formulario fue enviado exitosamente
    const [submitted, setSubmitted] = useState(false);

    // Estado de carga para deshabilitar el botón durante el envío
    const [loading, setLoading] = useState(false);

    /**
     * handleChange - Manejador de cambios en los campos del formulario
     *
     * @param {Event} e - Evento del input que cambió
     *
     * Actualiza el estado formData de forma inmutable, preservando los valores
     * anteriores y actualizando solo el campo modificado.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Actualización inmutable del estado usando spread operator
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * handleSubmit - Manejador del envío del formulario
     *
     * @param {Event} e - Evento de submit del formulario
     *
     * Previene el comportamiento por defecto, simula una petición API
     * y actualiza los estados de carga y éxito. En producción, aquí
     * se realizaría una petición real al backend.
     */
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevenir recarga de la página
        setLoading(true);

        // TODO: Reemplazar con llamada real a la API
        // Simulación de llamada a API con timeout de 1 segundo
        setTimeout(() => {
            console.log('Formulario enviado:', formData);
            setSubmitted(true);
            setLoading(false);
        }, 1000);
    };

    // Renderizado condicional: mostrar mensaje de éxito si el formulario fue enviado
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
                 {/* Encabezado con título y descripción de la página */}
                 <div className="contact-header">
                    <h1>Contacto</h1>
                    <p>¿Tienes un proyecto en mente? Ponte en contacto con nosotros.</p>
                 </div>

                 {/* Formulario de contacto con validación HTML5 */}
                <form onSubmit={handleSubmit} className="contact-form">
                    {/* Campo nombre/empresa - Requerido */}
                    <div className="form-group">
                        <label htmlFor="user">Nombre / Empresa</label>
                        <input type="text" id="user" name="user" value={formData.user} onChange={handleChange} required />
                    </div>

                    {/* Campo email - Requerido con validación de formato */}
                     <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    {/* Campo teléfono - Opcional */}
                     <div className="form-group">
                        <label htmlFor="tel">Teléfono (Opcional)</label>
                        <input type="tel" id="tel" name="tel" value={formData.tel} onChange={handleChange} />
                    </div>

                    {/* Grupo de radio buttons para seleccionar tipo de cliente */}
                    <fieldset className="fieldset">
                        <legend>Tipo de cliente</legend>
                        <div className="radio-group">
                            {/* Opción: Cliente particular (valor por defecto) */}
                            <label className="radio-label">
                                <input id="private" name="type" type="radio" value="private" checked={formData.type === 'private'} onChange={handleChange} />
                                <span>Particular</span>
                            </label>

                            {/* Opción: Empresa */}
                             <label className="radio-label">
                                <input id="company" name="type" type="radio" value="company" checked={formData.type === 'company'} onChange={handleChange} />
                                <span>Empresa</span>
                            </label>
                        </div>
                    </fieldset>

                    {/* Campo de texto largo para comentarios y descripción del proyecto */}
                    <div className="form-group">
                        <label htmlFor="info">Comentarios</label>
                        <textarea id="info" name="info" rows="5" value={formData.info} onChange={handleChange} placeholder="Coméntanos brevemente sobre tu proyecto..."></textarea>
                    </div>

                    {/* Botón de envío - Se deshabilita durante el estado de carga */}
                     <button type="submit" disabled={loading} className="button">
                        {loading ? 'Enviando...' : 'Enviar'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
