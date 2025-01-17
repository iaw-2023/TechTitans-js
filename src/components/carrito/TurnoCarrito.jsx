import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

const TurnoCarrito = ({ turno, index, confirmarEliminarElemento}) => {
    const [selectedTurno, setSelectedTurno] = useState(null);
    console.log("Turno recibido en TurnoCarrito:", turno);
    const { turno_id, fecha_turno, hora_turno, cancha } = turno;
    
    const openModal = (turno) => {
        setSelectedTurno(turno);
      };
    
      const closeModal = () => {
        setSelectedTurno(null);
      };
    
    return (
        <div classname= "card-info-container" style={{padding: '5vh'}}>
            <Card className="card border-primary mb-3 text-bg-dark mb-3" >
              <Card.Body>
                <Card.Title>{cancha.nombre}</Card.Title>
                  <Card.Text>
                    Fecha: {(() => {
                      const fecha = new Date(fecha_turno);
                      fecha.setDate(fecha.getDate() + 1); 
                      const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                      return fecha.toLocaleDateString('es-AR', opcionesFecha);
                    })()}
                  </Card.Text>
                  <Card.Text>Hora: {hora_turno}</Card.Text>
                  <Card.Text>Precio: ${cancha.precio}</Card.Text>
                  <Button variant="primary" onClick={() => openModal(turno)} className="mr-2">
                    Ver Detalles
                  </Button>
                  <button type="button" class="btn btn-danger" onClick={confirmarEliminarElemento}>
                    Borrar turno</button>
              </Card.Body>
            </Card>
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
    </div>
    );
    };
      
export default TurnoCarrito;