import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons"
import bosters from "../../components/imagenes/bosters.png"

const Footer = () => {
  return (
    <footer className="w-full bg-white/50 backdrop-blur-sm py-3 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0 text-center">
            <h2 className="text-lg font-bold mb-2 text-gray-800">Contacto</h2>
            <div className="space-y-1">
              <a
                className="flex items-center gap-2 hover:text-gray-600 transition-colors text-sm"
                href="https://api.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-base" aria-hidden="true" />
                <span>1977-2000-2003</span>
              </a>
              <a
                className="flex items-center gap-2 hover:text-gray-600 transition-colors text-sm"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-base" aria-hidden="true" />
                <span>reservatucancha</span>
              </a>
              <a
                className="flex items-center gap-2 hover:text-gray-600 transition-colors text-sm"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} className="text-base" aria-hidden="true" />
                <span>reservatucancha</span>
              </a>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Reserva Tu Cancha. Todos los derechos reservados.</p>
          </div>
          <div className="max-w-[150px] md:max-w-[200px]">
            <img src={bosters || "/placeholder.svg"} alt="Bosters" className="w-full h-auto object-contain" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer