import React, { useState, useEffect } from 'react';
import '../styles/Evaluation.css';

const Evaluation = ({ onEvaluationComplete, projectType }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar la carga
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentSubCategoryIndex, setCurrentSubCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [openText, setOpenText] = useState('');

  // Cargar el archivo JSON según el tipo de proyecto
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/preguntas/${projectType}.json`);
        if (!response.ok) {
          throw new Error('Error al cargar el archivo JSON');
        }
        const data = await response.json();
        setQuestions(data); // Almacenar las preguntas en el estado
        setLoading(false);  // Indicar que la carga ha terminado
      } catch (error) {
        console.error('Error al cargar las preguntas:', error);
        setLoading(false); // Incluso si hay error, dejar de cargar
      }
    };
  
    fetchQuestions();
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

  // Este useEffect se asegurará de que se cargue la respuesta si es tipo abierta
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
    return <div>Cargando preguntas...</div>; // Mostrar mientras se cargan las preguntas
  }

  if (!questions.length) {
    return <div>No se encontraron preguntas</div>; // Mostrar si no hay preguntas
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
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSubCategoryIndex < subcategories.length - 1) {
      setCurrentSubCategoryIndex(currentSubCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    } else if (currentCategoryIndex < questions.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentSubCategoryIndex(0);
      setCurrentQuestionIndex(0);
    }
    setOpenText(''); // Limpiar el texto después de avanzar
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
          <>
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
          </>
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
    </div>
  );
};

export default Evaluation;
