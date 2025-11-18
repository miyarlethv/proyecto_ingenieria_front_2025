import { AlertTriangle, X } from "lucide-react";

interface ModalErrorProps {
  mostrar: boolean;
  titulo?: string;
  mensaje: string;
  onCerrar: () => void;
}

function ModalError({ mostrar, titulo = "Error", mensaje, onCerrar }: ModalErrorProps) {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={24} className="text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">{titulo}</h3>
          </div>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6 whitespace-pre-line">{mensaje}</p>
        <div className="flex justify-end">
          <button
            onClick={onCerrar}
            className="bg-[#008658] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalError;
