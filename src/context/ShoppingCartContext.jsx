import React, { createContext, useState } from "react";

export const CarritoContexto = createContext();

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

  const agregarItem = (productoId, producto) => {
    const productoExistente = carrito.find(
      (item) => item.producto === productoId
    );
  
    if (productoExistente) {
      const carritoActualizado = carrito.map((item) => {
        if (item.producto === productoId) {
          return {
            producto: item.producto
          };
        } else {
          return item;
        }
      });
  
      setCarrito(carritoActualizado);
    } else {
      const itemNuevo = {
        producto: productoId
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

export { CarritoProvider, CarritoContexto };