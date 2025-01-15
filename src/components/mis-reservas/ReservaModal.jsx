import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReservaModal = ({ reserva, turnos, show, onClose }) => {
  if (!reserva || !turnos) return null;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal')) {
      onClose(); // Cierra el modal al hacer clic fuera del contenido
    }
  };

  return (
    <div
      className={`modal ${show ? 'show' : ''}`}
      tabIndex="-1"
      style={{
        display: show ? 'block' : 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={handleBackdropClick} // Detecta clic fuera del contenido
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Detalle de la Reserva #{reserva.id}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <h6>Información de la Reserva</h6>
            <ul>
              <li><strong>Fecha de Reserva:</strong> {reserva.fecha_reserva}</li>
              <li><strong>Hora de Reserva:</strong> {reserva.hora_reserva}</li>
              <li><strong>Email del Cliente:</strong> {reserva.email_cliente}</li>
              <li><strong>Estado:</strong> {reserva.estado}</li>
            </ul>

            <h6>Turnos Asociados</h6>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Cancha</th>
                  <th>Categoría</th>
                  <th>Superficie</th>
                  <th>Jugadores</th>
                  <th>Techada</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {turnos.map(({ turno, cancha }, index) => (
                  <tr key={index}>
                    <td>{turno.fecha_turno}</td>
                    <td>{turno.hora_turno}</td>
                    <td>{cancha.nombre}</td>
                    <td>{cancha.categoria?.nombre || 'Sin categoría'}</td>
                    <td>{cancha.superficie}</td>
                    <td>{cancha.cant_jugadores}</td>
                    <td>{cancha.techo ? 'Sí' : 'No'}</td>
                    <td>${cancha.precio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservaModal;
