import React, { useState } from 'react';
import '../styles/ProjectForm.css';

const ProjectForm = ({ onSubmitForm }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    comuna: '',
    plazo: '',
    inversion: '',
    justificacion: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitForm(formData);
  };

  return (
    <div className="project-form-container">
      <form onSubmit={handleSubmit} className="project-form">
        <h2>Complete el formulario</h2>
        <label>Nombre del proyecto:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />

        <label>Ubicación:</label>
        <select name="ubicacion" value={formData.ubicacion} onChange={handleChange} required>
          <option value="">Seleccione una ubicación</option>
          <option value="Temuco">Temuco</option>
          <option value="Gorbea">Gorbea</option>
          <option value="Teodoro Schmidt">Teodoro Schmidt</option>
          <option value="Perquenco">Perquenco</option>
          <option value="Los Sauces">Los Sauces</option>
        </select>

        <label>Plazo (en días):</label>
        <input type="number" name="plazo" value={formData.plazo} onChange={handleChange} required />

        <label>Monto de inversión:</label>
        <input type="number" name="inversion" value={formData.inversion} onChange={handleChange} required />

        <label>Justificación del proyecto:</label>
        <textarea name="justificacion" value={formData.justificacion} onChange={handleChange} required></textarea>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ProjectForm;