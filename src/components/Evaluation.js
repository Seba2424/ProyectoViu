import React, { useState, useEffect } from 'react';
import '../styles/Evaluation.css';
import caminos from '../preguntas/caminos.json';
import drenaje from '../preguntas/drenaje.json';
import pavimentacion from '../preguntas/pavimentacion.json';

const Evaluation = ({ onEvaluationComplete, projectType }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentSubCategoryIndex, setCurrentSubCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [openText, setOpenText] = useState('');

  useEffect(() => {
    let data;
    if (projectType === 'caminos') {
      data = caminos.caminos;
    } else if (projectType === 'drenaje') {
      data = drenaje.drenaje;
    } else if (projectType === 'pavimentacion') {
      data = pavimentacion.pavimentacion;
    }

    console.log("Datos cargados:", data);
    setQuestions(data || []);
    setLoading(false);
  }, [projectType]);

  const getSelectedAnswer = () => {
    if (
      answers[currentCategoryIndex] &&
      answers[currentCategoryIndex][currentSubCategoryIndex] &&
      answers[currentCategoryIndex][currentSubCategoryIndex][currentQuestionIndex]
    ) {
      return answers[currentCategoryIndex][currentSubCategoryIndex][currentQuestionIndex];
    }
    return null;
  };

  const saveOpenTextAnswer = () => {
    const updatedAnswers = [...answers];
    if (!updatedAnswers[currentCategoryIndex]) {
      updatedAnswers[currentCategoryIndex] = [];
    }
    if (!updatedAnswers[currentCategoryIndex][currentSubCategoryIndex]) {
      updatedAnswers[currentCategoryIndex][currentSubCategoryIndex] = [];
    }
    updatedAnswers[currentCategoryIndex][currentSubCategoryIndex][currentQuestionIndex] = openText || '';
    setAnswers(updatedAnswers);
  };

  useEffect(() => {
    const selectedAnswer = getSelectedAnswer();
    if (questions.length > 0 && questions[currentCategoryIndex]) {
      const currentCategory = questions[currentCategoryIndex];
      const subcategories = currentCategory.subcategorias || [];
      const currentSubCategory = subcategories[currentSubCategoryIndex];
      const currentQuestions = currentSubCategory ? currentSubCategory.preguntas : currentCategory.preguntas;
      const currentQuestion = currentQuestions[currentQuestionIndex];

      if (currentQuestion.tipo === 'abierta' && selectedAnswer) {
        setOpenText(selectedAnswer);
      } else {
        setOpenText('');
      }
    }
  }, [currentQuestionIndex, currentSubCategoryIndex, currentCategoryIndex, questions]);

  if (loading) {
    return <div>Cargando preguntas...</div>;
  }

  if (!questions.length) {
    return <div>No se encontraron preguntas</div>;
  }

  const currentCategory = questions[currentCategoryIndex];
  const subcategories = currentCategory.subcategorias || [];
  const currentSubCategory = subcategories[currentSubCategoryIndex];
  const currentQuestions = currentSubCategory ? currentSubCategory.preguntas : currentCategory.preguntas;
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const isLastQuestion = currentCategoryIndex === questions.length - 1 &&
    currentSubCategoryIndex === subcategories.length - 1 &&
    currentQuestionIndex === currentQuestions.length - 1;

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    if (!updatedAnswers[currentCategoryIndex]) {
      updatedAnswers[currentCategoryIndex] = [];
    }
    if (!updatedAnswers[currentCategoryIndex][currentSubCategoryIndex]) {
      updatedAnswers[currentCategoryIndex][currentSubCategoryIndex] = [];
    }
    updatedAnswers[currentCategoryIndex][currentSubCategoryIndex][currentQuestionIndex] = answer || '';
    setAnswers(updatedAnswers);

    if (!isLastQuestion) {
      proceedToNextQuestion();
    }
  };

  const proceedToNextQuestion = () => {
    if (currentQuestion.tipo === 'abierta') {
      saveOpenTextAnswer(); // Guardar la respuesta antes de avanzar
    }
  
    console.log("Evaluando siguiente paso...");
    console.log("isLastQuestion: ", isLastQuestion);
  
    if (isLastQuestion) {
      console.log("Estamos en la última pregunta, vamos a la confirmación...");
      setConfirmationQuestion();
      return;
    }
  
    // Avanzar a la siguiente pregunta
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSubCategoryIndex < subcategories.length - 1 && subcategories.length > 0) {
      // Solo avanzamos en las subcategorías si existen
      setCurrentSubCategoryIndex(currentSubCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    } else if (currentCategoryIndex < questions.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentSubCategoryIndex(0);
      setCurrentQuestionIndex(0);
    }
  
    setOpenText(''); // Limpiar el texto después de avanzar
  };
  const setConfirmationQuestion = () => {
    const confirmationQuestion = {
      tipo: "confirmacion",
      pregunta: "¿Está seguro de que la información guardada es correcta? Si selecciona 'No', volverá al inicio del cuestionario.",
      opciones: ["Sí", "No"]
    };
  
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { categoria: "Confirmación", preguntas: [confirmationQuestion] }
    ]);
    setCurrentCategoryIndex(questions.length); // Mueve el índice a la pregunta de confirmación
    setCurrentSubCategoryIndex(0);
    setCurrentQuestionIndex(0);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSubCategoryIndex > 0) {
      setCurrentSubCategoryIndex(currentSubCategoryIndex - 1);
      setCurrentQuestionIndex(currentQuestions.length - 1);
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      setCurrentSubCategoryIndex(subcategories.length - 1);
      setCurrentQuestionIndex(currentQuestions.length - 1);
    }
  };

  const handleViewCharts = () => {
    onEvaluationComplete(answers);
  };
  

  return (
    <div className="evaluation-container">
      <h2>{currentCategory.categoria}</h2>
      {currentSubCategory && <h3>{currentSubCategory.subcategoria}</h3>}
      <div className="question-container">
        <p>{currentQuestion.pregunta}</p>
        {currentQuestion.tipo === "si_no" ? (
          <div className="answer-button-container">
            <button
              className={`answer-button ${getSelectedAnswer() === 'Sí' ? 'selected' : ''}`}
              onClick={() => handleAnswer('Sí')}
            >
              Sí
            </button>
            <button
              className={`answer-button ${getSelectedAnswer() === 'No' ? 'selected' : ''}`}
              onClick={() => handleAnswer('No')}
            >
              No
            </button>
          </div>
        ) : currentQuestion.tipo === "opcion_multiple" ? (
          <div className="answer-button-container">
            {currentQuestion.opciones.map((opcion, index) => (
              <button
                key={index}
                className={`answer-button ${getSelectedAnswer() === opcion ? 'selected' : ''}`}
                onClick={() => handleAnswer(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            placeholder="Escriba su respuesta aquí..."
            value={openText}
            onChange={(e) => setOpenText(e.target.value)}
          />
        )}
      </div>
      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentCategoryIndex === 0 && currentSubCategoryIndex === 0 && currentQuestionIndex === 0}
        >
          Anterior
        </button>
        {isLastQuestion ? (
          <button className="view-charts-button" onClick={handleViewCharts}>
            Ver gráficos
          </button>
        ) : (
          <button onClick={proceedToNextQuestion}>
            Siguiente
          </button>
        )}
      </div>
      {/* Mostrar los datos de depuración */}
    </div>
  );
};

export default Evaluation;
