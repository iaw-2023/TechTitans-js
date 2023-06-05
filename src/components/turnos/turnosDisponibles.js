import React, { useEffect, useState } from 'react';
import { API } from '../../config';
import './turnosDisponibles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col, Button, Modal } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

const TurnosDisponibles = () => {
  const [turnos, setTurnos] = useState([]);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [reservaRealizada, setReservaRealizada] = useState(false);
  const {categoriaId} = useParams();
  const [selectedFecha, setSelectedFecha] = useState(null);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        let url ;
        
        if (selectedFecha!=null) {
          url = `${API}turnos/fecha/cat/${selectedFecha}/${categoriaId}`;
        }else{
          url = `${API}turnos/dispCat/${categoriaId}`;
        }
  
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error al obtener los turnos');
        }
  
        const data = await response.json();
        setTurnos(data);
        console.log(data);
      } catch (error) {
        console.error('Error al obtener los turnos', error);
      }
    };
    fetchTurnos();
  }, [categoriaId, selectedFecha]);
  
  const handleFechaChange = (e) => {
    const value = e.target.value;
    setSelectedFecha(value  ? value : null);
  };

  const openModal = (turno) => {
    setSelectedTurno(turno);
  };

  const closeModal = () => {
    setSelectedTurno(null);
    setReservaRealizada(false);
  };

  const confirmarReserva = (turno) => {
    console.log(turno);
    setSelectedTurno(null);
    setReservaRealizada(true);
  };

  return (
    <div className="card-container" >
      <h2>Turnos Disponibles</h2>
      <div className="filter-container">
      <input
        type="date"
        value={selectedFecha || ''}
        onChange={handleFechaChange}
      />

      </div>
      <Row className="justify-content-center">
        {turnos.map((turno) => (
          <Col key={turno.id} sm={6} md={6} lg={4} xl={3}>
            <Card className="card border-primary mb-3 text-bg-dark mb-3">
              <Card.Body>
                <Card.Title>{turno.cancha.nombre}</Card.Title>
                <Card.Text>
                   Fecha: {(() => {
                    const fecha = new Date(turno.fecha_turno);
                    fecha.setDate(fecha.getDate() + 1); 
                    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                  return fecha.toLocaleDateString('es-AR', opcionesFecha);
                  })()}
                </Card.Text>
                <Card.Text>Hora: {turno.hora_turno}</Card.Text>
                <Card.Text>Precio: ${turno.cancha.precio}</Card.Text>
                <Button variant="primary" onClick={() => openModal(turno)} className="mr-2">
                  Ver Detalles
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    confirmarReserva(turno);
                  }}
                  className="mr-2"
                >
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
              <p>{selectedTurno.cancha.nombre}</p>
              <p>Fecha: {(() => {
                    const fecha = new Date(selectedTurno.fecha_turno);
                    fecha.setDate(fecha.getDate() + 1);
                    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                  return fecha.toLocaleDateString('es-AR', opcionesFecha);
                  })()}</p>
              <p>Hora: {selectedTurno.hora_turno}</p>
              <p>Precio: ${selectedTurno.cancha.precio}</p>
              <p>Superficie: {selectedTurno.cancha.superficie}</p>
              <p>Techada: {selectedTurno.cancha.techo ? 'Sí' : 'No'}</p>
              <p>Cantidad de jugadores: {selectedTurno.cancha.cant_jugadores}</p>
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
          <Link to="/carrito">
            <Button variant="primary">Ir al Carrito</Button>
          </Link>
          <Link to="/reservar">
            <Button variant="success">Seguir reservando turnos</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TurnosDisponibles;