import './App.css';
import Canchas from './Canchas.js'
import Turnos from './Turnos.js'
import Categorias from './Categorias'
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/turnos" element={<Turnos />} />
        <Route path="/categorias" element={<Categorias />} />
      </Routes>
    </Router>
    
  );
  };
  
export default App;
