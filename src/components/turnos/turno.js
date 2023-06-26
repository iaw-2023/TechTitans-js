import React, { useEffect, useState, useContext} from 'react';
import { API_URL } from '../../config';
import { Card, Button, Form} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { CarritoContexto } from '../context/ShoppingCartContext';


function Turno() {
  const { id } = useParams(); 
  const [turno, setTurno] = useState(null);
  
  const carritoContexto = useContext(CarritoContexto);
  const { agregarItem } = carritoContexto;

  useEffect(() => {
    obtenerTurno(id);
  }, [id]);

  const obtenerTurno = (id) => {
    let URL = `${API_URL}/turnos/${id}`; 
    fetch(URL)
      .then(respuesta => respuesta.json())
      .then(resultado => {
        setTurno(resultado);
      })
      .catch(error => console.log(error));
  }

  const handleButtonClick = () => {
    agregarItem(turno.id, turno);
    }};

  return (
    <div>
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
                  onClick={handleButtonClick}
                  className="mr-2"
                >
                  Reservar
                </Button>
              </Card.Body>
            </Card>
        </div>
    );
export default Turno;