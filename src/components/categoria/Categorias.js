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
      link: "/1"
    },
    {
      nombre: tenis,
      link: "/2"
    },
    {
      nombre: basquet,
      link: "/3"
    },
    {
      nombre: padel,
      link: "/4"
    },
    {
      nombre: handball,
      link: "/5"
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
      <div className='titulo'>
      <h2>Seleccione la categoria deseada</h2>
      </div>
      <div className="container">
        <div className="imagen-grid">
          {imagenes.map((imagen, index) => (
            <div
              key={index}
              className="imagen-item"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <a href={'/reservar/dispCat'+imagen.link}>
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
