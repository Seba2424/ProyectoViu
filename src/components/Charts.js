import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import '../styles/charts.css'; // Asegúrate de que este archivo CSS esté importado

const Charts = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Sí', 'No'],
        datasets: [
          {
            label: 'Resultados',
            data: [2, 1], // Datos de ejemplo: 2 respuestas "Sí" y 1 respuesta "No"
            backgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="charts-container">
      <h3>OPINIÓN SOCIAL</h3>
      <h4>Identificación de opositores durante la formulación del proyecto</h4>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Charts;
