import logoIndex from "../assets/LogoIndex.jpg";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Login() {
  const [verContraseña, setVerContraseña] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setVerContraseña((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del login:", loginData);
  };

  const volverInicio = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#008658] px-4">
      {/* Botón Volver */}
      <button
        onClick={volverInicio}
       className="absolute top-4 right-4 bg-[#ffffff] text-black border border-[#000000] px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition shadow"
      >
        Volver
      </button>

      {/* Formulario con fondo verde degradado y translúcido */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gradient-to-br from-[#ffffff] to-[#ffffff] backdrop-blur-md text-black rounded-2xl shadow-2xl p-8 space-y-6"
      >
       <div className="flex justify-center">
          <button
            onClick={volverInicio}
            className="focus:outline-none"
            title="Volver al inicio"
          >
            <img
              src={logoIndex}
              alt="LogoIndex"
              style={{ width: "120px", height: "120px" }}
              className="rounded-full shadow-md hover:scale-105 transition-transform"
            />
          </button>
        </div>


        <p className="text-center text-lg font-medium text-black tracking-wide">
          Bienvenido. Ingresa tus credenciales
        </p>

        <input
          type="text"
          name="email"
          placeholder="Usuario"
          className="w-full px-4 py-2 rounded-xl bg-white border border-[#008658] placeholder-black text-black focus:outline-none focus:ring-2 focus:ring-[#008658] shadow-sm"

          onChange={handleChange}
          value={loginData.email}
          required
        />

        <div className="relative w-full">
          <input
            type={verContraseña ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 rounded-xl bg-white border border-[#008658] placeholder-black text-black pr-10 focus:outline-none focus:ring-2 focus:ring-[#008658] shadow-sm"
            onChange={handleChange}
            value={loginData.password}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-100"
          >
            {verContraseña ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-[#008658] text-[#ffffff] font-semibold rounded-xl hover:bg-[#006f49] transition shadow"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default Login;
