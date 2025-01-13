import React from 'react';
import Modal from 'react-bootstrap/Modal';

const ReservaModal = ({ show, onHide, reserva, detalle }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalle de la Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Reserva</h5>
        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Email</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{reserva.id}</td>
              <td>{reserva.fecha_reserva}</td>
              <td>{reserva.hora_reserva}</td>
              <td>{reserva.email_cliente}</td>
              <td>{reserva.estado}</td>
            </tr>
          </tbody>
        </table>
        <h5>Turnos Asociados</h5>
        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Categoria</th>
              <th>Cancha</th>
              <th>Superficie</th>
              <th>Cant. Jugadores</th>
              <th>Techada</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {detalle.map((turno, index) => (
              <tr key={index}>
                <td>{turno.fecha_turno}</td>
                <td>{turno.hora_turno}</td>
                <td>{turno.cancha.categoria.nombre}</td>
                <td>{turno.cancha.nombre}</td>
                <td>{turno.cancha.superficie}</td>
                <td>{turno.cancha.cant_jugadores}</td>
                <td>{turno.cancha.techo ? 'Sí' : 'No'}</td>
                <td>${turno.cancha.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
    </Modal>
  );
};

export default ReservaModal;
