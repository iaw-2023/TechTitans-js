import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import bosters from '../../components/imagenes/bosters.png';
const Contacto = () => {
  return (
    <div className="text-center">
  <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Contacto</h2>  
  <div className="mb-3">
    <a className="icon-link" href="https://api.whatsapp.com/" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faWhatsapp} className="bi" aria-hidden="true" />
      1977-2000-2003
    </a>
  </div>
  <div className="mb-3">
    <a className="icon-link" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faInstagram} className="bi" aria-hidden="true" />
      reservatucancha
    </a>
  </div>

  <div className="mb-3">
    <a className="icon-link" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faFacebook} className="bi" aria-hidden="true" />
      reservatucancha
    </a>
  </div>

  <div className="mb-3">
    <img src={bosters} alt="Imagen 3" width="600"  className="mb-3" />
  </div>
</div>

  );
};

export default Contacto;