"use client"

import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons"
import { faDownload } from "@fortawesome/free-solid-svg-icons"
import bosters from "../../components/imagenes/bosters.png"

const Footer = () => {
  const [promptEvent, setPromptEvent] = useState(null)

  useEffect(() => {
    // Captura el evento 'beforeinstallprompt' para habilitar la instalación
    const handler = (event) => {
      event.preventDefault()
      setPromptEvent(event)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstallClick = () => {
    if (promptEvent) {
      promptEvent.prompt()
      promptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("PWA instalada correctamente")
        } else {
          console.log("El usuario canceló la instalación")
        }
        setPromptEvent(null)
      })
    }
  }

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

          <div className="text-center mt-2 md:mt-0 text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Reserva Tu Cancha. Todos los derechos reservados.</p>
            {promptEvent && (
              <button
                onClick={handleInstallClick}
                className="mt-3 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-full text-sm transition-colors mx-auto"
              >
                <FontAwesomeIcon icon={faDownload} className="text-sm" />
                Instalar aplicación
              </button>
            )}
          </div>

          <div className="max-w-[150px] md:max-w-[200px] mt-2 md:mt-0">
            <img src={bosters || "/placeholder.svg"} alt="Bosters" className="w-full h-auto object-contain" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer