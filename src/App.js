import './App.css';
import Canchas from './Canchas.js'
import Turnos from './Turnos.js'
import Categorias from './Categorias'
import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';

function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/turnos" element={<Turnos />} />
        <Route path="/categorias" element={<Categorias />} />
      </Routes>
    </Router>
    
  );
  };
  
export default App;
