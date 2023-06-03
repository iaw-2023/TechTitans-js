import React, { useState } from 'react';
import './Categorias.css';
import futbol from '../../components/imagenes/futbol.png';
import basquet from '../../components/imagenes/basquet.png';
import tenis from '../../components/imagenes/tenis.png';
import handball from '../../components/imagenes/handball.png';
import padel from '../../components/imagenes/padel.png';

const Categoria = () => {
  const imagenes = [
    {
      nombre: futbol,
      link: "/Futbol"
    },
    {
      nombre: tenis,
      link: "/Tenis"
    },
    {
      nombre: basquet,
      link: "/Basquet"
    },
    {
      nombre: padel,
      link: "/Padel"
    },
    {
      nombre: handball,
      link: "/Handball"
    }
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div>
      <h1>Seleccione tipo de cancha:</h1>
      <div className="container">
        <div className="imagen-grid">
          {imagenes.map((imagen, index) => (
            <div
              key={index}
              className="imagen-item"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <a href={'http://localhost:3000/reservar'+imagen.link}>
                <img
                  src={imagen.nombre}
                  alt={`Imagen ${index}`}
                  style={{ filter: hoveredIndex === index ? 'none' : 'grayscale(100%)' }}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categoria;
