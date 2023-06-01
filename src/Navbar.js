import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from './logo.png';

const Navbar = () => {
  return (
    <nav>
      <ul>
      <li className="navbar-logo">
        <img src={logo} alt="Logo" />
      </li>
        <li>
          <Link to="/canchas">Canchas</Link>
        </li>
        <li>
          <Link to="/turnos">Turnos</Link>
        </li>
        <li>
          <Link to="/categorias">Categorías</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;