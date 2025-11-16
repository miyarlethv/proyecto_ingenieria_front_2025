import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";
import logoIndex from "../assets/LogoIndex.jpg";
import Imagen1 from "../assets/Imagen1.jpg";
import Imagen2 from "../assets/Imagen2.jpg";
import Imagen3 from "../assets/Imagen3.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
  FaPhoneAlt,
} from "react-icons/fa";

const imagenes = [Imagen1, Imagen2, Imagen3];

interface Mascota {
  id?: number | string;
  nombre?: string;
  edad?: string;
  foto?: string | null;
  [key: string]: any;
}

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
    <div className="relative w-full h-[500px] overflow-hidden bg-gray-100">
      <Slider {...settings} className="h-full">
        {imagenes.map((img, idx) => (
          <div key={idx} className="h-[500px] w-full">
            <img
              src={img}
              alt={`slide-${idx}`}
              className="w-full h-full object-cover object-center"
              style={{ display: 'block' }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

function Index() {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginClick = () => navigate("/login");
  const handleRegistroClick = () => navigate("/registro");

  // 🔹 Llamada al backend (Laravel)
  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch("/mascotas/aleatorias");
        if (!res.ok) {
          const text = await res.text();
          console.error("Error HTTP al cargar mascotas:", res.status, text);
          setError(`Error ${res.status}: ${text}`);
          setMascotas([]);
          return;
        }
        const data = await res.json();
        console.log("Mascotas cargadas:", data);
        // Asegurarnos de que es un array
        setMascotas(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Error al cargar mascotas:", err);
        setError(err?.message || String(err));
        setMascotas([]);
      } finally {
        setLoading(false);
      }
    };

    cargar();
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
        <nav className="flex gap-3">
          <button
            onClick={handleRegistroClick}
            className="bg-white text-[#008658] border border-[#008658] px-4 py-2 rounded-xl font-medium hover:bg-[#a0a8a5] hover:text-white transition shadow"
          >
            Registrarme
          </button>
          <button
            onClick={handleLoginClick}
            className="bg-white text-[#008658] border border-[#008658] px-4 py-2 rounded-xl font-medium hover:bg-[#a0a8a5] hover:text-white transition shadow"
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
          {loading ? (
            <p className="col-span-full text-center text-gray-500">Cargando mascotas...</p>
          ) : error ? (
            <p className="col-span-full text-center text-red-500">{error}</p>
          ) : mascotas.length > 0 ? (
            mascotas.map((mascota, index) => (
              <div
                key={mascota.id ?? index}
                className="flex flex-col items-center bg-white border border-gray-300 rounded-lg p-4 shadow-md"
              >
                {mascota.foto ? (
                  <img
                    src={mascota.foto.startsWith('http') ? mascota.foto : `http://127.0.0.1:8000/storage/${mascota.foto}`}
                    alt={mascota.nombre ?? "mascota"}
                    className="w-24 h-24 object-cover mb-3 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150";
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 mb-3 rounded-full" />
                )}
                <div className="text-center w-full">
                  <p className="text-xs text-black font-medium">Nombre</p>
                  <p className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2">
                    {mascota.nombre ?? "-"}
                  </p>
                  <p className="text-xs text-black font-medium">Edad</p>
                  <p className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2">
                    {mascota.edad ?? "-"}
                  </p>
                  <button 
                    onClick={() => navigate('/registro')}
                    className="border border-green-600 px-3 py-1 text-sm hover:bg-gray-100 rounded-[10px] w-full mb-2"
                  >
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
