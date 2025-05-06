"use client"
import "bootstrap/dist/css/bootstrap.min.css"

const ConfirmCancelModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "95%", margin: "0 auto" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmación de Cancelación</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <p className="text-center">
              Lamentablemente no podemos devolverte el dinero. ¿Está seguro de que desea cancelar la reserva?
            </p>
          </div>
          <div className="modal-footer justify-content-center">
            <button type="button" className="btn btn-secondary mx-2" onClick={onClose}>
              No
            </button>
            <button type="button" className="btn btn-danger mx-2" onClick={onConfirm}>
              Sí, cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmCancelModal
