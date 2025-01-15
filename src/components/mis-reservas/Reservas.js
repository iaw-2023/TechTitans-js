import React, { useState, useEffect } from 'react';
import { API } from '../../config.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Reservas.css';
import { useAuth0 } from '@auth0/auth0-react';
import ReservaModal from './ReservaModal';
import ConfirmCancelModal from './ConfirmCancelModal'; // Importa el nuevo modal

const Reservas = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [reservas, setReservas] = useState([]);
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carga
  const [modalData, setModalData] = useState(null); // Datos para el modal de detalles
  const [showModal, setShowModal] = useState(false);
  const [cancelModalData, setCancelModalData] = useState(null); // Reserva a cancelar
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect(); // Redirige al inicio de sesión si no está autenticado
      return;
    }
    if (user?.email) {
      fetchReservas(user.email);
    }
  }, [isAuthenticated, user]);

  const fetchReservas = async (email) => {
    setLoading(true); // Activa el estado de carga
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
          setReservas([]);
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
    } finally {
      setLoading(false); // Desactiva el estado de carga
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
      fetchReservas(user.email); // Actualiza el estado con el backend
      setTimeout(() => setAlert(''), 3000);
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      setAlert('Error al cancelar la reserva');
      setTimeout(() => setAlert(''), 3000);
    }
  };

  const confirmarCancelacion = (reserva) => {
    if (reserva.estado === 'Aceptado') {
      setCancelModalData(reserva); // Configura los datos para el modal
      setShowCancelModal(true); // Muestra el modal
    } else {
      cancelarReserva(reserva.id);
    }
  };

  const handleCancelConfirmation = () => {
    if (cancelModalData) {
      cancelarReserva(cancelModalData.id);
      setShowCancelModal(false); // Cierra el modal después de cancelar
    }
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

  const handleShowModal = (reserva) => {
    setModalData(reserva);
    setShowModal(true);
  };
  
  return (
    <div className="card-container">
      <h1>Mis Reservas</h1>
      {alert && (
        <div className="alert alert-info" role="alert">
          {alert}
        </div>
      )}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : reservas.length === 0 ? (
        <div className="alert alert-primary" role="alert">
          No tienes reservas registradas.
        </div>
      ) : (
        <div className="row">
          {reservas.map((reserva) => (
            <div className="col-md-4 mb-4" key={reserva.reserva.id}>
              <div className="card border-primary mb-3 text-bg-dark mb-3">
                <div className="card-body">
                  <h3 className="card-title">Orden de Reserva # {reserva.reserva.id}</h3>
                  <p className="card-text">
                    Fecha: {reserva.reserva.fecha_reserva}
                  </p>
                  <p className="card-text">
                    Precio Total: ${reserva.detalle.reduce((total, item) => total + parseFloat(item.precio), 0)}
                  </p>
                  <p className="card-text">
                    Estado:{' '}
                    <span className={getBadgeClass(reserva.reserva.estado)}>
                      {reserva.reserva.estado}
                    </span>
                  </p>
                  <button className="btn btn-info" onClick={() => handleShowModal(reserva)}>
                    Detalles
                  </button>
                  {reserva.reserva.estado !== 'Cancelado' && (
                    <button
                      className="btn btn-danger ms-2"
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
      {modalData && (
        <ReservaModal
          show={showModal}
          onClose={() => setShowModal(false)}
          reserva={modalData.reserva}
          turnos={modalData.turnos}
        />
      )}
      <ConfirmCancelModal
        show={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirmation}
      />
    </div>
  );
};

export default Reservas;
