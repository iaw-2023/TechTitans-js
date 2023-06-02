import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import React from 'react';
import './CarouselFotos.css';
import imagen1 from '../../components/imagenes/bombonera.png';
import imagen2 from '../../components/imagenes/bombonerita.jpg';
import imagen3 from '../../components/imagenes/padel.jpg';

const CarouselFotos = () => {
    return (
      <Carousel>
        <div>
          <img src={imagen1} alt="Imagen 1" />
          <p className="legend">EL TEMPLO</p>
        </div>
        <div>
          <img src={imagen2} alt="Imagen 2" />
          <p className="legend">EL TEMPLO PERO DE BASQUET</p>
        </div>
        <div>
          <img src={imagen3} alt="Imagen 3" />
          <p className="legend">la canchita de padellll</p>
        </div>
      </Carousel>
    );
  };

  export default CarouselFotos;
