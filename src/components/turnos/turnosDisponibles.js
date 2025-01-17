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
    <div className="container mx-auto py-5 px-4">
      <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
        ¿Qué día jugamos?
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="date"
          className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={selectedFecha || ''}
          onChange={handleFechaChange}
        />
      </div>

      {loading ? (
        <div className="flex justify-center my-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : turnosPorCancha.length === 0 && selectedFecha ? (
        <div className="text-center text-lg text-blue-600">
          No hay turnos disponibles
        </div>
      ) : (
        selectedFecha && (
          <>
            <h3 className="text-center text-xl font-semibold mb-4 text-gray-700">
              Elegí cancha y horario:
            </h3>
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="min-w-full table-auto bg-white border-collapse border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="px-4 py-3 text-left rounded-tl-lg">Cancha</th>
                    {hours.map((hour) => (
                      <th key={hour} className="px-4 py-3 text-center">
                        {hour.slice(0, -3)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {turnosPorCancha.map((cancha) => (
                    <tr key={cancha.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 bg-gray-50 border border-gray-300">
                        <div className="p-4 bg-blue-100 rounded-md">
                          <strong className="block text-blue-600">
                            {cancha.nombre}
                          </strong>
                          <span className="text-gray-600 text-sm">
                            {cancha.superficie} |{' '}
                            {cancha.techo ? 'Con techo' : 'Sin techo'}
                          </span>
                        </div>
                      </td>
                      {hours.map((hour) => {
                        const turno = cancha.turnos.find((t) => t.hora_turno === hour);
                        const isSelected = selectedTurno?.id === turno?.id;
                        const isInCarrito = turno && isTurnoInCarrito(turno.id);
                        return (
                          <td
                            key={`${cancha.id}-${hour}`}
                            className={`px-4 py-2 text-center border ${
                              turno
                                ? isInCarrito
                                  ? 'bg-green-200 text-green-800'
                                  : isSelected
                                  ? 'bg-blue-200 text-blue-800'
                                  : 'bg-gray-100 text-gray-800 hover:bg-blue-50'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                            onClick={() => turno && !isInCarrito && toggleTurnoSeleccionado(turno)}
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
                <button
                  className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-colors"
                  onClick={agregarTurnoAlCarrito}
                >
                  Confirmar Selección
                </button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default TurnosDisponibles;
