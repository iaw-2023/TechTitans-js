import React, { useState } from 'react';

const Carrito = () => {
  const [turnos, setTurnos] = useState([]);

  const agregarTurno = (turno) => {
    setTurnos([...turnos, turno]);
  };

  const eliminarTurno = (id) => {
    const nuevosTurnos = turnos.filter((turno) => turno.id !== id);
    setTurnos(nuevosTurnos);
  };

  const vaciarCarrito = () => {
    setTurnos([]);
  };

  return (
    <div>
      <h1>Carrito de Compras</h1>
      {turnos.length === 0 ? (
        <p>No hay turnos en el carrito</p>
      ) : (
        <ul>
          {turnos.map((turno) => (
            <li key={turno.id}>
              <p>ID Cancha: {turno.id_cancha}</p>
              <p>Fecha: {new Date(turno.fecha_turno).toLocaleDateString('es-ES')}</p>
              <p>Hora: {turno.hora_turno}</p>
              <button onClick={() => eliminarTurno(turno.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={vaciarCarrito}>Vaciar Carrito</button>
    </div>
  );
};

export default Carrito;