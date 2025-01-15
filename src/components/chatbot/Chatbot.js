import React, { useState } from "react";
import "./Chatbot.css";
import { API } from "../../config.js";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch(`${API}chatbot`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            const botMessage = { sender: "bot", text: data.reply };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const botMessage = {
                sender: "bot",
                text: "Lo siento, ocurrió un error. Por favor, inténtalo de nuevo más tarde.",
            };
            setMessages((prev) => [...prev, botMessage]);
        }

        setInput("");
    };

    return (
        <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
            <div className="chatbot-header" onClick={toggleChat}>
                <span>Asistente Virtual</span>
            </div>
            {isOpen && (
                <div className="chatbot-body">
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chatbot-message ${
                                    msg.sender === "user" ? "user-message" : "bot-message"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe tu mensaje..."
                        />
                        <button onClick={handleSendMessage}>Enviar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
