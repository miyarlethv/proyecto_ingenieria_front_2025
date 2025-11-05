import { useNavigate } from "react-router-dom";
import logoIndex from "../assets/LogoIndex.jpg";
import Perros from "../assets/Perros.jpg";
import Imagen1 from "../assets/Imagen1.jpg";
import Imagen2 from "../assets/Imagen2.jpg";
import Imagen3 from "../assets/Imagen3.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const imagenes = [Imagen1, Imagen2, Imagen3, Perros];

function Carrusel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
  };

  return (
   <div className="relative w-full h-[25vh] sm:h-[30vh] md:h-[45vh] lg:h-[55vh] xl:h-[60vh] overflow-hidden">
  <Slider {...settings}>
    {imagenes.map((img, idx) => (
      <div
        key={idx}
        className="flex justify-center items-center w-full h-full overflow-hidden"
      >
        <img
          src={img}
          alt={`slide-${idx}`}
          className="w-full h-full object-contain object-center"
        />
      </div>
    ))}
  </Slider>

  <style>
    {`
      .slick-prev, .slick-next {
        position: absolute !important;
        top: 50% !important;
        transform: translateY(-50%);
        z-index: 10;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        width: 40px;
        height: 40px;
      }
      .slick-prev:hover, .slick-next:hover {
        background: rgba(255, 255, 255, 1);
      }
      .slick-prev:before, .slick-next:before {
        color: #000 !important;
        font-size: 24px !important;
        opacity: 1 !important;
      }
      .slick-prev { left: 20px !important; }
      .slick-next { right: 20px !important; }
    `}
  </style>
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
          <h1 className="text-lg font-bold text-white">
            ADOPTA CLUB PÚRPURA
          </h1>
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

      {/* Carrusel de imágenes */}
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
