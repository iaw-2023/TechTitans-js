import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
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