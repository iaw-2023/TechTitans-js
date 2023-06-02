import {API} from './config.js';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);
      const location = useLocation();
      const email = location.pathname.split('/')[2];
    
    useEffect(() => {
      console.log(email);
      const fetchReservas  = async () => {
        try {
          const response = await fetch(API+'/reservas/misReservas/'+ email);
          const data = await response.json();
          console.log(data);
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