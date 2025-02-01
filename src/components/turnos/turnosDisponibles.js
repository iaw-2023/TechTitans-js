import { useEffect, useState, useContext } from "react"
import { API } from "../../config"
import "./turnosDisponibles.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { Spinner } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { CarritoContexto } from "../../context/ShoppingCartContext"

const TurnosDisponibles = () => {
  const [turnosPorCancha, setTurnosPorCancha] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState(null)
  const { categoriaId } = useParams()
  const [selectedFecha, setSelectedFecha] = useState(null)
  const carritoContexto = useContext(CarritoContexto)
  const { agregarItem, carrito } = carritoContexto

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setSelectedFecha(today)
  }, [])

  useEffect(() => {
    const fetchTurnos = async () => {
      if (!selectedFecha) {
        setTurnosPorCancha([])
        return
      }

      setLoading(true)
      try {
        const url = `${API}turnos/fecha/cat/${selectedFecha}/${categoriaId}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Error al obtener los turnos: ${response.status}`)
        }
        const data = await response.json()

        const turnosAgrupados = data.reduce((acc, turno) => {
          const canchaId = turno.cancha?.id
          if (!canchaId) {
            console.warn("Turno con cancha inválida:", turno)
            return acc
          }
          if (!acc[canchaId]) {
            acc[canchaId] = {
              ...turno.cancha,
              turnos: [],
            }
          }
          acc[canchaId].turnos.push(turno)
          return acc
        }, {})

        setTurnosPorCancha(Object.values(turnosAgrupados))
      } catch (error) {
        console.error("Error al cargar turnos:", error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTurnos()
  }, [categoriaId, selectedFecha])

  const handleFechaChange = (e) => {
    setSelectedFecha(e.target.value || null)
  }

  const toggleTurnoSeleccionado = (turno) => {
    if (!turno || !turno.id) {
      console.warn("Intento de seleccionar un turno inválido:", turno)
      return
    }

    setSelectedTurno(selectedTurno?.id === turno.id ? null : turno)
  }

  const agregarTurnoAlCarrito = () => {
    if (!selectedTurno) {
      console.warn("No hay turno seleccionado para agregar al carrito")
      return
    }

    const turnoData = {
      id: selectedTurno.id,
      fecha_turno: selectedTurno.fecha_turno,
      hora_turno: selectedTurno.hora_turno,
      cancha: {
        nombre: selectedTurno.cancha.nombre,
        precio: selectedTurno.cancha.precio,
        superficie: selectedTurno.cancha.superficie,
        techo: selectedTurno.cancha.techo,
        cant_jugadores: selectedTurno.cancha.cant_jugadores,
      },
    }

    agregarItem(turnoData.id, turnoData)
    setSelectedTurno(null)
  }

  const isTurnoInCarrito = (turnoId) => {
    return carrito.some((item) => item.id === turnoId)
  }

  const hours = Array.from({ length: 4 }, (_, i) => `${String(i + 17).padStart(2, "0")}:00:00`)

  return (
    <div className="turnos-container">
      <h2 className="turnos-title">¿Qué día jugamos?</h2>

      <div className="date-picker-container">
        <input type="date" className="date-picker" value={selectedFecha || ""} onChange={handleFechaChange} />
      </div>

      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : turnosPorCancha.length === 0 && selectedFecha ? (
        <div className="no-turnos-message">No hay turnos disponibles</div>
      ) : (
        selectedFecha && (
          <>
            <h3 className="turnos-subtitle">Elegí cancha y horario:</h3>
            <div className="turnos-grid">
              <div className="turnos-header">
                <div className="cancha-header">Cancha</div>
                {hours.map((hour) => (
                  <div key={hour} className="hour-header">
                    {hour.slice(0, -3)}
                  </div>
                ))}
              </div>
              {turnosPorCancha.map((cancha) => (
                <div key={cancha.id} className="cancha-row">
                  <div className="cancha-info">
                    <strong>{cancha.nombre}</strong>
                    <span>
                      {cancha.superficie} | {cancha.techo ? "Con techo" : "Sin techo"}
                    </span>
                  </div>
                  {hours.map((hour) => {
                    const turno = cancha.turnos.find((t) => t.hora_turno === hour)
                    const isSelected = selectedTurno?.id === turno?.id
                    const isInCarrito = turno && isTurnoInCarrito(turno.id)
                    return (
                      <button
                        key={`${cancha.id}-${hour}`}
                        className={`turno-button ${
                          !turno
                            ? "no-disponible"
                            : isInCarrito
                              ? "en-carrito"
                              : isSelected
                                ? "seleccionado"
                                : "disponible"
                        }`}
                        onClick={() => turno && !isInCarrito && toggleTurnoSeleccionado(turno)}
                        disabled={!turno || isInCarrito}
                      >
                        {!turno
                          ? "No disponible"
                          : isInCarrito
                            ? "En carrito"
                            : isSelected
                              ? "Seleccionado"
                              : "Disponible"}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
            {selectedTurno && !isTurnoInCarrito(selectedTurno.id) && (
              <div className="confirmar-seleccion-container">
                <button className="confirmar-seleccion-button" onClick={agregarTurnoAlCarrito}>
                  Confirmar Selección
                </button>
              </div>
            )}
          </>
        )
      )}
    </div>
  )
}

export default TurnosDisponibles

