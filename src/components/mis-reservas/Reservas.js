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
        console.log(data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservas();
    console.log(reservas);
  }, []);

  return (
    <div>
      <h2>Reservas de raul@gmail.com</h2>
      {reservas.map(reserva => (
        <div key={reserva.id}>
          <h3>{reserva.reserva.id}</h3>
          <p>Cliente: {reserva.reserva.email_cliente}</p>
          <p>Fecha: {new Date(reserva.reserva.fecha_reserva).toLocaleDateString('es-ES')}</p>
          <p>Hora: {reserva.reserva.hora_reserva}</p>
        </div>
      ))}
    </div>
  );
};

export default Reservas;
