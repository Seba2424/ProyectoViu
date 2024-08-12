import React from 'react';
import '../styles/ProjectSelection.css';

const ProjectSelection = ({ onSelectProject }) => {
  const selectProject = (project) => {
    onSelectProject(project); // Asegúrate de que esta función está siendo llamada
  };

  return (
    <div id="project-selection">
      <h2>Seleccione el tipo de proyecto a evaluar</h2>
      <div className="project" onClick={() => selectProject('drenaje')}>
        <img src="/images/DrenajeUrbano.png" alt="Drenaje Urbano" />
        <h3>DRENAJE URBANO</h3>
      </div>
      <div className="project" onClick={() => selectProject('caminos')}>
        <img src="/images/CaminosBasicos.png" alt="Caminos Básicos" />
        <h3>CAMINOS BÁSICOS</h3>
      </div>
      <div className="project" onClick={() => selectProject('pavimentacion')}>
        <img src="/images/Pavimentacion.png" alt="Pavimentación Urbana" />
        <h3>PAVIMENTACIÓN URBANA</h3>
      </div>
    </div>
  );
};

export default ProjectSelection;
