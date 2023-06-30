import React, { useContext, useState, useEffect, useCallback } from 'react';
import { API } from '../../config.js';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import BotonVaciar from '../botones/BotonVaciar';
import BotonComprarCarrito from '../botones/BotonComprarCarrito';
import { CarritoContexto } from '../../context/ShoppingCartContext';
import TurnoCarrito from './TurnoCarrito';
import Swal from 'sweetalert2';
import './CarritoReservas.css';
import {Row, Col} from 'react-bootstrap';

const CarritoReservas = () => {
  const { vaciarCarrito, carrito, eliminarElemento } = useContext(CarritoContexto);
  const [turnosCarrito, setTurnosCarrito] = useState([]);
  const [email, setEmail] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [turnoAEliminar, setTurnoAEliminar] = useState(null);

  const mostrarModalCliente = () => {
    setMostrarModal(true);
  };

  const seleccionarCliente = () => {
    if (email === '') {
      Swal.fire({
        icon: 'info',
        title: 'Ingrese un email válido.',
        showConfirmButton: true,
      });
      return;
    }
    setMostrarModal(false);
    comprarCarrito();
  };

  const obtenerTurnos = useCallback(async () => {
    const URL = `${API}turnos/`;
    const posiblesTurnos = carrito.map((turno) => {
      console.log(turno)
      const turnoId = turno.id;
      const turnoURL = URL+ turnoId;
      console.log("link de posibles turnos a agregar en carrito", turnoURL)
      return fetch(turnoURL).then((respuesta) => respuesta.json());
    });

    try {
      const turnos = await Promise.all(posiblesTurnos);
      setTurnosCarrito(turnos);
    } catch (error) {
      console.log(error);
    }
  }, [carrito]);

  const obtenerPrecio = () => {
    let precioTotal = 0;
    turnosCarrito.forEach((turno) => {
      console.log("primero",turno.cancha.precio)
      const subtotal = parseInt(turno.cancha.precio);
      precioTotal += subtotal;
      console.log("total",precioTotal)
    });

    return precioTotal.toFixed(2);
  };

  const confirmarEliminarElemento = (index) => {
    eliminarElemento(index);
    setMostrarConfirmacionEliminar(false);
  };

  const comprarCarrito = () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No ha agregado ningún turno al carrito.',
        showConfirmButton: true,
      });
      return;
    }

    const detalles = carrito.map((item) => ({
      id_turno: item.turno,
    }));

    const body = JSON.stringify({
      email_cliente: email,
      turnos: detalles,
      precio_total: parseInt(obtenerPrecio())
    });

      
    console.log(body);
    fetch(`${API}reservas/alta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error al realizar la compra');
        }
      })
      .then((data) => {
        Swal.fire({
          icon: 'success',
          title: '¡Reserva realizada correctamente!',
          showConfirmButton: false,
          timer: 2000,
        });
        vaciarCarrito();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al realizar la reserva.',
          showConfirmButton: true,
        });
      });
  };

  useEffect(() => {
    obtenerTurnos();
  }, [obtenerTurnos]);

  const renderProductos = () => {
    if (turnosCarrito.length === 0) {
      return <div className='no-reservas'>No hay turnos en el carrito</div>;
    }

    return (
      <div style={{padding: '5vh'}}>
      <Row className='custom-row'>
        {turnosCarrito.map((turno) => (
          <Col sm={12} md={6} lg={4} key={turno.id}>
            <TurnoCarrito
              turno={turno}
              confirmarEliminarElemento={() => {
                setTurnoAEliminar({ id: turno.id });
                setMostrarConfirmacionEliminar(true);
              }}
            />
          </Col>
        ))}
      </Row>
      </div>
    );
  };

  const confirmarVaciarCarrito = () => {
    vaciarCarrito();
    setMostrarConfirmacion(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      seleccionarCliente();
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-center">
        <h1>CARRITO DE COMPRAS</h1>
      </div>
      <div>
        <Card.Body>
          <div>
            <div>
              <div>{renderProductos()}</div>
            </div>
          </div>
        </Card.Body>
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <Card className="card border-primary mb-3 text-bg-dark mb-3" style={{padding : '5vh'}}>
          <div className="justify-content-center">
            <div className="precio-container">
              <p className="precio-total">PRECIO TOTAL: </p>
              <p className="precio-total-2">${obtenerPrecio()}</p>
            </div>
            <div className="boton-carrito">
              <BotonVaciar className="boton-carrito" onClick={() => setMostrarConfirmacion(true)} />
            </div>
            <div className="boton-carrito">
              <BotonComprarCarrito className="boton-carrito" onClick={mostrarModalCliente} />
            </div>
          </div>
        </Card>
      </div>
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Gestionar reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Ingrese su email para finalizar la reserva.</p>
          <div className="search-form d-flex">
            <form className="form-inline">
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="email"
                aria-label="Search"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="outline-success" onClick={seleccionarCliente}>
                Comprar
              </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={mostrarConfirmacionEliminar} onHide={() => setMostrarConfirmacionEliminar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Estás seguro de que deseas eliminar el turno?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarConfirmacionEliminar(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => confirmarEliminarElemento(turnoAEliminar)}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar vaciar carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas vaciar el carrito?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarVaciarCarrito}>
            Vaciar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CarritoReservas;