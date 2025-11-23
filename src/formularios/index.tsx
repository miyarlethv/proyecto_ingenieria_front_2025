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
  FaMapMarkerAlt,
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
    autoplaySpeed: 1500, // 🔹 Cambiado a 2 segundos (2000ms)
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

  // 🔹 CONFIGURACIÓN DE REDES SOCIALES Y UBICACIÓN - CAMBIA AQUÍ ⬇️
  const redesSociales = {
    telefono: "3176222122",
    whatsapp: "573176222122",
    whatsappLink: "https://wa.me/573176222122",
    facebook: "https://www.facebook.com/share/19tskFoN6S/",
    instagram: "https://www.instagram.com/adoptaclubpurpura?igsh=M2o2Y3RndDF3czll",
    youtube: "https://youtube.com/@adoptaclubpurpura1861?si=-fAMNPRS277mgOh8",
    tiktok: "https://www.tiktok.com/@adoptaclubpurpura?_r=1&_t=ZS-91WWRVuj8vl",
    // 🔹 COORDENADAS - Clínica Veterinaria Dosquebradas
    latitud: "4.8362236",
    longitud: "-75.6679417",
    direccion: "Adopta Club Purpura- Dosquebradas",
  };

  const googleMapsUrl = `https://www.google.com/maps/place/Cl%C3%ADnica+Veterinaria+Protectora+de+Animales+-+Dosquebradas/@4.8366089,-75.6691778,17z/data=!4m15!1m8!3m7!1s0x8e38873156ee5bc3:0xcac30cc941537cab!2sCl%C3%ADnica+Veterinaria+Protectora+de+Animales+-+Dosquebradas!8m2!3d4.8362236!4d-75.6679417!10e5!16s%2Fg%2F11g6ym45cc!3m5!1s0x8e38873156ee5bc3:0xcac30cc941537cab!8m2!3d4.8362236!4d-75.6679417!16s%2Fg%2F11g6ym45cc?entry=ttu&g_ep=EgoyMDI1MTExNi4wIKXMDSoASAFQAw%3D%3D`;
  const embedMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.3!2d${redesSociales.longitud}!3d${redesSociales.latitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38873156ee5bc3%3A0xcac30cc941537cab!2sCl%C3%ADnica%20Veterinaria%20Protectora%20de%20Animales%20-%20Dosquebradas!5e0!3m2!1ses!2sco!4v1234567890123!5m2!1ses!2sco`;

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
                    onClick={() => navigate('/login')}
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

      {/* FOOTER CON 2 COLUMNAS */}
      <footer className="bg-[#008658] text-white py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 🔹 COLUMNA IZQUIERDA - CONTACTO Y REDES SOCIALES */}
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg mb-3 text-center">Contáctanos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sub-columna 1: Teléfono, WhatsApp, Facebook */}
                <div className="flex flex-col gap-2">
                  {/* Teléfono */}
                  <div className="flex items-center gap-2 text-sm">
                    <FaPhoneAlt className="text-white text-base" />
                    <p>{redesSociales.telefono}</p>
                  </div>

                  {/* WhatsApp */}
                  <a
                    href={redesSociales.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-green-300 hover:scale-105 transition-all duration-200 p-1 rounded-lg hover:bg-white/10 text-sm"
                  >
                    <FaWhatsapp className="text-white text-base" />
                    <p>(+57) {redesSociales.telefono}</p>
                  </a>

                  {/* Facebook */}
                  <a
                    href={redesSociales.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-green-300 hover:scale-105 transition-all duration-200 p-1 rounded-lg hover:bg-white/10 text-sm"
                  >
                    <FaFacebook className="text-white text-base" />
                    <p>AdoptaClubpúrpura</p>
                  </a>
                </div>

                {/* Sub-columna 2: Instagram, YouTube, TikTok */}
                <div className="flex flex-col gap-2">
                  {/* Instagram */}
                  <a
                    href={redesSociales.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-green-300 hover:scale-105 transition-all duration-200 p-1 rounded-lg hover:bg-white/10 text-sm"
                  >
                    <FaInstagram className="text-white text-base" />
                    <p>@adoptaclubpurpura</p>
                  </a>

                  {/* YouTube */}
                  <a
                    href={redesSociales.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-green-300 hover:scale-105 transition-all duration-200 p-1 rounded-lg hover:bg-white/10 text-sm"
                  >
                    <FaYoutube className="text-white text-base" />
                    <p>adoptaclubpurpura1861</p>
                  </a>

                  {/* TikTok */}
                  <a
                    href={redesSociales.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-green-300 hover:scale-105 transition-all duration-200 p-1 rounded-lg hover:bg-white/10 text-sm"
                  >
                    <FaTiktok className="text-white text-base" />
                    <p>adoptaclubpurpura</p>
                  </a>
                </div>
              </div>
            </div>

            {/* 🔹 COLUMNA DERECHA - MAPA */}
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg mb-3 text-center">Ubicación</h3>
              
              {/* Mapa */}
              <div className="relative w-full h-36 rounded-lg overflow-hidden shadow-lg border-2 border-white/30 hover:border-white transition-all duration-300">
                <iframe
                  src={embedMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Adopta Club Púrpura"
                  className="rounded-lg"
                ></iframe>
              </div>

              {/* Botón para abrir en Google Maps */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 bg-white text-[#008658] px-3 py-1.5 rounded-lg font-semibold text-xs text-center hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-1"
              >
                <FaMapMarkerAlt className="text-sm" />
                Ver en Maps
              </a>
            </div>
          </div>

          {/* 🔹 COPYRIGHT */}
          <div className="mt-6 pt-4 border-t border-white/30 text-center">
            <p className="text-xs">
              © {new Date().getFullYear()} Adopta Club Púrpura. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;