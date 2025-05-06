import { useContext, useState, useEffect, useCallback } from "react"
import { API } from "../../config.js"
import { Card, Modal, Button, Table, Spinner } from "react-bootstrap"
import BotonVaciar from "../botones/BotonVaciar.js"
import BotonComprarCarrito from "../botones/BotonComprarCarrito.js"
import { CarritoContexto } from "../../context/ShoppingCartContext.jsx"
import Swal from "sweetalert2"
import "./CarritoReservas.css"
import { useAuth0 } from "@auth0/auth0-react"

const mp = new window.MercadoPago("APP_USR-0144850f-6a77-4ee3-b6bf-390c8bbe3cf7", {
  locale: "es-AR",
})

const CarritoReservas = () => {
  const { vaciarCarrito, carrito, eliminarElemento } = useContext(CarritoContexto)
  const [turnosCarrito, setTurnosCarrito] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false)
  const [turnoAEliminar, setTurnoAEliminar] = useState(null)
  const { isAuthenticated, loginWithRedirect, user } = useAuth0()
  const emailUsuario = isAuthenticated ? user.email : ""
  const [email, setEmail] = useState(emailUsuario)
  const [selectedTurno, setSelectedTurno] = useState(null)
  const [cargandoWallet, setCargandoWallet] = useState(false)

  const mostrarModalCliente = () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No ha agregado ningún turno al carrito.",
        showConfirmButton: true,
      })
      return
    }
    setMostrarModal(true)
    iniciarCompra()
  }

  const iniciarCompra = async () => {
    try {
      setCargandoWallet(true)

      const detalles = carrito.map((item) => ({
        id_turno: item.id,
        precio: item.cancha.precio,
      }))

      const body = JSON.stringify({
        email_cliente: email || emailUsuario,
        turnos: detalles,
        precio_total: Number.parseInt(obtenerPrecio()),
      })

      const response = await fetch(`${API}reservas/alta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      })

      if (!response.ok) {
        throw new Error("Error al generar la preferencia de pago")
      }

      const { preference_id } = await response.json()

      await mp.bricks()
        .create("wallet", "wallet_container", {
          initialization: { preferenceId: preference_id },
        })

      setCargandoWallet(false)
    } catch (error) {
      console.error("Error al generar botón de pago:", error)
      setCargandoWallet(false)
      Swal.fire({
        icon: "error",
        title: "Error al generar el botón de pago",
        text: error.message,
      })
    }
  }

  const obtenerTurnos = useCallback(() => {
    setLoading(true)
    setTurnosCarrito(carrito)
    setLoading(false)
  }, [carrito])

  const obtenerPrecio = () => {
    return turnosCarrito.reduce((total, turno) => total + Number.parseInt(turno.cancha.precio), 0).toFixed(2)
  }

  const confirmarEliminarElemento = (id) => {
    eliminarElemento(id)
    setTurnoAEliminar(null)
    setMostrarConfirmacionEliminar(false)
  }

  useEffect(() => {
    obtenerTurnos()
  }, [obtenerTurnos])

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr)
    fecha.setDate(fecha.getDate() + 1)
    return fecha.toLocaleDateString("es-AR")
  }

  const renderTabla = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )
    }

    if (turnosCarrito.length === 0) {
      return <div className="no-items">No hay turnos en el carrito</div>
    }

    return (
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnosCarrito.map((turno) => (
              <tr key={turno.id}>
                <td>{formatearFecha(turno.fecha_turno)}</td>
                <td>{turno.hora_turno}</td>
                <td>{turno.cancha.categoria_nombre}</td>
                <td>${turno.cancha.precio}</td>
                <td>
                  <div className="action-buttons">
                    <Button variant="info" size="sm" onClick={() => setSelectedTurno(turno)}>
                      Ver detalle
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setTurnoAEliminar(turno.id)
                        setMostrarConfirmacionEliminar(true)
                      }}
                    >
                      Borrar turno
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )
  }

  return (
    <div className="carrito-reservas-container">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Carrito de reservas</h2>
      <Card.Body>
        {renderTabla()}
        {turnosCarrito.length > 0 && (
          <div className="mt-4 d-flex flex-column align-items-center">
            <h4 className="precio-total">Precio Total: ${obtenerPrecio()}</h4>
            <div className="buttons-container">
              <BotonVaciar onClick={() => setMostrarConfirmacion(true)} />
              <BotonComprarCarrito onClick={mostrarModalCliente} />
            </div>
          </div>
        )}
      </Card.Body>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Finalizar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isAuthenticated ? (
            <div className="text-center">
              <p>Espere unos segundos mientras se carga el botón de pago.</p>
              {cargandoWallet && (
                <div className="my-3">
                  <Spinner animation="border" role="status" />
                  <div className="mt-2">Cargando botón de Mercado Pago...</div>
                </div>
              )}
              <div id="wallet_container" className="mt-3"></div>
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
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={mostrarConfirmacion} onHide={() => setMostrarConfirmacion(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¿Vaciar carrito?</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de que desea vaciar el carrito?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => { vaciarCarrito(); setMostrarConfirmacion(false) }}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={mostrarConfirmacionEliminar} onHide={() => setMostrarConfirmacionEliminar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¿Eliminar turno?</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de que desea eliminar este turno del carrito?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarConfirmacionEliminar(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => confirmarEliminarElemento(turnoAEliminar)}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={selectedTurno !== null} onHide={() => setSelectedTurno(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTurno && (
            <>
              <p>{selectedTurno.cancha.nombre}</p>
              <p>Fecha: {formatearFecha(selectedTurno.fecha_turno)}</p>
              <p>Hora: {selectedTurno.hora_turno}</p>
              <p>Precio: ${selectedTurno.cancha.precio}</p>
              <p>Superficie: {selectedTurno.cancha.superficie}</p>
              <p>Techada: {selectedTurno.cancha.techo ? "Sí" : "No"}</p>
              <p>Cantidad de jugadores: {selectedTurno.cancha.cant_jugadores}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedTurno(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CarritoReservas
