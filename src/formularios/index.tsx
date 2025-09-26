import { useNavigate } from "react-router-dom";
import logoIndex from "../assets/LogoIndex.jpg";
import Perros from "../assets/Perros.jpg";
import imagen2 from "../assets/imagen2.jpeg";
import imagen3 from "../assets/imagen3.jpeg";
import imagen4 from "../assets/imagen4.jpeg";
import imagen5 from "../assets/imagen5.jpeg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const imagenes = [imagen2, imagen3, imagen4, logoIndex, Perros, imagen5];

function Carrusel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: true // Flechas visibles
  };
  // Estilos en línea para las flechas
  const arrowStyles = `
    .slick-prev, .slick-next {
      top: 50% !important;
      transform: translateY(-50%);
      z-index: 2;
    }
    .slick-prev:before, .slick-next:before {
      color: #000 !important;
      font-size: 32px !important;
    }
    .slick-prev { left: 20px !important; }
    .slick-next { right: 20px !important; }
  `;
  return (
    <div style={{ width: "100%", height: "400px", position: "relative" }}>
      <style>{arrowStyles}</style>
      <Slider {...settings}>
        {imagenes.map((img, idx) => (
          <div key={idx}>
            <img src={img} alt={`slide-${idx}`} style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: 0 }} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

function Index() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegistroClick = () => {
    navigate("/registro");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#008658] flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img
            src={logoIndex}
            alt="Logo"
            className="w-12 h-12 rounded-full"
          />
          <h1 className="text-lg font-bold text-[#ffffff]">ADOPTA CLUB PURPURA</h1>
        </div>
        <nav className="flex gap-2">
          <button
            onClick={handleRegistroClick}
            className="bg-white text-black border border-black rounded px-2 py-1 hover:bg-gray-100 transition"
          >
            Registrarme
          </button>
          <button
            onClick={handleLoginClick}
            className="bg-white text-black border border-black rounded px-2 py-1 hover:bg-gray-100 transition"
          >
            Iniciar Sesión
          </button>
        </nav>
      </header>

      {/* Carrusel de imágenes a ancho completo y 400px de alto */}
      <Carrusel />

      {/* Sección de animales vacía */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-2" />
              <div className="text-center">
                <p className="border border-black px-2 py-1 mb-1 text-sm font-semibold">Nombre</p>
                <p className="border border-black px-2 py-1 mb-1 text-sm">Edad</p>
                <button className="border border-black px-2 py-1 text-sm hover:bg-gray-100">
                  Ver más..
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Index;