import {API} from '../../config.js';
import React, { useEffect, useState } from 'react';
    
    const Contacto = () => {
        const [contacto, setContacto] = useState([]);
      
        useEffect(() => {
          const fetchContacto  = async () => {
            try {
              const response = await fetch(API+'/contacto');
              const data = await response.json();
              setContacto(data);
            } catch (error) {
              console.error(error);
            }
          };
      
          fetchContacto();
        }, []);

    return(
        <div>
        <h2>Contacto</h2>
            <h3>WhatsApp</h3>
                <p>291-123456</p>
            <h3>Facebook</h3>
                <p>/ReservaTuCancha</p>
            <h3>Instagram</h3>
                <p>@reservatucancha</p>
      </div>
    );
}

export default Contacto;