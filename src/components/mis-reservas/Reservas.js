import React, { useEffect, useState } from 'react';
import {API} from '../../config.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Reservas.css'


const Reservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch(API+'reservas/misReservas/raul@gmail.com');
        const data = await response.json();
        setReservas(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservas();
  }, []);

  return (
    <div className="card-container">
      <h2>Mis reservas son:</h2>
      <div className="row">
        {reservas.map((reserva, index) => (
          <div className="col-md-4 mb-4" key={reserva.id}>
            <div className="card border-primary mb-3 text-bg-dark mb-3">
              <div className="card-body" key={index}>
                <h3 className="card-title">{reserva.reserva.id}</h3>
                <p className="card-text">Cliente: {reserva.reserva.email_cliente}</p>
                <p className="card-text">Fecha: {new Date(reserva.reserva.fecha_reserva).toLocaleDateString('es-ES')}</p>
                <p className="card-text">Hora: {reserva.reserva.hora_reserva}</p>
                <p className="card-text">Precio: {reserva.detalles.map((detalle, detalleIndex) => (
                  <span key={detalleIndex}>
                    {detalle.precio}
                    {detalleIndex !== reserva.detalles.length - 1 && ', '}
                  </span>
          ))}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservas;
