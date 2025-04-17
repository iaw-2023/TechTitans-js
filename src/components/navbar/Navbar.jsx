import { useState, useContext, useRef, useEffect, useCallback, memo } from "react"
import { Link } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import "./Navbar.css"
import logo from "../../components/imagenes/logo.png"
import { CarritoContexto } from "../../context/ShoppingCartContext"
import { ShoppingCart, Trash } from "phosphor-react"
import { Modal, Button } from "react-bootstrap"

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()
  const [isOpen, setIsOpen] = useState(false)
  const { carrito, eliminarElemento } = useContext(CarritoContexto)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartRef = useRef(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [turnoToDelete, setTurnoToDelete] = useState(null)

  // Memoizar funciones de manejo para evitar recreaciones
  const handleLogin = useCallback(() => {
    loginWithRedirect()
  }, [loginWithRedirect])

  const handleLogout = useCallback(() => {
    logout({ returnTo: window.location.origin })
  }, [logout])

  const toggleMenu = useCallback(() => {
    setIsOpen(prevState => !prevState)
  }, [])

  const toggleCart = useCallback(() => {
    setIsCartOpen(prevState => !prevState)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Memoizar el cálculo del total para evitar recálculos innecesarios
  const calculateTotal = useCallback(() => {
    return carrito.reduce((total, item) => total + Number.parseFloat(item.cancha.precio), 0).toFixed(2)
  }, [carrito])

  const handleDeleteTurno = useCallback((turno) => {
    setTurnoToDelete(turno)
    setShowConfirmModal(true)
  }, [])

  const confirmDeleteTurno = useCallback(() => {
    if (turnoToDelete) {
      eliminarElemento(turnoToDelete.id)
    }
    setShowConfirmModal(false)
    setTurnoToDelete(null)
  }, [turnoToDelete, eliminarElemento])

  // Funciones de formato memoizadas
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString)
    date.setDate(date.getDate() + 1)
    return date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
  }, [])

  const formatTime = useCallback((timeString) => {
    return timeString.slice(0, 5)
  }, [])

  // Memoizar el contador del carrito
  const cartItemCount = carrito.length

  return (
    <nav className="bg-white shadow-md fixed w-full z-20 top-0 left-0">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <Link to="/" className="flex items-center space-x-2">
      <img src={logo || "/placeholder.svg"} className="h-10" alt="Logo" />
      <span className="self-center text-xl font-semibold whitespace-nowrap">TuApp</span>
    </Link>

    <button
      data-collapse-toggle="navbar-default"
      type="button"
      className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100"
      onClick={toggleMenu}
    >
      {isOpen ? "✕" : "☰"}
    </button>

    <div className={`${isOpen ? "" : "hidden"} w-full md:block md:w-auto`} id="navbar-default">
      <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
        <li>
          <Link to="/" onClick={toggleMenu} className="block py-2 pl-3 pr-4 text-gray-700 hover:text-blue-600">
            Reservar
          </Link>
        </li>
        <li>
          <Link to="/misReservas" onClick={toggleMenu} className="block py-2 pl-3 pr-4 text-gray-700 hover:text-blue-600">
            Mis Reservas
          </Link>
        </li>
        <li>
          <Link to="/contacto" onClick={toggleMenu} className="block py-2 pl-3 pr-4 text-gray-700 hover:text-blue-600">
            Contacto
          </Link>
        </li>
        <li className="relative" ref={cartRef}>
          <button onClick={toggleCart} className="flex items-center gap-2 hover:text-blue-600">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>
          {isCartOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg p-4 z-50">
              <h3 className="text-lg font-semibold mb-2">Carrito de Compras</h3>
              {cartItemCount === 0 ? (
                <p>No hay turnos en el carrito</p>
              ) : (
                <>
                  {carrito.map((item, index) => (
                    <div key={index} className="flex justify-between items-start border-b py-2">
                      <div className="text-sm">
                        <p><strong>Día:</strong> {formatDate(item.fecha_turno)}</p>
                        <p><strong>Hora:</strong> {formatTime(item.hora_turno)}</p>
                        <p><strong>Cancha:</strong> {item.cancha.nombre}</p>
                        <p><strong>Precio:</strong> ${item.cancha.precio}</p>
                      </div>
                      <button onClick={() => handleDeleteTurno(item)} className="text-red-600 hover:text-red-800">
                        <Trash size={20} />
                      </button>
                    </div>
                  ))}
                  <div className="font-bold mt-2">Total: ${calculateTotal()}</div>
                  <Link to="/carrito" onClick={() => setIsCartOpen(false)} className="block mt-3 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Ver carrito
                  </Link>
                </>
              )}
            </div>
          )}
        </li>
        <li>
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout()
                toggleMenu()
              }}
              className="block py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={() => {
                handleLogin()
                toggleMenu()
              }}
              className="block py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Iniciar sesión
            </button>
          )}
        </li>
        {isAuthenticated && user && (
          <li className="text-sm font-medium text-gray-600 px-2">{user.name}</li>
        )}
      </ul>
    </div>
  </div>

  <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>¿Eliminar turno?</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>¿Está seguro de que desea eliminar este turno del carrito?</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={confirmDeleteTurno}>
        Confirmar
      </Button>
    </Modal.Footer>
  </Modal>
</nav>

  )
}

// Memoizar el componente completo para evitar renderizados innecesarios
export default memo(Navbar)