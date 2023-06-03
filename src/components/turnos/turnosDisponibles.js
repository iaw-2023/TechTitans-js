import React, { useEffect, useState } from 'react';
import { API } from '../../config';
import './turnosDisponibles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const TurnosDisponibles = () => {
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [reservaRealizada, setReservaRealizada] = useState(false);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await fetch(API + 'turnos/Futbol');
        if (!response.ok) {
          throw new Error('Error al obtener los turnos');
        }
        const data = await response.json();
        setTurnos(data);
      } catch (error) {
        console.error('Error al obtener los turnos', error);
      }
    };

    fetchTurnos();
  }, []);

  const openModal = (turno) => {
    setSelectedTurno(turno);
  };

  const closeModal = () => {
    setSelectedTurno(null);
    setReservaRealizada(false);
  };

  const confirmarReserva = () => {
    setReservaRealizada(true);
  };

  return (
    <div className="card-container">
      <h1>Turnos Disponibles</h1>
      <Row>
        {turnos.map((turno) => (
          <Col key={turno.id} sm={6} md={6} lg={4} xl={3}>
            <Card className="card border-primary mb-3 text-bg-dark mb-3">
              <Card.Body>
                <Card.Title>ID Cancha: {turno.id_cancha}</Card.Title>
                <Card.Text>
                  Fecha: {new Date(turno.fecha_turno).toLocaleDateString('es-ES')}
                </Card.Text>
                <Card.Text>Hora: {turno.hora_turno}</Card.Text>
                <Button variant="primary" onClick={() => openModal(turno)} className="mr-2">
                  Ver Detalles
                </Button>
                <Button variant="success" onClick={confirmarReserva}>
                  Reservar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={selectedTurno !== null} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTurno && (
            <div>
              <p>ID Cancha: {selectedTurno.id_cancha}</p>
              <p>Fecha: {new Date(selectedTurno.fecha_turno).toLocaleDateString('es-ES')}</p>
              <p>Hora: {selectedTurno.hora_turno}</p>
              {/* Otros detalles del turno */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={reservaRealizada} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>¡Tomamos Nota!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tu reserva se encuentra en el carrito.</p>
          {/* Otros detalles de la reserva */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Ir al Carrito</Button>
          <Button variant="success">Seguir reservando turnos</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TurnosDisponibles;
