import React from 'react';
import '../botones/botones.css';
import {Icon} from 'semantic-ui-react';

const BotonComprarCarrito = ({ onClick }) => {
  return (
    <button className="btn btn-success btn-carrito" onClick={onClick}>
    <Icon name='shop' />
    {' Comprar'}
    </button>
  );
};

export default BotonComprarCarrito;