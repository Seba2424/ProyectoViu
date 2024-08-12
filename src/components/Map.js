import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import Evaluation from './Evaluation';
import '../styles/map.css';

const Map = ({ projectData, onStartEvaluation, isEvaluating, onEvaluationComplete, projectType }) => {
  const mapRef = useRef(null);
  const miniMapRef = useRef(null);
  const [streetInfo, setStreetInfo] = useState('');
  const [distanceInfo, setDistanceInfo] = useState('');

  const locations = {
    'Temuco': [-38.7322, -72.6004],
    'Gorbea': [-39.1034, -72.6728],
    'Teodoro Schmidt': [-38.9970, -73.0857],
    'Perquenco': [-38.4268, -72.3734],
    'Los Sauces': [-37.9825, -72.8374]
  };

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map('map').setView(locations[projectData.ubicacion] || locations['Temuco'], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      const drawControl = new L.Control.Draw({
        draw: {
          polyline: true,
          polygon: false,
          circle: false,
          rectangle: false,
          marker: true,
        },
        edit: false
      });

      mapRef.current.addControl(drawControl);

      mapRef.current.on('draw:created', function (e) {
        const layer = e.layer;
        mapRef.current.addLayer(layer);
        layer.setStyle({ color: '#000', weight: 5 });

        if (layer instanceof L.Polyline) {
          const latlngs = layer.getLatLngs();
          let distance = 0;
          const speed = 5; // asumiendo velocidad de 5 km/h

          for (let i = 0; i < latlngs.length - 1; i++) {
            distance += latlngs[i].distanceTo(latlngs[i + 1]);
          }

          const time = distance / (speed * 1000); // tiempo en horas
          distance = (distance / 1000).toFixed(2); // distancia en km
          const timeFixed = time.toFixed(2); // tiempo en horas

          const startLatLng = latlngs[0];
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${startLatLng.lat}&lon=${startLatLng.lng}`)
            .then(response => response.json())
            .then(data => {
              const address = data.display_name;
              setStreetInfo(`Calle: ${address}`);
              setDistanceInfo(`Distancia: ${distance} km | Tiempo: ${timeFixed} h`);
            })
            .catch(error => {
              console.error('Error al obtener la dirección:', error);
            });
        }
      });
    } else {
      mapRef.current.setView(locations[projectData.ubicacion] || locations['Temuco'], 14);
    }
  }, [projectData.ubicacion]);

  return (
    <div className="map-container">
      <div className="project-info">
        <h2>Información del Proyecto</h2>
        <p><strong>Tipo de proyecto:</strong> {projectType}</p>
        <p><strong>Nombre del proyecto:</strong> {projectData.nombre}</p>
        <p><strong>Ubicación:</strong> {projectData.ubicacion}</p>
        <p><strong>Comuna:</strong> {projectData.comuna}</p>
        <p><strong>Plazo:</strong> {projectData.plazo} días</p>
        <p><strong>Monto de inversión:</strong> {projectData.inversion}</p>
        <p><strong>Justificación del proyecto:</strong> {projectData.justificacion}</p>
        {streetInfo && <p><strong>Información de la calle:</strong> {streetInfo}</p>}
        {distanceInfo && <p><strong>Distancia y Tiempo:</strong> {distanceInfo}</p>}
        <button className="start-evaluation-button" onClick={onStartEvaluation}>INICIO DE EVALUACIÓN</button>
      </div>
  
      <div id="map"></div>
  
      {isEvaluating && (
        <div id="evaluation-container">
          <Evaluation 
            projectType={projectType} 
            onEvaluationComplete={onEvaluationComplete} 
          />
        </div>
      )}
    </div>
  );
};

export default Map;
