import React, { useState } from 'react';
import { API } from '../../config.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Reservas.css';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState('');

  const fetchReservas = async () => {
    try {
      setAlert('');
      const response = await fetch(API + 'reservas/misReservas/' + email);
      if (response.status === 404) {
        throw new Error('El cliente no existe');
      }
      const data = await response.json();
      setReservas(data);
      console.log(data);
    } catch (error) {
      console.error(error);
      setAlert(error.message);
      setReservas([]);

      setTimeout(() => {
        setAlert('');
      }, 3000);
    }
  };

  const handleSearch = () => {
    fetchReservas();
  };

  return (
    <div className="card-container">
      <div className="form-floating mb-3">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="floatingInput">Ingrese su mail para buscar sus reservas</label>
      </div>
      <button className="btn btn-primary" onClick={handleSearch}>
        Buscar
      </button>
      {alert && (
        <div className="alert alert-danger" role="alert">
          {alert}
        </div>
      )}
      <div className="row">
        {reservas.map((reserva, index) => (
          <div className="col-md-4 mb-4" key={reserva.id}>
            <div className="card border-primary mb-3 text-bg-dark mb-3">
              <div className="card-body" key={index}>
                <h3 className="card-title">{reserva.reserva.id}</h3>
                <p className="card-text">Cliente: {reserva.reserva.email_cliente}</p>
                <p className="card-text">
                  Fecha: {new Date(reserva.reserva.fecha_reserva).toLocaleDateString('es-AR')}
                </p>
                <p className="card-text">Hora: {reserva.reserva.hora_reserva}</p>
                <p className="card-text">
                  Precio:{' '}
                  {reserva.detalles.map((detalle, detalleIndex) => (
                    <span key={detalleIndex}>
                      {detalle.precio}
                      {detalleIndex !== reserva.detalles.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservas;
