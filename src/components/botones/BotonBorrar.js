import React from 'react';
import {Icon} from 'semantic-ui-react';

const BotonBorrar = ({ onClick }) => {
  return (
    <button className="btn btn-danger btn-sm" onClick={onClick}>
      <Icon name='trash alternate' />
    </button>
  );
};

export default BotonBorrar;