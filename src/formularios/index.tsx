import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoIndex from "../assets/LogoIndex.jpg";
import Imagen1 from "../assets/Imagen1.jpg";
import Imagen2 from "../assets/Imagen2.jpg";
import Imagen3 from "../assets/Imagen3.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {FaInstagram,FaFacebook,FaTiktok,FaYoutube,FaWhatsapp,FaPhoneAlt,} 
from "react-icons/fa";

const imagenes = [Imagen1, Imagen2, Imagen3];

function Carrusel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
  };

  return (
    <div className="relative w-full aspect-[16/7] overflow-hidden">
      <Slider {...settings}>
        {imagenes.map((img, idx) => (
          <div
            key={idx}
            className="flex justify-center items-center w-full h-full overflow-hidden"
          >
            <img
              src={img}
              alt={`slide-${idx}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

function Index() {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState([]);

  const handleLoginClick = () => navigate("/login");
  const handleRegistroClick = () => navigate("/registro");

  // 🔹 Llamada al backend (Laravel)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/mascotas/aleatorias") // Ajusta la URL si tu backend usa otro puerto o ruta
      .then((res) => res.json())
      .then((data) => {setMascotas(data); console.log(data);
      })
      .catch((err) => console.error("Error al cargar mascotas:", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <header className="bg-[#008658] flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src={logoIndex} alt="Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-lg sm:text-xl font-bold text-white">
            ADOPTA CLUB PÚRPURA
          </h1>
        </div>
        <nav className="flex gap-2">
          <button
            onClick={handleRegistroClick}
            className="bg-white text-black border border-black rounded px-3 py-1 hover:bg-gray-100 transition"
          >
            Registrarme
          </button>
          <button
            onClick={handleLoginClick}
            className="bg-white text-black border border-black rounded px-3 py-1 hover:bg-gray-100 transition"
          >
            Iniciar Sesión
          </button>
        </nav>
      </header>

      {/* CARRUSEL */}
      <Carrusel />

      {/* SECCIÓN MASCOTAS */}
      <section className="py-10 bg-white">
        <h2 className="text-center text-2xl font-bold text-[#008658] mb-8">
          Mascotas en Adopción
        </h2>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {mascotas.length > 0 ? (
            mascotas.map((mascota) => (
              <div
                key={mascota.id}
                className="flex flex-col items-center p-3 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="w-28 h-28 rounded-full bg-gray-200 mb-3 overflow-hidden border border-gray-300">
                  <img
                    src={
                      mascota.nombre
                        ? "http://127.0.0.1:8000/api/storage/${mascota.foto}"
                        : "https://via.placeholder.com/150"
                    }
                    alt={mascota.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center w-full">
                  <p className="border border-black px-2 py-1 mb-1 text-sm font-semibold">
                    {mascota.nombre}
                  </p>
                  <p className="border border-black px-2 py-1 mb-1 text-sm">
                    {mascota.edad}
                  </p>
                  <button className="border border-black px-2 py-1 text-sm hover:bg-gray-100">
                    Ver más..
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No hay mascotas disponibles por ahora.
            </p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#008658] text-white py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center font-bold text-2xl mb-6">Contáctanos</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            {/* Columna izquierda */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <FaPhoneAlt />
                <p>3176222122</p>
              </div>
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-green-400" />
                <p>(+57) 3176222122</p>
              </div>
              <div className="flex items-center gap-2">
                <FaFacebook className="text-blue-400" />
                <p>AdoptaClubpúrpura Fcp</p>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <FaInstagram className="text-pink-400" />
                <p>@adoptaclubpurpura</p>
              </div>
              <div className="flex items-center gap-2">
                <FaYoutube className="text-red-500" />
                <p>@adoptaclubpurpura1861</p>
              </div>
              <div className="flex items-center gap-2">
                <FaTiktok className="text-white" />
                <p>@adoptaclubpurpura</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;
