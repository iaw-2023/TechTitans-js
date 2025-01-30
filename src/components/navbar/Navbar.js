import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import "./Navbar.css"
import logo from "../../components/imagenes/logo.png"
import carrito from "../../components/imagenes/carrito.png"

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogin = () => {
    loginWithRedirect()
  }

  const handleLogout = () => {
    logout({ returnTo: window.location.origin })
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo || "/placeholder.svg"} alt="Logo" />
        </Link>
        <div className="menu-icon" onClick={toggleMenu}>
          <span>{isOpen ? "✕" : "☰"}</span>
        </div>
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li id="reservar" className="nav-item">
            <Link className="nav-link" to="/reservar" onClick={toggleMenu}>
              Reservar
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/misReservas" onClick={toggleMenu}>
              Mis Reservas
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contacto" onClick={toggleMenu}>
              Contacto
            </Link>
          </li>
          <li className="carrito-logo">
            <Link className="nav-link" to="/carrito" onClick={toggleMenu}>
              <img src={carrito || "/placeholder.svg"} alt="Carrito" />
            </Link>
          </li>
          <li className="nav-item">
            {isAuthenticated ? (
              <button
                className="nav-link"
                onClick={() => {
                  handleLogout()
                  toggleMenu()
                }}
              >
                Cerrar sesión
              </button>
            ) : (
              <button
                className="nav-link"
                onClick={() => {
                  handleLogin()
                  toggleMenu()
                }}
              >
                Iniciar sesión
              </button>
            )}
          </li>
          {isAuthenticated && user && (
            <li className="nav-item">
              <span className="nav-link">{user.name}</span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

