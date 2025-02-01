import { createContext, useState, useEffect } from "react"

export const CarritoContexto = createContext(null)

const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito")
    return carritoGuardado ? JSON.parse(carritoGuardado) : []
  })

  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito")
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito))
  }, [carrito])

  const agregarItem = (turnoId, turno) => {
    setCarrito((prevCarrito) => {
      const turnoExistente = prevCarrito.find((item) => item.id === turnoId)
      if (turnoExistente) {
        console.log("El turno ya existe en el carrito")
        return prevCarrito
      } else {
        console.log("Agregando nuevo turno al carrito:", turno)
        return [...prevCarrito, { id: turnoId, ...turno }]
      }
    })
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  const eliminarElemento = (turnoId) => {
    setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== turnoId))
  }

  return (
    <CarritoContexto.Provider value={{ carrito, agregarItem, vaciarCarrito, eliminarElemento }}>
      {children}
    </CarritoContexto.Provider>
  )
}

export { CarritoProvider }

