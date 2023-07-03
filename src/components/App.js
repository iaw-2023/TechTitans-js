import Categorias from './categoria/Categorias.js'
import Navbar from './navbar/Navbar.js';
import Contacto from './contacto/Contacto.js';
import Carrito from './carrito/CarritoReservas.js';
import Reservas from './mis-reservas/Reservas.js'
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Main from './main.js';
import TurnosDisponibles from './turnos/turnosDisponibles';
import { CarritoProvider } from '../context/ShoppingCartContext';

function App() {
  
  return (
    <CarritoProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/reservar" element={<Categorias />} />
          <Route path="/reservar/dispCat/:categoriaId" element={<TurnosDisponibles />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/misReservas" element={<Reservas />} />
        </Routes>
      </Router>
      </CarritoProvider>
  );
  };
  
export default App;