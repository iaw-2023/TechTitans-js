import Canchas from './innecesarios/Canchas.js'
import Categorias from './categoria/Categorias.js'
import Reservas from './mis-reservas/Reservas.js'
import Navbar from './navbar/Navbar.js';
import Contacto from './contacto/Contacto.js';
/*import Carrito from './carrito/Carrito.jsx';*/
/*
cuando ande el carrito agregar: 
        <Route path="/carrito" element={<Carrito />} />
*/
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Main from './main.js';
import TurnosDisponibles from './turnos/turnosDisponibles.js';

function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/reservar" element={<Categorias />} />
        <Route path="/reservar/cat" element={<TurnosDisponibles />} />
        <Route path="/misReservas/:email" element={<Reservas />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </Router>
    
  );
  };
  
export default App;