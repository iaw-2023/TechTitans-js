import React, { useContext, useState, useEffect, useCallback } from "react";
import { API } from "../../config.js";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import BotonVaciar from "../botones/BotonVaciar.js";
import BotonComprarCarrito from "../botones/BotonComprarCarrito.js";
import { CarritoContexto } from "../../context/ShoppingCartContext.jsx";
import TurnoCarrito from "./TurnoCarrito.jsx";
import Swal from "sweetalert2";
import "./CarritoReservas.css";
import { Row, Col } from "react-bootstrap";

import { useAuth0 } from "@auth0/auth0-react";

// Asegúrate de cargar correctamente el SDK de Mercado Pago
const mp = new window.MercadoPago("APP_USR-0144850f-6a77-4ee3-b6bf-390c8bbe3cf7", {
  locale: "es-AR", // Idioma de preferencia
});

const CarritoReservas = () => {
  const { vaciarCarrito, carrito, eliminarElemento } = useContext(CarritoContexto);
  const [turnosCarrito, setTurnosCarrito] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [turnoAEliminar, setTurnoAEliminar] = useState(null);
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const emailUsuario = isAuthenticated ? user.email : "";
  const [email, setEmail] = useState(emailUsuario);

  const mostrarModalCliente = () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No ha agregado ningún turno al carrito.",
        showConfirmButton: true,
      });
      return;
    } else {
      setMostrarModal(true);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginWithRedirect();
  };

  const seleccionarCliente = () => {
    if (email === "") {
      Swal.fire({
        icon: "info",
        title: "Ingrese un email válido.",
        showConfirmButton: true,
      });
      return;
    }
    setMostrarModal(false);
  };

  const obtenerTurnos = useCallback(async () => {
    const URL = `${API}turnos/`;
    const posiblesTurnos = carrito.map((turno) => {
      const turnoId = turno.id;
      const turnoURL = URL + turnoId;
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
    return turnosCarrito.reduce((total, turno) => total + parseInt(turno.cancha.precio), 0).toFixed(2);
  };

  const confirmarEliminarElemento = (index) => {
    eliminarElemento(index);
    setMostrarConfirmacionEliminar(false);
  };

  const comprarCarrito = async () => {
    try {
      const detalles = carrito.map((item) => ({
        id_turno: item.turno,
        precio: item.cancha.precio,
      }));

      const body = JSON.stringify({
        email_cliente: email || emailUsuario,
        turnos: detalles,
        precio_total: parseInt(obtenerPrecio()),
      });

      console.log(body);

      const response = await fetch(`${API}reservas/alta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error("Error al realizar la compra");
      }

      const { preference_id } = await response.json();

      // Crear botón de MercadoPago
      const bricksBuilder = mp.bricks();

      await bricksBuilder.create("wallet", "wallet_container", {
        initialization: {
          preferenceId: preference_id,
        },
      });

      Swal.fire({
        icon: "success",
        title: "¡Reserva realizada correctamente!",
        showConfirmButton: false,
        timer: 2000,
      });

      vaciarCarrito();
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      Swal.fire({
        icon: "error",
        title: "Error al realizar la compra",
        text: error.message,
      });
    }
  };

  useEffect(() => {
    obtenerTurnos();
  }, [obtenerTurnos]);

  const renderProductos = () => {
    if (turnosCarrito.length === 0) {
      return <div className="no-items">No hay turnos en el carrito</div>;
    }

    return (
      <div style={{ padding: "5vh" }}>
        <Row className="custom-row">
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

  return (
    <div>
      <div className="d-flex align-items-center justify-content-center">
        <h1>CARRITO DE COMPRAS</h1>
      </div>
      <div>
        <Card.Body>
          <div>{renderProductos()}</div>
        </Card.Body>
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <Card className="card border-primary mb-3 text-bg-dark mb-3" style={{ padding: "5vh" }}>
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
          {isAuthenticated ? (
            <div>
              <p>
                Presione comprar para finalizar la reserva. Se enviará un mail con el detalle de la misma. ¡Muchas gracias!
              </p>
              <button type="button" className="btn btn-success" onClick={comprarCarrito}>
                Comprar
              </button>
              <div id="wallet_container"></div>
            </div>
          ) : (
            <div>
              <p>Debe iniciar sesión para realizar una reserva.</p>
              <button type="button" className="btn btn-info" onClick={handleLogin}>
                Iniciar sesión
              </button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CarritoReservas;
