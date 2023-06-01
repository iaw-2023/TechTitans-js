import {API} from './config.js';
import React, { useEffect, useState } from 'react';
import './App.css';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);
  
    useEffect(() => {
      const fetchReservas  = async () => {
        try {
          const response = await fetch(API+'/reservas');
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
        <h2>Listado de Reservas</h2>
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