import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff, Pencil, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";

// ✅ Tipo Role con descripción opcional
type Role = { id: number; name: string; descripcion?: string };

// ✅ Tipo Funcionario con roles como array
type Funcionario = {
  id: number;
  nombre: string;
  tipo_documento: string;
  nit: string;
  telefono: string;
  email: string;
  roles?: Role[];
  password?: string;
};

export default function GestionFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [verContraseña, setVerContraseña] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState<{ tipo: "eliminar" | "actualizar" | null; id?: number }>({ tipo: null });

  const [formData, setFormData] = useState<any>({
    id: null,
    nombre: "",
    tipo_documento: "",
    nit: "",
    telefono: "",
    email: "",
    rol: "",
    password: "",
  });

  // =========================
  // 🔹 Cargar funcionarios y roles
  // =========================
  useEffect(() => {
    cargarFuncionarios();
    cargarRoles();
  }, []);

  const cargarFuncionarios = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/ListarFuncionarios");
      const data = await res.json();
      setFuncionarios(data);
    } catch (error) {
      console.error("Error al listar funcionarios:", error);
    }
  };

  const cargarRoles = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/ListarRoles");
      const data = await res.json();
      setRoles(data);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  // =========================
  // 🔹 Manejo de inputs
  // =========================
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =========================
  // 🔹 Crear funcionario
  // =========================
  const crearFuncionario = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.rol) {
      alert("Por favor seleccione un rol antes de continuar");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/CrearFuncionario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          id: null,
          nombre: "",
          tipo_documento: "",
          nit: "",
          telefono: "",
          email: "",
          password: "",
          rol: "",
        });
        setMostrarModalExito(true);
        cargarFuncionarios();
      } else {
        alert(data.message || "Error al crear funcionario");
      }
    } catch (error) {
      console.error("Error al crear funcionario:", error);
    }
  };

  // =========================
  // 🔹 Abrir modal editar
  // =========================
  const abrirEditar = (funcionario: Funcionario) => {
    setFormData({
      id: funcionario.id,
      nombre: funcionario.nombre,
      tipo_documento: funcionario.tipo_documento,
      nit: funcionario.nit,
      telefono: funcionario.telefono,
      email: funcionario.email,
      rol: funcionario.roles && funcionario.roles.length > 0 ? funcionario.roles[0].name : "",
      password: "",
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // =========================
  // 🔹 Actualizar funcionario
  // =========================
  const actualizarFuncionario = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/ActualizarFuncionario", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setModalConfirmacion({ tipo: null });
        setIsModalOpen(false);
        setMostrarModalExito(true);
        cargarFuncionarios();
      } else {
        alert(data.message || "Error al actualizar funcionario");
      }
    } catch (error) {
      console.error("Error al actualizar funcionario:", error);
    }
  };

  // =========================
  // 🔹 Eliminar funcionario
  // =========================
  const confirmarEliminar = (id: number) => setModalConfirmacion({ tipo: "eliminar", id });

  const eliminarFuncionario = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/EliminarFuncionario", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: modalConfirmacion.id }),
      });
      const data = await res.json();

      if (res.ok) {
        setModalConfirmacion({ tipo: null });
        setMostrarModalExito(true);
        cargarFuncionarios();
      } else {
        alert(data.message || "Error al eliminar funcionario");
      }
    } catch (error) {
      console.error("Error al eliminar funcionario:", error);
    }
  };

  const tiposDocumentoMap: Record<string, string> = {
    CC: "Cédula de ciudadanía",
    TI: "Tarjeta de identidad",
    CE: "Cédula de extranjería",
  };

  // =========================
  // 🔹 Render principal
  // =========================
  return (
    <div className="w-[95%] mx-auto bg-white p-6 rounded-2xl shadow">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full border border-gray-200">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Funcionarios</h1>
          <button
            onClick={() => {
              setFormData({
                id: null,
                nombre: "",
                tipo_documento: "",
                nit: "",
                telefono: "",
                email: "",
                rol: "",
                password: "",
              });
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="bg-[#008658] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Nuevo Funcionario
          </button>
        </div>

        {/* Tabla de funcionarios */}
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Tipo Documento</th>
              <th className="p-2">Nit</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Rol</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.length > 0 ? (
              funcionarios.map((f) => (
                <tr key={f.id} className="border-b text-center">
                  <td>{f.id}</td>
                  <td>{f.nombre}</td>
                  <td>{tiposDocumentoMap[f.tipo_documento] || f.tipo_documento}</td>
                  <td>{f.nit}</td>
                  <td>{f.telefono}</td>
                  <td>{f.email}</td>
                  <td>
                    {f.roles && f.roles.length > 0
                      ? f.roles.map((r) => r.name).join(", ")
                      : "Sin rol"}
                  </td>
                  <td className="flex justify-center gap-4 py-2">
                    <button onClick={() => abrirEditar(f)} className="text-black hover:text-blue-700">
                      <Pencil size={20} />
                    </button>
                    <button onClick={() => confirmarEliminar(f.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 p-4">
                  No hay funcionarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal crear/editar */}
      {isModalOpen && (
        <ModalEmpleado
          titulo={isEditing ? "Editar Funcionario" : "Nuevo Funcionario"}
          formData={formData}
          handleChange={handleChange}
          cerrar={() => setIsModalOpen(false)}
          handleSubmit={(e) => {
            e.preventDefault();
            isEditing
              ? setModalConfirmacion({ tipo: "actualizar" })
              : crearFuncionario(e);
          }}
          roles={roles}
          verContraseña={verContraseña}
          setVerContraseña={setVerContraseña}
        />
      )}

      {modalConfirmacion.tipo && (
        <ModalConfirmacion
          tipo={modalConfirmacion.tipo}
          confirmar={modalConfirmacion.tipo === "eliminar" ? eliminarFuncionario : actualizarFuncionario}
          cancelar={() => setModalConfirmacion({ tipo: null })}
        />
      )}

      {mostrarModalExito && <ModalExito cerrarModal={() => setMostrarModalExito(false)} />}
    </div>
  );
}

// =============================
// 🔹 MODAL DE FUNCIONARIO
// =============================
const ModalEmpleado = ({
  titulo,
  formData,
  handleChange,
  cerrar,
  handleSubmit,
  roles,
  verContraseña,
  setVerContraseña,
}: {
  titulo: string;
  formData: any;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  cerrar: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  roles: Role[];
  verContraseña: boolean;
  setVerContraseña: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">{titulo}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
          required
        />
        <select
          name="tipo_documento"
          value={formData.tipo_documento}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
          required
        >
          <option value="">Seleccione tipo de documento</option>
          <option value="CC">Cédula de ciudadanía</option>
          <option value="TI">Tarjeta de identidad</option>
          <option value="CE">Cédula de extranjería</option>
        </select>
        <input
          type="text"
          name="nit"
          placeholder="Número de documento"
          value={formData.nit}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
        />

        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un rol</option>
          {roles.map((rol: Role) => (
            <option key={rol.id} value={rol.name}>
              {rol.name}
            </option>
          ))}
        </select>

        {!formData.id && (
          <div className="relative">
            <input
              type={verContraseña ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setVerContraseña(!verContraseña)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {verContraseña ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-4">
          <button type="button" onClick={cerrar} className="px-4 py-2 border border-gray-400 rounded">
            Cancelar
          </button>
          <button type="submit" className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-green-700">
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
);

// =============================
// 🔹 MODALES REUTILIZABLES
// =============================
const ModalConfirmacion = ({ tipo, confirmar, cancelar }: any) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
      <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-2">
        {tipo === "eliminar" ? "¿Deseas eliminar este funcionario?" : "¿Deseas actualizar este funcionario?"}
      </h3>
      <div className="flex justify-center gap-4 mt-4">
        <button onClick={confirmar} className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-green-700">
          Confirmar
        </button>
        <button onClick={cancelar} className="border border-gray-400 px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </div>
  </div>
);

const ModalExito = ({ cerrarModal }: any) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center">
      <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-2">¡Éxito!</h3>
      <p className="mb-4">El funcionario se ha procesado correctamente.</p>
      <button onClick={cerrarModal} className="bg-[#008658] text-white px-4 py-2 rounded hover:bg-green-700">
        Aceptar
      </button>
    </div>
  </div>
);
