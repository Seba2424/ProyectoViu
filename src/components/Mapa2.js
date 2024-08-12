import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const Mapa = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current !== null) return; // Detener si el mapa ya está inicializado

    mapRef.current = L.map('map').setView([-38.7526, -72.6019], 10);

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

    let deleteMode = false;

    document.getElementById('select-location').addEventListener('change', function (e) {
      const coords = e.target.value.split(",");
      mapRef.current.flyTo(coords, 14);
    });

    document.getElementById('draw-toggle').addEventListener('click', function () {
      if (mapRef.current.hasLayer(drawControl)) {
        mapRef.current.removeControl(drawControl);
      } else {
        mapRef.current.addControl(drawControl);
      }
    });

    document.getElementById('delete-toggle').addEventListener('click', function () {
      toggleDeleteMode();
    });

    mapRef.current.on('draw:created', function (e) {
      const layer = e.layer;
      mapRef.current.addLayer(layer);
      layer.setStyle({ color: '#000', weight: 5 });

      if (layer instanceof L.Polyline) {
        const latlngs = layer.getLatLngs();
        let distance = 0;
        const speed = 5;

        for (let i = 0; i < latlngs.length - 1; i++) {
          distance += latlngs[i].distanceTo(latlngs[i + 1]);
        }

        const time = distance / (speed * 1000);
        distance = distance.toFixed(2);
        const timeFixed = time.toFixed(2);

        const startLatLng = latlngs[0];
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${startLatLng.lat}&lon=${startLatLng.lng}`)
          .then(response => response.json())
          .then(data => {
            const address = data.display_name;
            const popup = L.popup()
              .setLatLng(startLatLng)
              .setContent(`Distancia: ${distance} m<br>Tiempo: ${timeFixed} h<br>Calle: ${address}`)
              .openOn(mapRef.current);

            document.getElementById('distance').innerText = `Distancia total: ${distance} km\nTiempo: ${timeFixed} h\nCalle: ${address}`;
          })
          .catch(error => {
            console.error('Error al obtener la dirección:', error);
          });

        document.getElementById('back').style.display = 'block';
        document.getElementById('done').style.display = 'block';
      }

      layer.on('click', function () {
        if (deleteMode) {
          mapRef.current.removeLayer(layer);
        }
      });
    });

    mapRef.current.on('click', function (e) {
      if (deleteMode) {
        mapRef.current.eachLayer(function (layer) {
          if (layer instanceof L.Marker) {
            if (layer.getLatLng().equals(e.latlng)) {
              mapRef.current.removeLayer(layer);
            }
          }
        });
      }
    });

    function toggleDeleteMode() {
      deleteMode = !deleteMode;
    }

    document.getElementById('done').addEventListener('click', function () {
      document.getElementById('overlay').style.display = 'block';
    });

    document.getElementById('back').addEventListener('click', function () {
      document.getElementById('overlay').style.display = 'none';
    });

    document.getElementById('close').addEventListener('click', function () {
      document.getElementById('overlay').style.display = 'none';
    });

    document.getElementById('back').style.display = 'none';
    document.getElementById('done').style.display = 'none';

    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
      button.addEventListener('click', function () {
        const category = this.dataset.category;
        const allQuestions = document.querySelectorAll('.category-questions');
        allQuestions.forEach(questions => {
          questions.style.display = 'none';
        });
        document.getElementById(`${category}-questions`).style.display = 'block';
      });
    });

    return () => {
      if (mapRef.current !== null) {
        mapRef.current.remove(); // Destruye el mapa cuando el componente se desmonta
        mapRef.current = null; // Reinicia la referencia del mapa
      }
    };
  }, []);

  return (
    <div>
      <h1>La Araucania</h1>
      <select name="select-location" id="select-location">
        <option value="-1">Seleccione un lugar</option>
        <option value="-38.7322,-72.6004">Temuco</option>
        <option value="-39.1034,-72.6728">Gorbea</option>
        <option value="-38.9970,-73.0857">Teodoro Schmidt</option>
        <option value="-38.4268,-72.3734">Perquenco</option>
        <option value="-37.9825,-72.8374">Los Sauces</option>
      </select>
      <button id="draw-toggle">Activar Dibujo</button>
      <button id="delete-toggle">Activar Borrado</button>
      <div id="map" style={{ height: '90vh', width: '100vw' }}></div>
      <div id="overlay">
        <div id="questions">
          <h2>Categorías:</h2>
          <button className="category-button" data-category="time-saving">AHORRO DE TIEMPO</button>
          <button className="category-button" data-category="public-infrastructure">CERCANÍA A INFRAESTRUCTURAS PÚBLICAS</button>
          <div id="time-saving-questions" className="category-questions" style={{ display: 'none' }}>
            <h3>AHORRO DE TIEMPO</h3>
            <p>1. ¿Se han llevado a cabo estudios preliminares para evaluar el potencial impacto de la pavimentación urbana en el tiempo de desplazamiento de los residentes en la zona?</p>
            <p>2. ¿Se ha realizado algún análisis teórico o proyecciones sobre el posible impacto en el tiempo de desplazamiento de los residentes después de la pavimentación urbana, considerando los cambios esperados en la infraestructura vial?</p>
            <p>3. ¿Se han identificado posibles medidas adicionales para mejorar la movilidad en la zona durante el proceso de pavimentación urbana, como desvíos de tráfico temporales o transporte público alternativo?</p>
            <p>4. ¿Se han implementado mecanismos para recopilar la retroalimentación de los residentes y partes interesadas sobre sus expectativas y preocupaciones relacionadas con la pavimentación urbana planificada?</p>
          </div>
          <div id="public-infrastructure-questions" className="category-questions" style={{ display: 'none' }}>
            <h3>CERCANÍA A INFRAESTRUCTURAS PÚBLICAS</h3>
            <p>1. ¿Existen instalaciones críticas, como centros de salud, establecimientos educativos y servicios de emergencia, en las proximidades del área del proyecto?</p>
            <p>2. ¿Se ha realizado un análisis de la distancia entre estas infraestructuras públicas y las áreas afectadas por el proyecto?</p>
            <p>3. ¿Se ha considerado la accesibilidad peatonal y vehicular a estas infraestructuras públicas desde las vías o áreas del proyecto?</p>
            <p>4. ¿Se ha evaluado cómo la ubicación estratégica del proyecto en relación con estas infraestructuras públicas podría beneficiar a la comunidad local en términos de acceso a servicios esenciales?</p>
            <p>5. ¿Se ha consultado a la comunidad local sobre la importancia de la cercanía a estas infraestructuras públicas en el diseño y planificación del proyecto urbano?</p>
          </div>
          <button id="close">Cerrar</button>
          <p id="distance"></p>
        </div>
      </div>
      <button id="back">Volver al Mapa</button>
      <button id="done">LISTO¡</button>
    </div>
  );
};

export default Mapa;
