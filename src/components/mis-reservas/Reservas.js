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
        if (response.status === 404) {
          setReservas([]); // No es un error, simplemente no hay reservas
          return;
        }
        throw new Error('Error al obtener las reservas');
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

  const confirmarCancelacion = (reserva) => {
    if (reserva.estado === 'Aceptado') {
      const confirmacion = window.confirm(
        'Lamentablemente no podemos devolverte el dinero. ¿Está seguro de que desea cancelarla?'
      );
      if (!confirmacion) return;
    }

    cancelarReserva(reserva.id);
  };

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'badge bg-warning';
      case 'Aceptado':
        return 'badge bg-success';
      case 'Cancelado':
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
      {reservas.length === 0 ? (
        <div className="alert alert-primary" role="alert">
          No tienes reservas registradas.
        </div>
      ) : (
        <div className="row">
          {reservas.map((reserva) => (
            <div className="col-md-4 mb-4" key={reserva.reserva.id}>
              <div className="card border-primary mb-3 text-bg-dark mb-3">
                <div className="card-body">
                  <h3 className="card-title">Orden de Reserva n°{reserva.reserva.id}</h3>
                  <p className="card-text">
                    Fecha en la que reservaste: {new Date(reserva.reserva.fecha_reserva).toLocaleDateString('es-AR')}
                  </p>
                  <p className="card-text">Hora: {reserva.reserva.hora_reserva}</p>
                  <p className="card-text">
                    Precio Total: $
                    {reserva.detalle.reduce((total, item) => total + parseFloat(item.precio), 0)}
                  </p>
                  <p className="card-text">
                    Estado:{' '}
                    <span className={getBadgeClass(reserva.reserva.estado)}>
                      {reserva.reserva.estado}
                    </span>
                  </p>
                  {reserva.reserva.estado !== 'Cancelado' && (
                    <button
                      className="btn btn-danger"
                      onClick={() => confirmarCancelacion(reserva.reserva)}
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservas;
