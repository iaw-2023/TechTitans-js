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

  const handleLogin = useCallback(() => loginWithRedirect(), [loginWithRedirect])
  const handleLogout = useCallback(() => logout({ returnTo: window.location.origin }), [logout])
  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), [])
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const calculateTotal = useCallback(() => {
    return carrito.reduce((total, item) => total + Number.parseFloat(item.cancha.precio), 0).toFixed(2)
  }, [carrito])

  const handleDeleteTurno = useCallback((turno) => {
    setTurnoToDelete(turno)
    setShowConfirmModal(true)
  }, [])

  const confirmDeleteTurno = useCallback(() => {
    if (turnoToDelete) eliminarElemento(turnoToDelete.id)
    setShowConfirmModal(false)
    setTurnoToDelete(null)
  }, [turnoToDelete, eliminarElemento])

  const formatDate = useCallback(dateString => new Date(new Date(dateString).setDate(new Date(dateString).getDate() + 1)).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }), [])
  const formatTime = useCallback(timeString => timeString.slice(0, 5), [])
  const cartItemCount = carrito.length

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src={logo || "/placeholder.svg"} alt="Logo" />
          </Link>
        </div>

        {/* Hamburguesa */}
        <div className="menu-icon" onClick={toggleMenu}>
          <span>{isOpen ? "✕" : "☰"}</span>
        </div>

        {/* Menú desplegable en mobile */}
        <div className={isOpen ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-items">
            <li className="nav-item"><Link className="nav-link" to="/" onClick={toggleMenu}>Reservar</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/misReservas" onClick={toggleMenu}>Mis Reservas</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contacto" onClick={toggleMenu}>Contacto</Link></li>
            <li className="nav-item">
              <div className="nav-link carrito-link" onClick={toggleCart}>
                <ShoppingCart size={24} />
                {cartItemCount > 0 && <span className="carrito-counter">{cartItemCount}</span>}
              </div>
              {isCartOpen && (
                <div className="cart-dropdown">
                  <h3>Carrito de Compras</h3>
                  {cartItemCount === 0 ? <p>No hay turnos en el carrito</p> : <>
                    {carrito.map((item, index) => (
                      <div key={index} className="cart-item">
                        <div className="cart-item-info">
                          <p><strong>Día:</strong> {formatDate(item.fecha_turno)}</p>
                          <p><strong>Hora:</strong> {formatTime(item.hora_turno)}</p>
                          <p><strong>Cancha:</strong> {item.cancha.nombre}</p>
                          <p><strong>Categoría:</strong> {item.cancha.categoria_nombre}</p>
                          <p><strong>Precio:</strong> ${item.cancha.precio}</p>
                        </div>
                        <button className="delete-btn" onClick={() => handleDeleteTurno(item)}><Trash size={20} /></button>
                      </div>
                    ))}
                    <div className="cart-total"><strong>Total: ${calculateTotal()}</strong></div>
                    <Link to="/carrito" className="ver-carrito-btn" onClick={() => setIsCartOpen(false)}>Ver carrito</Link>
                  </>}
                </div>
              )}
            </li>
            <li className="nav-item">
              {isAuthenticated ? (
                <>
                  <button className="nav-link" onClick={() => { handleLogout(); toggleMenu(); }}>Cerrar sesión</button>
                  {user && <span className="nav-link">{user.name}</span>}
                </>
              ) : (
                <button className="nav-link" onClick={() => { handleLogin(); toggleMenu(); }}>Iniciar sesión</button>
              )}
            </li>
          </ul>
        </div>

        {/* Versión desktop (solo si el menú no está abierto) */}
        {!isOpen && (
          <div className="navbar-right desktop-only">
            <div className="carrito-icon" ref={cartRef}>
              <div className="nav-link carrito-link" onClick={toggleCart}>
                <ShoppingCart size={24} />
                {cartItemCount > 0 && <span className="carrito-counter">{cartItemCount}</span>}
              </div>
            </div>
            {isAuthenticated ? (
              <>
                <button className="nav-link" onClick={handleLogout}>Cerrar sesión</button>
                {user && <span className="nav-link">{user.name}</span>}
              </>
            ) : (
              <button className="nav-link" onClick={handleLogin}>Iniciar sesión</button>
            )}
          </div>
        )}
      </div>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¿Eliminar turno?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro de que desea eliminar este turno del carrito?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDeleteTurno}>Confirmar</Button>
        </Modal.Footer>
      </Modal>
    </nav>
  )
}

export default memo(Navbar)
