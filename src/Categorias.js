import {API} from './config.js';
import React, { useEffect, useState } from 'react';
import './App.css';

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
  
    useEffect(() => {
      const fetchCategorias  = async () => {
        try {
          const response = await fetch(API+'/categorias');
          const data = await response.json();
          setCategorias(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchCategorias();
    }, []);
  
    return (
      <div>
        <h2>Listado de Categorias</h2>
        {categorias.map(categoria => (
          <div key={categoria.id}>
            <h3>{categoria.nombre}</h3>
            <p>ID: {categoria.id}</p>
          </div>
        ))}
      </div>
    );
  };

export default Categorias;