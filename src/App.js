import React, { useState } from 'react';
import Login from './components/Login';
import ProjectSelection from './components/ProjectSelection';
import ProjectForm from './components/ProjectForm';
import Map from './components/Map';
import './App.css';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [projectType, setProjectType] = useState(null); // Estado para guardar el tipo de proyecto

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleSelectProject = (type) => {
    setProjectType(type); // Guardar el tipo de proyecto seleccionado
  };

  const handleFormSubmit = (data) => {
    setProjectData(data);
  };

  const handleStartEvaluation = () => {
    setIsEvaluating(true);
  };

  const handleEvaluationComplete = (answers) => {
    console.log('Evaluación completada con respuestas:', answers);
  };

  return (
    <div className="app-container">
      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : !projectType ? (
        <ProjectSelection onSelectProject={handleSelectProject} />
      ) : !projectData ? (
        <ProjectForm onSubmitForm={handleFormSubmit} />
      ) : (
        <>
          <Map 
            projectData={projectData} 
            onStartEvaluation={handleStartEvaluation} 
            isEvaluating={isEvaluating} 
            onEvaluationComplete={handleEvaluationComplete} 
            projectType={projectType} // Pasar projectType como prop
          />
        </>
      )}
    </div>
  );
};

export default App;
