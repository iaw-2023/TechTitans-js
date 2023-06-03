import React, { useEffect, useState } from 'react';
import {API} from '../../config.js';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch(API+'reservas/misReservas/raul@gmail.com');
        const data = await response.json();
        setReservas(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservas();
  }, []);

  return (
    <div>
      <h2>Reservas de raul@gmail.com</h2>
      {reservas.map(reserva => (
        <div key={reserva.id}>
          <h3>{reserva.id}</h3>
          <p>Cliente: {reserva.email_cliente}</p>
          <p>Fecha: {new Date(reserva.fecha_reserva).toLocaleDateString('es-ES')}</p>
          <p>Hora: {reserva.hora_reserva}</p>
        </div>
      ))}
    </div>
  );
};

export default Reservas;
