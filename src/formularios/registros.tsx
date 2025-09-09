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

  const navigate = useNavigate();

  const togglePasswordVisibility = () => setVerContraseña(prev => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const volverInicio = () => navigate("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEEEEE] px-4">
      <button
        onClick={volverInicio}
        className="absolute top-4 right-4 bg-[#008658] text-white border border-[#008658] px-4 py-2 rounded-xl font-medium hover:bg-[#008658] transition shadow"
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
            />
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-[#008658] text-white font-semibold rounded-xl hover:bg-[#006f49] transition shadow"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}

export default RegistroFormulario;
