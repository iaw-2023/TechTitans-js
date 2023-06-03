import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../components/imagenes/logo.png';
import carrito from '../../components/carrito/carrito.png';

const Navbar = () => {
  return (
    <nav>
      <ul>
      <li className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo"/>
        </Link>
      </li>
      <li id="reservar" className="nav-item">
        <Link className="nav-link" to="/reservar">Reservar</Link>
      </li>
        <li className="nav-item">
          <Link className="nav-link" to="misReservas/raul@gmail.com">Mis Reservas</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to= "/contacto">Contacto</Link>
        </li>
        <li className="carrito-logo">
        <Link to="/carrito">
          <img src={carrito} alt="Carrito"/>
        </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;