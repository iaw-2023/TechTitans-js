import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './Navbar.css';
import logo from '../../components/imagenes/logo.png';
import carrito from '../../components/imagenes/carrito.png';

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <nav>
      <ul>
        <li className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </li>
        <li id="reservar" className="nav-item">
          <Link className="nav-link" to="/reservar">
            Reservar
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/contacto">
            Contacto
          </Link>
        </li>
        {isAuthenticated ? (
          <li className="carrito-logo">
            <Link className="nav-link" to="/carrito">
              <img src={carrito} alt="Carrito" />
            </Link>
          </li>
        ) : null}
        <li className="nav-item">
          {isAuthenticated ? (
            <button className="nav-link" onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <button className="nav-link" onClick={handleLogin}>
              Iniciar sesión
            </button>
          )}
        </li>
        {isAuthenticated && user ? (
          <li className="nav-item">
            <span className="nav-link">{user.name}</span>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};

export default Navbar;