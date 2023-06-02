import Canchas from './Canchas.js'
import Turnos from './Turnos.js'
import Categorias from './components/categoria/Categorias.js'
import Reservas from './Reservas.js'
import Navbar from './components/navbar/Navbar.js';
import Contacto from './Contacto';
import Carrito from './components/carrito/Carrito.js';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Main from './components/main.js';

function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/reservar" element={<Categorias />} />
        <Route path="/misReservas/:email" element={<Reservas />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </Router>
    
  );
  };
  
export default App;