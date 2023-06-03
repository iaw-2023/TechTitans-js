import React, { useState } from 'react';

const Carrito = () => {
  const [turnos, setTurnos] = useState([]);

  // Agrega un turno al carrito
  const agregarTurno = (turno) => {
    setTurnos([...turnos, turno]);
  };

  // Elimina un turno del carrito
  const eliminarTurno = (turnoId) => {
    const nuevosTurnos = turnos.filter((turno) => turno.id !== turnoId);
    setTurnos(nuevosTurnos);
  };

  // Vacía el carrito
  const vaciarCarrito = () => {
    setTurnos([]);
  };

  return (
    <div>
      <h1>Carrito</h1>
      {turnos.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul>
          {turnos.map((turno) => (
            <li key={turno.id}>
              {turno.id} - {turno.fecha} - {turno.hora}
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
