"use client"

import { useState, useEffect } from "react"
import { Spinner, Button } from "react-bootstrap"

const mp = new window.MercadoPago("APP_USR-0144850f-6a77-4ee3-b6bf-390c8bbe3cf7", {
  locale: "es-AR",
})

const MercadoPagoWallet = ({
  onProcessPayment,
  procesando,
  pagoRealizado,
  buttonText = "Proceder al Pago",
  buttonSize = "lg",
  disabled = false,
}) => {
  const [walletCreated, setWalletCreated] = useState(false)

  const handlePayment = async () => {
    try {
      const preferenceId = await onProcessPayment()

      if (preferenceId) {
        // Limpiar wallet anterior si existe
        const walletContainer = document.getElementById("wallet_container")
        if (walletContainer) {
          walletContainer.innerHTML = ""
        }

        document.getElementById("wallet_spinner").style.display = "block"

        mp.bricks()
          .create("wallet", "wallet_container", {
            initialization: { preferenceId },
          })
          .then(() => {
            document.getElementById("wallet_spinner").style.display = "none"
            setWalletCreated(true)
          })
          .catch((error) => {
            document.getElementById("wallet_spinner").style.display = "none"
            console.error("Error al inicializar el Brick:", error)
          })
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error)
    }
  }

  // Limpiar wallet cuando se cierra el modal
  useEffect(() => {
    return () => {
      const walletContainer = document.getElementById("wallet_container")
      if (walletContainer) {
        walletContainer.innerHTML = ""
      }
      setWalletCreated(false)
    }
  }, [])

  return (
    <div>
      {!pagoRealizado && !walletCreated && (
        <div className="text-center mb-3">
          <Button variant="success" onClick={handlePayment} disabled={procesando || disabled} size={buttonSize}>
            {procesando ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Procesando...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </div>
      )}

      <div id="wallet_spinner" className="text-center my-3" style={{ display: "none" }}>
        <Spinner animation="border" role="status" />
        <div>Cargando botón de pago...</div>
      </div>
      <div id="wallet_container" style={{ marginTop: "20px" }}></div>
    </div>
  )
}

export default MercadoPagoWallet