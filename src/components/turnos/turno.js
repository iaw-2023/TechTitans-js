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
  const [selectedTurnos, setSelectedTurnos] = useState([]);
  const { categoriaId } = useParams();
  const [selectedFecha, setSelectedFecha] = useState(null);
  const carritoContexto = useContext(CarritoContexto);
  const { agregarItem } = carritoContexto;

  useEffect(() => {
    const fetchTurnos = async () => {
      setLoading(true);
      try {
        const url = selectedFecha
          ? `${API}turnos/fecha/cat/${selectedFecha}/${categoriaId}`
          : `${API}turnos/dispCat/${categoriaId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error al obtener los turnos: ${response.status}`);
        }
        const data = await response.json();

        // Agrupar los turnos por cancha
        const turnosAgrupados = data.reduce((acc, turno) => {
          const canchaId = turno.cancha.id;
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
    setSelectedTurnos((prevSelected) => {
      if (prevSelected.some((t) => t.id === turno.id)) {
        return prevSelected.filter((t) => t.id !== turno.id);
      } else {
        return [...prevSelected, turno];
      }
    });
  };

  const agregarTurnosAlCarrito = () => {
    selectedTurnos.forEach((turno) => {
      agregarItem(turno.id, {
        turno_id: turno.id,
        fecha_turno: turno.fecha_turno,
        hora_turno: turno.hora_turno,
        cancha: {
          nombre: turno.cancha.nombre,
          precio: turno.cancha.precio,
          superficie: turno.cancha.superficie,
          techo: turno.cancha.techo,
          cant_jugadores: turno.cancha.cant_jugadores,
        },
      });
    });
    setSelectedTurnos([]); // Limpiar la selección después de agregar al carrito
  };

  const hours = Array.from({ length: 16 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00:00`);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Elige tu turno</h2>

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
      ) : turnosPorCancha.length === 0 ? (
        <div className="alert alert-primary text-center">No hay turnos disponibles</div>
      ) : (
        <>
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
                      const isSelected = selectedTurnos.some((t) => t.id === turno?.id);
                      return (
                        <td
                          key={`${cancha.id}-${hour}`}
                          className={`turno-cell ${
                            turno ? (isSelected ? 'selected' : 'available') : 'unavailable'
                          }`}
                          onClick={() => turno && toggleTurnoSeleccionado(turno)}
                          style={{ cursor: turno ? 'pointer' : 'default' }}
                        >
                          {turno ? (isSelected ? 'Seleccionado' : 'Disponible') : 'No disponible'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedTurnos.length > 0 && (
            <div className="text-center mt-4">
              <Button variant="success" onClick={agregarTurnosAlCarrito}>
                Agregar Turnos al Carrito ({selectedTurnos.length})
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TurnosDisponibles;
