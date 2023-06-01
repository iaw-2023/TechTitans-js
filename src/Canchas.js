import {API} from './config.js';
import React, { useEffect, useState } from 'react';
import './App.css';

const Canchas = () => {
    const [canchas, setCanchas] = useState([]);
  
    useEffect(() => {
      const fetchCanchas  = async () => {
        try {
          const response = await fetch(API+'/canchas');
          const data = await response.json();
          setCanchas(data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchCanchas();
    }, []);
  
    return (
      <div>
        <h2>Listado de Canchas</h2>
        {canchas.map(cancha => (
          <div key={cancha.id}>
            <h3>{cancha.nombre}</h3>
            <p>Precio: {cancha.precio}</p>
            <p>Superficie: {cancha.horario}</p>
            <p>Jugadores: {cancha.cant_jugadores}</p>
          </div>
        ))}
      </div>
    );
  };

export default Canchas;