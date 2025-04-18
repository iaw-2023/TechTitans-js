import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Categorias from "./categoria/Categorias.js"
import Navbar from "./navbar/Navbar.js"
import Footer from "./contacto/Contacto.js" // Cambiado el nombre de la importación
import Carrito from "./carrito/CarritoReservas.js"
import Reservas from "./mis-reservas/Reservas.js"
import TurnosDisponibles from "./turnos/turnosDisponibles"
import Chatbot from "./chatbot/Chatbot.js"
import { CarritoProvider } from "../context/ShoppingCartContext"
import { useAuth0 } from "@auth0/auth0-react"
import "bootstrap/dist/css/bootstrap.min.css"
import "../tailwind.css"

function App() {
  const { isAuthenticated, user } = useAuth0()

  return (
    <CarritoProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar isAuthenticated={isAuthenticated} user={user} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Categorias />} />
              <Route path="/reservar/dispCat/:categoriaId" element={<TurnosDisponibles />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/misReservas" element={<Reservas />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </CarritoProvider>
  )
}

export default App