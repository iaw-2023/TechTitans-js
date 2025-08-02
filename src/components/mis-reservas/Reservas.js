"use client"

import { useState, useEffect } from 'react';
import { API } from '../../config.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Reservas.css';
import { useAuth0 } from '@auth0/auth0-react';
import ReservaModal from './ReservaModal';
import ConfirmCancelModal from './ConfirmCancelModal';
import { Table, Button, Badge, Spinner, Modal } from "react-bootstrap"
import MercadoPagoWallet from '../MercadoPago/MercadoPagoWallet.jsx';
import Swal from "sweetalert2"

const Reservas = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [reservas, setReservas] = useState([]);
  const [alert, setAlert] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carga
  const [modalData, setModalData] = useState(null); // Datos para el modal de detalles
  const [showModal, setShowModal] = useState(false);
  const [cancelModalData, setCancelModalData] = useState(null); // Reserva a cancelar
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pagando, setPagando] = useState(null) // ID de la reserva que se está pagando
  const [cancelando, setCancelando] = useState(null) // ID de la reserva que se está cancelando
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedReservaForPayment, setSelectedReservaForPayment] = useState(null)
  const [pagoRealizado, setPagoRealizado] = useState(false)

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
      setAlert("");
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
        setAlert("");
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

      Swal.fire({
        icon: "success",
        title: "¡Reserva cancelada exitosamente!",
        showConfirmButton: false,
        timer: 2000,
      })

      fetchReservas(user.email)
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      setAlert('Error al cancelar la reserva');
      setTimeout(() => setAlert(''), 3000);
    } finally {
      setCancelando(null)
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
  
  const calcularPrecioTotal = (detalle) => {
    return detalle.reduce((total, item) => total + Number.parseFloat(item.precio), 0)
  }

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr)
    fecha.setDate(fecha.getDate() + 1)
    const dia = String(fecha.getDate()).padStart(2, "0")
    const mes = String(fecha.getMonth() + 1).padStart(2, "0")
    const anio = fecha.getFullYear()
    return `${dia}/${mes}/${anio}`
  }

  const handlePagar = (reserva) => {
    setSelectedReservaForPayment(reserva)
    setShowPaymentModal(true)
    setPagoRealizado(false)
  }

  const procesarPago = async () => {
    if (!selectedReservaForPayment) return null

    try {
      setPagando(true)
      console.log("Procesando pago para reserva ID:", selectedReservaForPayment.reserva.id)

      // Llamar al método createPreference que ya tienes implementado
      const response = await fetch(`${API}mercadopago/preference/${selectedReservaForPayment.reserva.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        throw new Error(errorData.message || "Error al procesar el pago")
      }

      const { preference_id } = await response.json()
      console.log("Preference ID obtenido:", preference_id)

      if (!preference_id) {
        throw new Error("No se recibió preference_id del servidor")
      }

      return preference_id
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      Swal.fire({
        icon: "error",
        title: "Error al procesar el pago",
        text: error.message,
      })
      throw error
    } finally {
      setPagando(false)
     }
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
    setPagoRealizado(false)
    setSelectedReservaForPayment(null)
  }

  return (
    <div className="card-container">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Mis Reservas</h2>
      {alert && (
        <div className="alert alert-info" role="alert">
          {alert}
        </div>
      )}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : reservas.length === 0 ? (
        <div className="alert alert-primary" role="alert">
          No tienes reservas registradas.
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Orden de Reserva</th>
                <th>Fecha</th>
                <th>Precio Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.reserva.id}>
                  <td>#{reserva.reserva.id}</td>
                  <td>{formatearFecha(reserva.reserva.fecha_reserva)}</td>
                  <td>${calcularPrecioTotal(reserva.detalle)}</td>
                  <td>
                    <Badge className={getBadgeClass(reserva.reserva.estado)}>{reserva.reserva.estado}</Badge>
                  </td>
                  <td>
                    <div className="d-flex flex-column flex-sm-row gap-2">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowModal(reserva)}
                        className="w-100 w-sm-auto"
                      >
                        Detalles
                      </Button>
                      {reserva.reserva.estado === "Pendiente" && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handlePagar(reserva)}
                            disabled={pagando}
                            className="w-100 w-sm-auto"
                          >
                            {pagando ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                Procesando...
                              </>
                            ) : (
                              "Pagar"
                            )}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setCancelando(reserva.reserva.id)
                              confirmarCancelacion(reserva.reserva)
                            }}
                            disabled={cancelando === reserva.reserva.id}
                            className="w-100 w-sm-auto"
                          >
                            {cancelando === reserva.reserva.id ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                Cancelando...
                              </>
                            ) : (
                              "Cancelar Reserva"
                            )}
                          </Button>
                        </>
                      )}
                      {reserva.reserva.estado === "Aceptado" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setCancelando(reserva.reserva.id)
                            confirmarCancelacion(reserva.reserva)
                          }}
                          disabled={cancelando === reserva.reserva.id}
                          className="w-100 w-sm-auto"
                        >
                          {cancelando === reserva.reserva.id ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Cancelando...
                            </>
                          ) : (
                            "Cancelar Reserva"
                          )}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
      {/* Modal de Pago */}
      <Modal show={showPaymentModal} onHide={handleClosePaymentModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Pagar Reserva #{selectedReservaForPayment?.reserva.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReservaForPayment && (
            <div>
              <div className="mb-3">
                <h5>Detalles de la reserva:</h5>
                <p>
                  <strong>Fecha:</strong> {formatearFecha(selectedReservaForPayment.reserva.fecha_reserva)}
                </p>
                <p>
                  <strong>Total a pagar:</strong> ${calcularPrecioTotal(selectedReservaForPayment.detalle)}
                </p>
              </div>

              <MercadoPagoWallet
                onProcessPayment={procesarPago}
                procesando={pagando}
                pagoRealizado={pagoRealizado}
                buttonText="Proceder al Pago"
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePaymentModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Reservas;
