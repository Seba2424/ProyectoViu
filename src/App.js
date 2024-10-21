import React, { useState } from 'react';
import Login from './components/Login';
import ProjectSelection from './components/ProjectSelection';
import ProjectForm from './components/ProjectForm';
import Map from './components/Map';
import Charts from './components/Charts';  // Importa el componente Charts
import './App.css';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [projectType, setProjectType] = useState(null);
  const [showCharts, setShowCharts] = useState(false); // Estado para mostrar los gráficos
  const [answers, setAnswers] = useState([]); // Estado para las respuestas de la evaluación

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleSelectProject = (type) => {
    setProjectType(type);
  };

  const handleFormSubmit = (data) => {
    setProjectData(data);
  };

  const handleStartEvaluation = () => {
    setIsEvaluating(true);
  };

  const handleEvaluationComplete = (collectedAnswers) => {
    console.log('Evaluación completada con respuestas:', collectedAnswers);
    setAnswers(collectedAnswers);  // Guardar las respuestas
    setShowCharts(true);  // Mostrar los gráficos
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
          {!showCharts ? (
            <Map 
              projectData={projectData} 
              onStartEvaluation={handleStartEvaluation} 
              isEvaluating={isEvaluating} 
              onEvaluationComplete={handleEvaluationComplete} 
              projectType={projectType} 
            />
          ) : (
            <div className="charts-container">
              <Charts 
                answers={answers}
                categories={["OPINIÓN SOCIAL", "VALORACIÓN Y REPUTACIÓN"]}
                subcategories={[
                  ['Identificación de opositores durante la formulación del proyecto', 'Apoyo mayoritario de la población local a la construcción de la infraestructura', 'Percepción general de las opiniones generadas sobre la infraestructura'],
                  ['Historial de proyectos anteriores', 'Experiencia y capacitación del personal', 'Transparencia y comunicación']
                ]}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;