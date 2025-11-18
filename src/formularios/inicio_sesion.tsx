import logoIndex from "../assets/LogoIndex.jpg";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { apiFetch, guardarLogin } from "../api";

function Login() {
  const [verContraseña, setVerContraseña] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setVerContraseña((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Limpiar error al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      console.log("🔍 Intentando login con:", loginData.email); // Debug
      
      const response = await apiFetch("login", { // ✅ Sin slash, sin barra inicial
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      console.log("📡 Response status:", response.status); // Debug
      console.log("📡 Response headers:", response.headers); // Debug

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Credenciales incorrectas");
        setCargando(false);
        return;
      }

      console.log("✅ Login exitoso:", data);

      // 🔥 Guardar token y permisos en localStorage
      guardarLogin(data);

      // Redirigir según tipo de usuario
      if (data.tipo === "persona") {
        navigate("/bienvenidaUsuario", { 
          state: { nombre: data.nombre }, 
          replace: true 
        });
      } else if (data.tipo === "fundacion") {
        navigate("/dashboard", { 
          state: { nombre: data.nombre }, 
          replace: true 
        });
      } else if (data.tipo === "funcionario") {
        navigate("/dashboard", { 
          state: { nombre: data.nombre }, 
          replace: true 
        });
      } else {
        setError("Tipo de usuario no reconocido");
        setCargando(false);
      }
    } catch (error: any) {
      console.error("❌ Error en login:", error);
      setError("Error al conectar con el servidor. Intenta de nuevo.");
      setCargando(false);
    }
  };

  const volverInicio = () => {
    navigate("/");
  };

  const recuperarContraseña = () => {
    navigate("/recuperar-contraseña");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEEEEE] px-4">
      {/* Botón Volver */}
      <button
        onClick={volverInicio}
        className="absolute top-4 right-4 bg-[#008658] text-white border border-[#008658] px-4 py-2 rounded-xl font-medium hover:bg-[#006f49] transition shadow"
      >
        Volver
      </button>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gradient-to-br from-[#ffffff] to-[#ffffff] backdrop-blur-md text-black rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <div className="flex justify-center">
          <button
            type="button"
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

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="w-full px-4 py-2 rounded-xl bg-white border border-[#008658] placeholder-black text-black focus:outline-none focus:ring-2 focus:ring-[#008658] shadow-sm"
          onChange={handleChange}
          value={loginData.email}
          required
          disabled={cargando}
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
            disabled={cargando}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#008658] hover:text-[#006f49]"
            disabled={cargando}
          >
            {verContraseña ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Enlace recuperar contraseña */}
        {/* <div className="text-right">
          <button
            type="button"
            onClick={recuperarContraseña}
            className="text-sm text-[#008658] hover:underline"
            disabled={cargando}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div> */}

        <button
          type="submit"
          className="w-full py-2 bg-[#008658] text-[#ffffff] font-semibold rounded-xl hover:bg-[#006f49] transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={cargando}
        >
          {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}

export default Login;