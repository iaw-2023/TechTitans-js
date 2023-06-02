import React, { useEffect, useState } from 'react';
import { API } from '../../config';

const TurnosDisponibles = () => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await fetch(API+'turnos');
        console.log(API+'turnos');
        if (!response.ok) {
          throw new Error('Error al obtener los turnos');
        }
        const data = await response.json();
        setTurnos(data);
      } catch (error) {
        console.error('Error al obtener los turnos', error);
      }
    };

    fetchTurnos();
  }, []);

  return (
    <div>
      <h1>Turnos Disponibles</h1>
      <table>
        <thead>
          <tr>
            <th>ID cancha:</th>
            <th>Fecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => (
            <tr key={turno.id}>
              <td>{turno.id_cancha}</td>
              <td>{new Date(turno.fecha_turno).toLocaleDateString('es-ES')}</td>
              <td>{turno.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TurnosDisponibles;
