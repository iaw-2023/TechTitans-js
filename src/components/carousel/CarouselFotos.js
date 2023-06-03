import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import imagen1 from '../../components/imagenes/bombonera.png';
import imagen2 from '../../components/imagenes/bombonerita.jpg';
import imagen3 from '../../components/imagenes/padel.jpg';
import './CarouselFotos.css';

const CarouselFotos = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Carousel interval={0} selectedItem={currentSlide}>
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
