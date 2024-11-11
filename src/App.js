import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ProjectSelection from './components/ProjectSelection';
import ProjectForm from './components/ProjectForm';
import Map from './components/Map';
import Charts from './components/Charts';
import caminos from './preguntas/caminos.json';
import drenaje from './preguntas/drenaje.json';
import pavimentacion from './preguntas/pavimentacion.json';
import './App.css';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [projectType, setProjectType] = useState(null);
  const [showCharts, setShowCharts] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

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
    setAnswers(collectedAnswers);
    setShowCharts(true);
  };

  // Función para cargar dinámicamente las categorías y subcategorías desde el JSON
  useEffect(() => {
    let data;
    if (projectType === 'caminos') {
      data = caminos.caminos;
    } else if (projectType === 'drenaje') {
      data = drenaje.drenaje;
    } else if (projectType === 'pavimentacion') {
      data = pavimentacion.pavimentacion;
    }

    if (data) {
      // Extraer las categorías y subcategorías del JSON
      const extractedCategories = data.map((category) => category.categoria);
      const extractedSubcategories = data.map((category) =>
        (category.subcategorias || []).map((sub) => sub.subcategoria || category.categoria)
      );

      setCategories(extractedCategories);
      setSubcategories(extractedSubcategories);
    }
  }, [projectType]);

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
                categories={categories}
                subcategories={subcategories}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
