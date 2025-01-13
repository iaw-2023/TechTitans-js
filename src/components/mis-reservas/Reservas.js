import React, { useState, useEffect } from 'react';
import { API } from '../../config.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Reservas.css';
import { useAuth0 } from '@auth0/auth0-react';

const Reservas = () => {
  const { user } = useAuth0();
  const [reservas, setReservas] = useState([]);
  const [alert, setAlert] = useState('');

  useEffect(() => {
    if (user?.email) {
      fetchReservas(user.email);
    }
  }, [user]);

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
      console.error('Error al obtener reservas:', error);
      setAlert(error.message);

      setTimeout(() => {
        setAlert('');
      }, 3000);
    }
  };

  const cancelarReserva = async (idReserva) => {
    try {
      const response = await fetch(`${API}reservas/cancelar/${idReserva}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la reserva');
      }

      setAlert('Reserva cancelada exitosamente');
      fetchReservas(user.email); // Sincronizar estado con el backend
      setTimeout(() => setAlert(''), 3000);
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      setAlert('Error al cancelar la reserva');
      setTimeout(() => setAlert(''), 3000);
    }
  };

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'badge bg-warning';
      case 'Aceptado':
        return 'badge bg-success';
      case 'Cancelada':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  return (
    <div className="card-container">
      <h1>Mis Reservas</h1>
      {alert && (
        <div className="alert alert-info" role="alert">
          {alert}
        </div>
      )}
      <div className="row">
        {reservas.map((reserva) => (
          <div className="col-md-4 mb-4" key={reserva.reserva.id}>
            <div className="card border-primary mb-3 text-bg-dark mb-3">
              <div className="card-body">
                <h3 className="card-title">Reserva #{reserva.reserva.id}</h3>
                <p className="card-text">Cliente: {reserva.reserva.email_cliente}</p>
                <p className="card-text">
                  Fecha: {new Date(reserva.reserva.fecha_reserva).toLocaleDateString('es-AR')}
                </p>
                <p className="card-text">Hora: {reserva.reserva.hora_reserva}</p>
                <p className="card-text">
                  Precio:{' '}
                  {reserva.detalle.map((detalle, index) => (
                    <span key={index}>{detalle.precio}</span>
                  ))}
                </p>
                <p className="card-text">
                  Estado:{' '}
                  <span className={getBadgeClass(reserva.reserva.estado)}>
                    {reserva.reserva.estado}
                  </span>
                </p>
                {reserva.reserva.estado !== 'Cancelada' && (
                  <button
                    className="btn btn-danger"
                    onClick={() => cancelarReserva(reserva.reserva.id)}
                  >
                    Cancelar Reserva
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservas;
