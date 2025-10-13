import React, { useState } from "react";
import '../index.css';
import fundacionService from "./fundacionService";
import personaService from "./personaService";
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface Formulario {
  nombre: string;
  nit: string;
  telefono: string;
  email: string;
  direccion: string;
  password: string;
  slogan?: string;
  logo?: File;
}

function RegistroFormulario() {
  const [formularioElegido, setFormularioElegido] = useState<"usuario" | "fundacion">("usuario");
  const [verContraseña, setVerContraseña] = useState(false);
  const [formData, setFormData] = useState<Formulario>({
    nombre: "",
    nit: "",
    telefono: "",
    email: "",
    direccion: "",
    password: "",
  });

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error">("exito");

  const initialFormData: Formulario = {
    nombre: "",
    nit: "",
    telefono: "",
    email: "",
    direccion: "",
    password: "",
  };

  const navigate = useNavigate();

  const togglePasswordVisibility = () => setVerContraseña(prev => !prev);

  // ✅ Validaciones en tiempo real
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (["telefono", "nit"].includes(name)) {
      // Solo números y máximo 10 dígitos
      if (!/^\d{0,10}$/.test(value)) return;
    }

    if (name === "email") {
      setFormData(prev => ({ ...prev, [name]: value.trim() }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "usuario" | "fundacion";
    setFormularioElegido(value);
  };

  // ✅ Validaciones antes del envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim() ||
        !formData.nit.trim() ||
        !formData.telefono.trim() ||
        !formData.email.trim() ||
        !formData.direccion.trim() ||
        !formData.password.trim()) {
      setTipoMensaje("error");
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    if (formData.telefono.length > 10 || formData.nit.length > 10) {
      setTipoMensaje("error");
      setMensaje("El teléfono o la cédula/NIT no pueden tener más de 10 dígitos.");
      return;
    }

    if (!formData.email.includes("@")) {
      setTipoMensaje("error");
      setMensaje("El correo debe ser funcional");
      return;
    }

    if (formularioElegido === "fundacion" && !(formData.logo instanceof File)) {
      setTipoMensaje("error");
      setMensaje("Debes cargar una imagen para el logo de la fundación.");
      return;
    }

    try {
      let respuesta;

      if (formularioElegido === "usuario") {
        respuesta = await personaService.crear(formData);
      } else {
        const DatosEnviar = new FormData();
        DatosEnviar.append('nombre', formData.nombre);
        DatosEnviar.append('nit', formData.nit);
        DatosEnviar.append('telefono', formData.telefono);
        DatosEnviar.append('email', formData.email);
        DatosEnviar.append('direccion', formData.direccion);
        DatosEnviar.append('slogan', formData.slogan || '');
        DatosEnviar.append('password', formData.password);
        if (formData.logo instanceof File) DatosEnviar.append('logo', formData.logo);

        respuesta = await fundacionService.crear(DatosEnviar);
      }

      console.log("Respuesta del backend:", respuesta);
      setTipoMensaje("exito");
      setMensaje("Registro exitoso");
    } catch (error: any) {
      console.error("Error al enviar los datos:", error);
      let mensajeError = "Ocurrió un error al registrar. Intenta nuevamente.";
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          mensajeError = ` ${error.response.data.message}`;
        } else if (typeof error.response.data === 'string') {
          mensajeError = ` ${error.response.data}`;
        }
      }
      setTipoMensaje("error");
      setMensaje(mensajeError);
    }
  };

  const volverInicio = () => navigate("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEEEEE] px-4 relative">
      <button
        onClick={volverInicio}
        className="absolute top-4 right-4 bg-[#008658] text-white border border-[#008658] px-4 py-2 rounded-xl font-medium hover:bg-[#006f49] transition shadow"
      >
        Volver
      </button>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gradient-to-br from-white to-white text-black rounded-2xl shadow-2xl p-8 space-y-5"
      >
        <h2 className="text-center text-2xl font-bold text-black mb-2">Registro</h2>

        <select
          name="tipo"
          value={formularioElegido}
          onChange={handleTipoChange}
          className="w-full px-4 py-2 rounded-xl border border-[#008658] bg-white text-black shadow-sm"
        >
          <option value="usuario">Usuario</option>
          <option value="fundacion">Fundación</option>
        </select>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo o fundación"
          className="w-full px-4 py-2 rounded-xl bg-white border border-[#008658] placeholder-black text-black shadow-sm"
          onChange={handleChange}
          value={formData.nombre}
          required
        />

        <input
          type="text"
          name="nit"
          placeholder="Cédula o NIT"
          className="w-full px-4 py-2 rounded-xl bg-white border border-[#008658] placeholder-black text-black shadow-sm"
          onChange={handleChange}
          value={formData.nit}
          required
        />

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          className="w-full px-4 py-2 rounded-xl bg-white border border-[#008658] placeholder-black text-black shadow-sm"
          onChange={handleChange}
          value={formData.telefono}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          className="w-full px-4 py-2 rounded-xl bg-white border border-[#008658] placeholder-black text-black shadow-sm"
          onChange={handleChange}
          value={formData.email}
          required
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          className="w-full px-4 py-2 rounded-xl bg-white border border-[#008658] placeholder-black text-black shadow-sm"
          onChange={handleChange}
          value={formData.direccion}
          required
        />

        <div className="relative w-full">
          <input
            type={verContraseña ? 'text' : 'password'}
            name="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 rounded-xl bg-white border border-[#008658] placeholder-black text-black pr-10 shadow-sm"
            onChange={handleChange}
            value={formData.password}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#008658] hover:text-[#005e3b]"
          >
            {verContraseña ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {formularioElegido === "fundacion" && (
          <>
            <textarea
              name="slogan"
              placeholder="Eslogan de la fundación"
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#008658] placeholder-black text-black shadow-sm"
              onChange={handleChange}
              value={formData.slogan || ""}
              rows={3}
            />

            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 rounded-xl bg-white border border-[#008658] text-black shadow-sm"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-[#008658] text-white font-semibold rounded-xl hover:bg-[#006f49] transition shadow"
      >
        Registrarme
        </button>
      </form>

      {mensaje && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center space-y-4 w-80 relative">
            <button
              onClick={() => {
                setMensaje(null);
                if (tipoMensaje === "exito") {
                  setFormData({ ...initialFormData });
                }
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              aria-label="Cerrar"
              type="button"
            >
              ×
            </button>
            <p className={tipoMensaje === "exito" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {mensaje}
            </p>
            <button
              onClick={() => {
                setMensaje(null);
                if (tipoMensaje === "exito") {
                  navigate("/login");
                }
              }}
              className="bg-[#008658] text-white px-4 py-2 rounded-lg hover:bg-[#006f49] transition"
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistroFormulario;
