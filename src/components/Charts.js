import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import '../styles/charts.css';

const Charts = ({ answers, categories, subcategories }) => {
  const chartRefs = useRef([]);
  const chartInstances = useRef([]);

  useEffect(() => {
    console.log('Respuestas recibidas en Charts:', answers);

    // Limpiar las instancias de gráficos previas
    chartInstances.current.forEach((instance) => {
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    });

    // Reiniciar la lista de instancias de gráficos
    chartInstances.current = [];

    // Crear nuevos gráficos
    answers.forEach((categoryAnswers, categoryIndex) => {
      categoryAnswers.forEach((subcategoryAnswers, subcategoryIndex) => {
        const canvasElement = chartRefs.current[categoryIndex]?.[subcategoryIndex];

        if (canvasElement) {
          const ctx = canvasElement.getContext('2d');
          const newChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Sí', 'No'],
              datasets: [
                {
                  label: 'Resultados',
                  data: [
                    subcategoryAnswers.filter((answer) => answer === 'Sí').length,
                    subcategoryAnswers.filter((answer) => answer === 'No').length,
                  ],
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
    });

    // Cleanup para destruir los gráficos al desmontar el componente
    return () => {
      chartInstances.current.forEach((instance) => {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      });
    };
  }, [answers, categories, subcategories]);

  if (!answers || answers.length === 0) {
    return <div>No se encontraron respuestas para generar gráficos.</div>;
  }

  return (
    <div className="charts-container">
      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="chart-category">
          <h3>{category}</h3>
          {subcategories[categoryIndex].map((subcategory, subcategoryIndex) => (
            <div key={subcategoryIndex} className="chart-item">
              <h4>{subcategory}</h4>
              <canvas
                ref={(el) => {
                  if (!chartRefs.current[categoryIndex]) {
                    chartRefs.current[categoryIndex] = [];
                  }
                  chartRefs.current[categoryIndex][subcategoryIndex] = el;
                }}
              ></canvas>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Charts;
