import { useState } from "react"
import futbol from "../../components/imagenes/futbol.png"
import basquet from "../../components/imagenes/basquet.png"
import tenis from "../../components/imagenes/tenis.png"
import handball from "../../components/imagenes/handball.png"
import padel from "../../components/imagenes/padel.png"

export const categorias = {
  1: "Fútbol",
  2: "Tenis",
  3: "Básquet",
  4: "Pádel",
  5: "Handball",
}

const Categoria = () => {
  const imagenes = [
    { nombre: futbol, link: "/1", id: 1 },
    { nombre: tenis, link: "/2", id: 2 },
    { nombre: basquet, link: "/3", id: 3 },
    { nombre: padel, link: "/4", id: 4 },
    { nombre: handball, link: "/5", id: 5 },
  ]

  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className="py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Seleccione la categoría deseada
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {imagenes.map((imagen, index) => (
          <a
            key={index}
            href={"/reservar/dispCat" + imagen.link}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="transition transform hover:scale-105"
          >
            <img
              src={imagen.nombre || "/placeholder.svg"}
              alt={`Imagen ${categorias[imagen.id]}`}
              className={`rounded-lg w-full shadow-md ${
                hoveredIndex === index ? "" : "grayscale"
              }`}
            />
          </a>
        ))}
      </div>
    </div>
  )
}

export default Categoria
