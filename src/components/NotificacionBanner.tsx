import React from "react";
import type { Notificacion } from "../types/Notificacion";

interface NotificacionBannerProps {
  notificaciones: Notificacion[];
  onCerrar?: (id: number) => void;
}

const NotificacionBanner: React.FC<NotificacionBannerProps> = ({ notificaciones, onCerrar }) => {
  if (!notificaciones || notificaciones.length === 0) return null;
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {notificaciones.map((n) => (
        <div
          key={n.id}
          className={`p-4 shadow-lg rounded-lg flex items-center justify-between min-w-[320px] border-l-4 ${
            n.read ? "bg-gray-100 border-gray-400" : "bg-green-100 border-green-600"
          }`}
        >
          <span>{n.message}</span>
          {onCerrar && (
            <button
              className="ml-4 text-green-700 hover:text-green-900 font-bold"
              onClick={() => onCerrar(n.id)}
              aria-label="Cerrar notificación"
            >
              X
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificacionBanner;
