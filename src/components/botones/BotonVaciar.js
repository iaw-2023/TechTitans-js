import React from 'react';
import '../botones/botones.css';
import {Icon} from 'semantic-ui-react';

const BotonVaciar = ({ onClick }) => {
  return (
    <button className="btn btn-danger btn-carrito" onClick={onClick}>
      <Icon name='trash alternate' />
      {' Vaciar Carrito'}
    </button>
  );
};

export default BotonVaciar;