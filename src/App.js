import Canchas from './Canchas.js'
import Turnos from './Turnos.js'
import Categorias from './Categorias'
import Reservas from './Reservas.js'
import Navbar from './components/navbar/Navbar.js';
import Contacto from './Contacto';
import Carrito from './components/carrito/Carrito.js';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';

function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/turnos" element={<Turnos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </Router>
    
  );
  };
  
export default App;
