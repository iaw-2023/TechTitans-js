import {API} from './config.js';
import React, { useEffect, useState } from 'react';
import './App.css';
    
    const Carrito = () => {
        const [carrito, setCarrito] = useState([]);
      
        useEffect(() => {
          const fetchCarrito  = async () => {
            try {
              const response = await fetch(API+'/carrito');
              const data = await response.json();
              setCarrito(data);
            } catch (error) {
              console.error(error);
            }
          };
      
          fetchCarrito();
        }, []);

    return(
        <div>
        <h2>Carrito</h2>
            
      </div>
    );
}

export default Carrito;