import React, { createContext, useState , useEffect } from "react";

export const CarritoContexto = createContext(null);

const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });  

  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarItem = (turnoId, turno) => {
    console.log("item agregado id"+turnoId)
    const productoExistente = carrito.find(
      (item) => item.turno === turnoId
    );
    
    if (productoExistente) {
      const carritoActualizado = carrito.map((item) => {
        if (item.turno === turnoId) {
          return {
            turno: turnoId, ...turno,
          };
        } else {
          return item;
        }
      });
  
      setCarrito(carritoActualizado);
    } else {
      const itemNuevo = {
        turno: turnoId, ...turno,
      };
  
      setCarrito([...carrito, itemNuevo]);
    }
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const eliminarElemento = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  return (
    <CarritoContexto.Provider
      value={{ carrito, agregarItem, vaciarCarrito, eliminarElemento }}
    >
      {children}
    </CarritoContexto.Provider>
  );
};

export { CarritoProvider };
//export { CarritoProvider, CarritoContexto };