import React, { useState,useEffect } from 'react';

import '../styles/Evaluation.css';
import { tileLayer } from 'leaflet';

const evaluationQuestions = {
  drenaje: [
    {
      categoria: "ACCESO A SERVICIOS DE EMERGENCIA",
      preguntas: [
        {
          tipo : "si_no",
          pregunta : "¿Se ha realizado una planificación específica para garantizar que los servicios de emergencia tengan un acceso rápido y eficiente al sitio de la infraestructura durante la fase de construcción?",
        },
        {
          tipo : "si_no",
          pregunta : "¿El diseño del proyecto incluye medidas para asegurar un acceso óptimo de los servicios de emergencia durante la etapa operativa, considerando factores como la ubicación estratégica de los puntos de acceso, la disponibilidad de rutas alternativas en caso de emergencia y la señalización adecuada?",
        },
        {
          tipo : "si_no",
          pregunta :"¿Se han establecido protocolos claros de coordinación entre los responsables del proyecto y los servicios de emergencia locales para garantizar una respuesta efectiva en situaciones de crisis durante la construcción y la operación del proyecto?",
        },
        {
          tipo : "si_no",
          pregunta : "¿Existe un plan de acción detallado que defina roles y responsabilidades específicas tanto para el personal del proyecto como para los servicios de emergencia en caso de eventos adversos durante todas las etapas del proyecto?",
        }
      ]
    },
    {
      categoria: "ACEPTACIÓN DE LAS PARTES INTERESADAS",
      preguntas: [
        {
          tipo : "si_no",
          pregunta : "¿Se ha realizado un análisis económico para determinar el costo total del proyecto de drenaje urbano, incluyendo construcción, mantenimiento y posibles gastos ambientales?",
        },
        {
          tipo : "si_no",
          pregunta : "¿Existen datos sobre la aceptación pública del diseño y tipo de drenaje propuesto, basados en encuestas o consultas formales?",
        },
        {
          tipo : "si_no",
          pregunta : "¿Se han realizado talleres o reuniones comunitarias específicamente relacionadas con el proyecto de drenaje urbano en el último año?",
        },
        {
          tipo : "si_no",
          pregunta : "¿Dentro del proyecto se ha asignado un presupuesto específico para la participación ciudadana en la mejora continua del sistema de drenaje urbano?",
        },
        {
          tipo : "abierta",
          pregunta : "¿Qué porcentaje de los residentes encuestados están de acuerdo con la implementación de medidas de drenaje específicas, según datos recopilados en encuestas recientes?",
        },
        {
          tipo : "abierta",
          pregunta : "¿Cuántas quejas o sugerencias relacionadas con el diseño del proyecto de sistema de drenaje urbano han sido registradas por la municipalidad ?",
        }

      ]
    }
  ],
  caminos: [
    {
      categoria: "OPINIÓN SOCIAL",
      subcategorias: [
        {
          subcategoria:"Identificación de opositores durante la formulación del proyecto",
          preguntas: [
          {
            tipo: "si_no",
            pregunta: "¿Durante la formulación del proyecto de infraestructura, se identificaron grupos o individuos que se opusieron activamente al mismo?",
          
          },
          {
            tipo: "si_no",
            pregunta: "¿La municipalidad puede confirmar si se documentaron y consideraron las opiniones de los opositores durante el proceso de formulación del proyecto?",
          }
        ]
      },
      {
        subcategoria:"Apoyo mayoritario de la población local a la construcción de la infraestructura",
        preguntas: [
          {
            tipo: "si_no",
            pregunta: "¿En la población que rodea el proyecto, la mayoría de los residentes apoyan la construcción de la infraestructura propuesta?",
          },
          {
            tipo: "si_no",
            pregunta: "¿La municipalidad cuenta con datos o encuestas que respalden la afirmación de que existe un apoyo mayoritario de la comunidad local hacia el proyecto?",
          }
        ]
      },
      {
        subcategoria:"Percepción general de las opiniones generadas sobre la infraestructura",
        preguntas: [
          {
            tipo: "opcion_multiple",
            pregunta :"¿La mayoría de las opiniones expresadas por la comunidad y otras partes interesadas sobre la infraestructura propuesta son mayoritariamente positivas o negativas?",
            opciones: ["Mayormente positiva", "Mayormente negativa"]
          },
          {
            tipo: "opcion_multiple",
            pregunta:"¿La municipalidad ha llevado a cabo alguna evaluación o encuesta de opinión para determinar la percepción general de la comunidad hacia el proyecto?",
            opciones: ["Mayormente positiva", "Mayormente negativa"]
          }
        ]
      }
        
      ]
      
    }
  ],
  pavimentacion: [
    {
      categoria: "AHORRO DE TIEMPO",
      preguntas: [
        {
          tipo: "si_no",
          pregunta: "¿Se han llevado a cabo estudios preliminares para evaluar el potencial impacto de la pavimentación urbana en el tiempo de desplazamiento de los residentes en la zona?",
        },
        {
          tipo: "si_no",
          pregunta: "¿Se ha realizado algún análisis teórico o proyecciones sobre el posible impacto en el tiempo de desplazamiento de los residentes después de la pavimentación urbana, considerando los cambios esperados en la infraestructura vial?",
        },
        {
          tipo: "si_no",
          pregunta: "¿Se han identificado posibles medidas adicionales para mejorar la movilidad en la zona durante el proceso de pavimentación urbana, como desvíos de tráfico temporales o transporte público alternativo?",
        },
        {
          tipo: "si_no",
          pregunta: "¿Se han implementado mecanismos para recopilar la retroalimentación de los residentes y partes interesadas sobre sus expectativas y preocupaciones relacionadas con la pavimentación urbana planificada?",
        }
      ]
    },
    {
      categoria: "CARACTERÍSTICAS DEL ENTORNO",
      subcategorias: [
        {
          subcategoria: "Número de locales comerciales beneficiados",
          preguntas: [
            {
              tipo: "si_no",
              pregunta: "¿Se ha realizado un censo o análisis previo para determinar el número de locales comerciales en la zona de influencia del proyecto?",
            },
            {
              tipo: "abierta",
              pregunta: "¿Cuántos locales comerciales aproximadamente se encuentran actualmente en la zona y podrían potencialmente beneficiarse de la implementación del proyecto?",
            },
            {
              tipo: "si_no",
              pregunta: "¿Se ha estimado cuántos de estos locales comerciales podrían experimentar un aumento en su clientela o ventas como resultado del proyecto?",
            }
          ]
        },
        {
          subcategoria: "Número de familias/hogares beneficiados",
          preguntas: [
            {
              tipo: "si_no",
              pregunta: "¿Existe información disponible sobre la cantidad de familias o hogares que residen en el área donde se llevará a cabo el proyecto?",
            },
            {
              tipo: "abierta",
              pregunta: "¿Cuántas familias o hogares aproximadamente se verán directamente afectados por el proyecto, ya sea de manera positiva o negativa?",
            },
            {
              tipo: "si_no",
              pregunta: "¿Se ha estimado cuántas de estas familias o hogares podrían experimentar mejoras en su calidad de vida como resultado del proyecto?",
            },
          ]
        }
      ]
    },
    {
      categoria: "CERCANIA A INFRAESTRUCTURAS PUBLICAS",
      preguntas:[
        {
          tipo: "si_no",
          pregunta: "¿Existen instalaciones críticas, como centros de salud, establecimientos educativos yservicios de emergencia, en las proximidades del área del proyecto?",
        },
        {
          tipo: "si_no",
          pregunta: "¿Se ha realizado un análisis de la distancia entre estas infraestructuras públicas y las áreas afectadas por el proyecto?",

        }
      ]
    }
  ]
};
const Evaluation = ({ onEvaluationComplete, projectType }) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentSubCategoryIndex, setCurrentSubCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [openText, setOpenText] = useState('');

  const questions = evaluationQuestions[projectType];
  const currentCategory = questions[currentCategoryIndex];
  const subcategories = currentCategory?.subcategorias || [];
  const currentSubCategory = subcategories[currentSubCategoryIndex];
  const currentQuestions = currentSubCategory ? currentSubCategory.preguntas : currentCategory?.preguntas || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    if (!updatedAnswers[currentCategoryIndex]) {
      updatedAnswers[currentCategoryIndex] = [];
    }
    if (!updatedAnswers[currentCategoryIndex][currentSubCategoryIndex]) {
      updatedAnswers[currentCategoryIndex][currentSubCategoryIndex] = [];
    }
    updatedAnswers[currentCategoryIndex][currentSubCategoryIndex][currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);

    if (currentQuestion.tipo !== 'abierta') {
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
    } else {
      onEvaluationComplete(answers);
    }
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

  const getSelectedAnswer = () => {
    if (
      answers[currentCategoryIndex] &&
      answers[currentCategoryIndex][currentSubCategoryIndex] &&
      answers[currentCategoryIndex][currentSubCategoryIndex][currentQuestionIndex]
    ) {
      return answers[currentCategoryIndex][currentSubCategoryIndex][currentQuestionIndex];
    }
    return '';
  };

  const selectedAnswer = getSelectedAnswer();

  return (
    <div className="evaluation-container">
      <h2>{currentCategory.categoria}</h2>
      {currentSubCategory && <h3>{currentSubCategory.subcategoria}</h3>}
      <div className="question-container">
        <p>{currentQuestion.pregunta}</p>
        {currentQuestion.tipo === "si_no" ? (
          <>
            <button
              className={`answer-button ${selectedAnswer === 'Sí' ? 'selected' : ''}`}
              onClick={() => handleAnswer('Sí')}
            >
              Sí
            </button>
            <button
              className={`answer-button ${selectedAnswer === 'No' ? 'selected' : ''}`}
              onClick={() => handleAnswer('No')}
            >
              No
            </button>
          </>
        ) : currentQuestion.tipo === "opcion_multiple" ? (
          <>
            {currentQuestion.opciones.map((opcion, index) => (
              <button
                key={index}
                className={`answer-button ${selectedAnswer === opcion ? 'selected' : ''}`}
                onClick={() => handleAnswer(opcion)}
              >
                {opcion}
              </button>
            ))}
          </>
        ) : (
          <>
            <textarea
              placeholder="Escriba su respuesta aquí..."
              value={openText || selectedAnswer}
              onChange={(e) => setOpenText(e.target.value)}
            />
          </>
        )}
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrevious} disabled={currentCategoryIndex === 0 && currentSubCategoryIndex === 0 && currentQuestionIndex === 0}>Anterior</button>
        <button
          onClick={() => {
            if (currentQuestion.tipo === 'abierta') {
              handleAnswer(openText);
              setOpenText('');
              proceedToNextQuestion(); // Asegura que avanza a la siguiente pregunta
            } else {
              proceedToNextQuestion();
            }
          }}
        >
          {currentCategoryIndex === questions.length - 1 && currentSubCategoryIndex === subcategories.length - 1 && currentQuestionIndex === currentQuestions.length - 1 ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};

export default Evaluation;