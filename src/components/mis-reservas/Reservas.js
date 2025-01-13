import React, { useEffect, useState } from 'react';
import { API } from '../../config.js';
import { useAuth0 } from '@auth0/auth0-react'; // Usar Auth0 para autenticación
import 'bootstrap/dist/css/bootstrap.min.css';
import './Reservas.css';

const Reservas = () => {
  const { isAuthenticated, user } = useAuth0(); // Obtener estado de autenticación y usuario
  const [reservas, setReservas] = useState([]);
  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchReservas(user.email);
    }
  }, [isAuthenticated, user]);

  const fetchReservas = async (email) => {
    try {
      setAlert('');
      const response = await fetch(`${API}reservas/misReservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_cliente: email }),
      });

      if (!response.ok) {
        throw new Error('No se encontraron reservas para este cliente');
      }

      const data = await response.json();
      setReservas(data);
    } catch (error) {
      console.error(error);
      setAlert(error.message);
      setReservas([]);

      setTimeout(() => {
        setAlert('');
      }, 3000);
    }
  };

  return (
    <div className="card-container">
      {alert && (
        <div className="alert alert-danger" role="alert">
          {alert}
        </div>
      )}
      <div className="row">
        {reservas.map((reserva, index) => (
          <div className="col-md-4 mb-4" key={reserva.reserva.id}>
            <div className="card border-primary mb-3 text-bg-dark mb-3">
              <div className="card-body" key={index}>
                <h3 className="card-title">Reserva ID: {reserva.reserva.id}</h3>
                <p className="card-text">Cliente: {reserva.reserva.email_cliente}</p>
                <p className="card-text">
                  Fecha: {new Date(reserva.reserva.fecha_reserva).toLocaleDateString('es-AR')}
                </p>
                <p className="card-text">Hora: {reserva.reserva.hora_reserva}</p>
                <p className="card-text">
                  Detalles:
                  {reserva.detalle.map((detalle, detalleIndex) => (
                    <span key={detalleIndex}>
                      <br />
                      Turno ID: {detalle.id_turno}, Precio: {detalle.precio}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservas;
