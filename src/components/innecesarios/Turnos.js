import {API} from './config.js';
import React, { useEffect, useState } from 'react';

const Turnos = () => {
    const [turnos, setTurnos] = useState([]);
    
    useEffect(() => {
      const fetchTurnos  = async () => {
        try {
          const response = await fetch(API+'/turnos');
          const data = await response.json();
          setTurnos(data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchTurnos();
      console.log(turnos);
    }, []);
  
    return (
      <div>
        <h2>Listado de Turnos</h2>
        {turnos.map(turno =>
        (
          <div key={turno.id}>
            <h3>ID Turno:{turno.id}</h3>
            <p>ID cancha: {turno.id_cancha}</p>
            <p>Fecha: {new Date(turno.fecha_turno).toLocaleDateString('es-ES')}</p>
            <p>Hora: {turno.hora_turno}</p>
          </div>
        ))}
      </div>
    );
  };

export default Turnos;