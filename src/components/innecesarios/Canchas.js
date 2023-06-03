import {API} from '../../config.js';
import React, { useEffect, useState } from 'react';

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
            <p>Categoria: {cancha.id_categoria}</p>
            <p>Precio: {cancha.precio}</p>
            <p>Superficie: {cancha.superficie}</p>
            <p>Jugadores: {cancha.cant_jugadores}</p>
            <p>Techo: {cancha.techo ? 'Si' : 'No'}</p>
          </div>
        ))}
      </div>
    );
  };

export default Canchas;