import { useState } from "react";

interface ErrorModal {
  mostrar: boolean;
  titulo?: string;
  mensaje: string;
}

export function useModalError() {
  const [modalError, setModalError] = useState<ErrorModal>({
    mostrar: false,
    titulo: "Error",
    mensaje: ""
  });

  const mostrarError = (mensaje: string, titulo: string = "Error") => {
    setModalError({
      mostrar: true,
      titulo,
      mensaje
    });
  };

  const cerrarError = () => {
    setModalError({
      mostrar: false,
      titulo: "Error",
      mensaje: ""
    });
  };

  return {
    modalError,
    mostrarError,
    cerrarError
  };
}
