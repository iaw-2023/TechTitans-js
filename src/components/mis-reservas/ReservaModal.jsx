"use client"
import "bootstrap/dist/css/bootstrap.min.css"

const ReservaModal = ({ reserva, turnos, show, onClose }) => {
  if (!reserva || !turnos) return null

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal")) {
      onClose() // Cierra el modal al hacer clic fuera del contenido
    }
  }

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr)
    fecha.setDate(fecha.getDate() + 1)
    const dia = String(fecha.getDate()).padStart(2, "0")
    const mes = String(fecha.getMonth() + 1).padStart(2, "0")
    const anio = fecha.getFullYear()
    return `${dia}/${mes}/${anio}`
  }

  return (
    <div
      className={`modal ${show ? "show" : ""}`}
      tabIndex="-1"
      style={{
        display: show ? "block" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={handleBackdropClick} // Detecta clic fuera del contenido
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalle de la Reserva #{reserva.id}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <h6>Información de la Reserva</h6>
            <ul className="list-unstyled">
              <li>
                <strong>Fecha de Reserva:</strong> {formatearFecha(reserva.fecha_reserva)}
              </li>
              <li>
                <strong>Hora de Reserva:</strong> {reserva.hora_reserva}
              </li>
              <li>
                <strong>Email del Cliente:</strong> {reserva.email_cliente}
              </li>
              <li>
                <strong>Estado:</strong> {reserva.estado}
              </li>
            </ul>

            <h6 className="mt-4">Turnos Asociados</h6>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Cancha</th>
                    <th className="d-none d-md-table-cell">Categoría</th>
                    <th className="d-none d-md-table-cell">Superficie</th>
                    <th className="d-none d-md-table-cell">Jugadores</th>
                    <th className="d-none d-md-table-cell">Techada</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {turnos.map(({ turno, cancha }, index) => (
                    <tr key={index}>
                      <td>{formatearFecha(turno.fecha_turno)}</td>
                      <td>{turno.hora_turno}</td>
                      <td>{cancha.nombre}</td>
                      <td className="d-none d-md-table-cell">{cancha.categoria?.nombre || "Sin categoría"}</td>
                      <td className="d-none d-md-table-cell">{cancha.superficie}</td>
                      <td className="d-none d-md-table-cell">{cancha.cant_jugadores}</td>
                      <td className="d-none d-md-table-cell">{cancha.techo ? "Sí" : "No"}</td>
                      <td>${cancha.precio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Información adicional para móviles */}
            <div className="d-md-none">
              <h6 className="mt-3">Detalles adicionales</h6>
              {turnos.map(({ turno, cancha }, index) => (
                <div key={`mobile-${index}`} className="card mb-3">
                  <div className="card-body">
                    <h6 className="card-title">
                      {cancha.nombre} - {formatearFecha(turno.fecha_turno)} {turno.hora_turno}
                    </h6>
                    <p className="card-text mb-1">
                      <strong>Categoría:</strong> {cancha.categoria?.nombre || "Sin categoría"}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Superficie:</strong> {cancha.superficie}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Jugadores:</strong> {cancha.cant_jugadores}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Techada:</strong> {cancha.techo ? "Sí" : "No"}
                    </p>
                    <p className="card-text">
                      <strong>Precio:</strong> ${cancha.precio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservaModal
