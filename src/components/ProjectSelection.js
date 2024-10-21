import React from 'react';
import '../styles/ProjectSelection.css';

const ProjectSelection = ({ onSelectProject }) => {
  const selectProject = (project) => {
    onSelectProject(project);
  };

  return (
    <div className="project-selection-container">
      <video autoPlay muted loop id="background-video">
      <source src="/images/VideoFondo.mp4" type="video/mp4" />
      </video>
      <div className="project-selection">
        <h2>Seleccione el tipo de proyecto a evaluar</h2>
        <div className="project" onClick={() => selectProject('drenaje')}>
          <img src="/images/DrenajeUrbano.png" alt="Drenaje Urbano" />
          <h3>DRENAJE URBANO</h3>
        </div>
        <div className="project" onClick={() => selectProject('caminos')}>
          <img src="/images/CaminoRural.png" alt="Caminos Básicos" />
          <h3>CAMINOS BÁSICOS</h3>
        </div>
        <div className="project" onClick={() => selectProject('pavimentacion')}>
          <img src="/images/PaviUrbana.png" alt="Pavimentación Urbana" />
          <h3>PAVIMENTACIÓN URBANA</h3>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelection;
