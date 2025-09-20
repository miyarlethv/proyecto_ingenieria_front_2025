import { useNavigate } from "react-router-dom";
import logoIndex from "../assets/logoIndex.jpg"; 
import Perros from "../assets/Perros.jpg"; 

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

      {/* Imagen principal */}
      <main>
        <img
          src={Perros}
          alt="Imagen de mascotas"
          className="w-full h-[400px] object-cover m-0 p-0"
        />

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
      </main>
    </div>
  );
}

export default Index;
