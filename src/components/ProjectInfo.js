// ProjectInfo.js
import React from 'react';
import '../styles/ProjectInfo.css';

const ProjectInfo = ({ project, streetInfo, onStartEvaluation }) => {
    return (
        <div className="project-info">
            <h2>Información del Proyecto</h2>
            <p><strong>Nombre del proyecto:</strong> {project.name}</p>
            <p><strong>Ubicación:</strong> {project.location}</p>
            <p><strong>Comuna:</strong> {project.comuna}</p>
            <p><strong>Plazo:</strong> {project.plazo} días</p>
            <p><strong>Monto de inversión:</strong> {project.monto}</p>
            <p><strong>Justificación del proyecto:</strong> {project.justificacion}</p>
            <p><strong>Información de la calle:</strong> {streetInfo}</p>
            <p><strong>Distancia y Tiempo:</strong> Distancia: {project.distance} km | Tiempo: {project.time} h</p>
            <button className="start-evaluation-button" onClick={onStartEvaluation}>INICIO DE EVALUACIÓN</button>
        </div>
    );
};

export default ProjectInfo;
