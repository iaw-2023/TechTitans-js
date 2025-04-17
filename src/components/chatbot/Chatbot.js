"use client"

import { useState, useEffect } from "react"
import { API } from "../../config.js"

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [showHelpBubble, setShowHelpBubble] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelpBubble(false)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setShowHelpBubble(false)
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { sender: "user", text: input }
    setMessages((prev) => [...prev, userMessage])

    try {
      const response = await fetch(`${API}chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()
      const botMessage = { sender: "bot", text: data.reply }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const botMessage = {
        sender: "bot",
        text: "Lo siento, ocurrió un error. Por favor, inténtalo de nuevo más tarde.",
      }
      setMessages((prev) => [...prev, botMessage])
    }

    setInput("")
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-full">
      {showHelpBubble && !isOpen && (
        <div className="mb-2 max-w-xs px-4 py-2 rounded-full bg-blue-600 text-white text-sm shadow animate-fade-in">
          ¿Necesitás ayuda?
        </div>
      )}

      <div
        className="bg-blue-600 text-white px-4 py-2 rounded-full text-lg shadow cursor-pointer"
        onClick={toggleChat}
      >
        {isOpen ? "✖️" : "🤖"}
      </div>

      {isOpen && (
        <div className="mt-2 bg-white rounded-xl shadow-lg w-80 max-w-[90vw] h-[400px] flex flex-col overflow-hidden animate-fade-in">
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-lg text-sm max-w-[75%] break-words ${
                  msg.sender === "user"
                    ? "bg-green-100 self-end"
                    : "bg-gray-200 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex items-center border-t p-2 gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu mensaje..."
              className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="text-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full"
              title="Enviar mensaje"
            >
              📤
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chatbot
