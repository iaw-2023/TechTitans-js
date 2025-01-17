import React, { useEffect, useState, useContext } from 'react';
import { API } from '../../config';
import './turnosDisponibles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { CarritoContexto } from '../../context/ShoppingCartContext';

const TurnosDisponibles = () => {
  const [turnosPorCancha, setTurnosPorCancha] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const { categoriaId } = useParams();
  const [selectedFecha, setSelectedFecha] = useState(null);
  const carritoContexto = useContext(CarritoContexto);
  const { agregarItem, carrito } = carritoContexto;

  useEffect(() => {
    const fetchTurnos = async () => {
      if (!selectedFecha) {
        setTurnosPorCancha([]); // Limpiar turnos si no hay fecha seleccionada
        return;
      }

      setLoading(true);
      try {
        const url = `${API}turnos/fecha/cat/${selectedFecha}/${categoriaId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error al obtener los turnos: ${response.status}`);
        }
        const data = await response.json();

        // Agrupar los turnos por cancha
        const turnosAgrupados = data.reduce((acc, turno) => {
          const canchaId = turno.cancha?.id;
          if (!canchaId) {
            console.warn('Turno con cancha inválida:', turno);
            return acc;
          }
          if (!acc[canchaId]) {
            acc[canchaId] = {
              ...turno.cancha,
              turnos: [],
            };
          }
          acc[canchaId].turnos.push(turno);
          return acc;
        }, {});

        setTurnosPorCancha(Object.values(turnosAgrupados));
      } catch (error) {
        console.error('Error al cargar turnos:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTurnos();
  }, [categoriaId, selectedFecha]);

  const handleFechaChange = (e) => {
    setSelectedFecha(e.target.value || null);
  };

  const toggleTurnoSeleccionado = (turno) => {
    if (!turno || !turno.id) {
      console.warn('Intento de seleccionar un turno inválido:', turno);
      return;
    }

    if (selectedTurno?.id === turno.id) {
      setSelectedTurno(null); // Deseleccionar si ya está seleccionado
    } else {
      setSelectedTurno(turno); // Seleccionar un único turno
    }
  };

  const agregarTurnoAlCarrito = () => {
    if (!selectedTurno) {
      console.warn('No hay turno seleccionado para agregar al carrito');
      return;
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
    };

    console.log('Agregando turno al carrito:', turnoData);
    agregarItem(turnoData.id, turnoData);
    setSelectedTurno(null); // Limpiar la selección después de agregar al carrito
  };

  const isTurnoInCarrito = (turnoId) => {
    return carrito.some((item) => item.id === turnoId);
  };

  const hours = Array.from({ length: 16 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00:00`);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">¿Qué día jugamos?</h2>

      <div className="d-flex justify-content-center mb-4">
        <input
          type="date"
          className="form-control w-auto"
          value={selectedFecha || ''}
          onChange={handleFechaChange}
        />
      </div>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : turnosPorCancha.length === 0 && selectedFecha ? (
        <div className="alert alert-primary text-center">No hay turnos disponibles</div>
      ) : (
        selectedFecha && (
          <>
            <h3 className="text-center mb-3">Elegí cancha y horario:</h3>
            <div className="table-responsive turnos-container">
              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Cancha</th>
                    {hours.map((hour) => (
                      <th key={hour}>{hour.slice(0, -3)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {turnosPorCancha.map((cancha) => (
                    <tr key={cancha.id}>
                      <td>
                        <strong>{cancha.nombre}</strong>
                        <br />
                        <span>
                          {cancha.superficie} | {cancha.techo ? 'Con techo' : 'Sin techo'}
                        </span>
                      </td>
                      {hours.map((hour) => {
                        const turno = cancha.turnos.find((t) => t.hora_turno === hour);
                        const isSelected = selectedTurno?.id === turno?.id;
                        const isInCarrito = turno && isTurnoInCarrito(turno.id);
                        return (
                          <td
                            key={`${cancha.id}-${hour}`}
                            className={`turno-cell ${
                              turno
                                ? isInCarrito
                                  ? 'in-cart'
                                  : isSelected
                                  ? 'selected'
                                  : 'available'
                                : 'unavailable'
                            }`}
                            onClick={() => turno && !isInCarrito && toggleTurnoSeleccionado(turno)}
                            style={{ cursor: turno && !isInCarrito ? 'pointer' : 'default' }}
                          >
                            {turno
                              ? isInCarrito
                                ? 'En carrito'
                                : isSelected
                                ? 'Seleccionado'
                                : 'Disponible'
                              : 'No disponible'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedTurno && !isTurnoInCarrito(selectedTurno.id) && (
              <div className="text-center mt-4">
                <Button variant="success" onClick={agregarTurnoAlCarrito}>
                  Confirmar Selección
                </Button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default TurnosDisponibles;
