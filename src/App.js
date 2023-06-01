import './App.css';
import Canchas from './Canchas.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/canchas" element={<Canchas />} />
      </Routes>
    </Router>
    
  );
  };
  
export default App;
