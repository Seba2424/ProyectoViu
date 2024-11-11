import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import '../styles/charts.css';

const Charts = ({ answers, categories }) => {
  const chartRefs = useRef([]);
  const chartInstances = useRef([]);

  // Función para agrupar las respuestas por categoría
  const groupAnswersByCategory = () => {
    return categories.map((category, categoryIndex) => {
      let siCount = 0;
      let noCount = 0;

      if (answers[categoryIndex]) {
        answers[categoryIndex].forEach((subcategoryAnswers) => {
          siCount += subcategoryAnswers.filter((answer) => answer === 'Sí').length;
          noCount += subcategoryAnswers.filter((answer) => answer === 'No').length;
        });
      }

      return { category, siCount, noCount };
    });
  };

  useEffect(() => {
    console.log('Respuestas agrupadas por categoría:', answers);

    chartInstances.current.forEach((instance) => {
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    });

    chartInstances.current = [];
    const groupedData = groupAnswersByCategory();

    groupedData.forEach((data, index) => {
      const canvasElement = chartRefs.current[index];

      if (canvasElement) {
        const ctx = canvasElement.getContext('2d');
        const newChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Sí', 'No'],
            datasets: [
              {
                label: 'Resultados',
                data: [data.siCount, data.noCount],
                backgroundColor: ['#36A2EB', '#FF6384'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
        chartInstances.current.push(newChart);
      }
    });

    return () => {
      chartInstances.current.forEach((instance) => {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      });
    };
  }, [answers, categories]);

  if (!answers || answers.length === 0) {
    return <div>No se encontraron respuestas para generar gráficos.</div>;
  }

  return (
    <div className="charts-container">
      <video autoPlay muted loop id="background-video">
        <source src="/images/VideoFondo.mp4" type="video/mp4" />
      </video>
      {categories.map((category, index) => (
        <div key={index} className="chart-category">
          <h3>{category}</h3>
          <canvas
            ref={(el) => {
              chartRefs.current[index] = el;
            }}
          ></canvas>
          <div className="chart-data-summary">
            <span style={{ color: '#36A2EB', fontWeight: 'bold' }}>Sí: {groupAnswersByCategory()[index].siCount}</span> |{' '}
            <span style={{ color: '#FF6384', fontWeight: 'bold' }}>No: {groupAnswersByCategory()[index].noCount}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Charts;