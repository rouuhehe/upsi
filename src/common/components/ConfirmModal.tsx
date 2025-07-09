import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal(props: ConfirmModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      props.onCancel();
    }, 150);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      props.onConfirm();
    }, 150);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible && !isClosing
          ? "backdrop-blur-md bg-black/40"
          : "backdrop-blur-none bg-black/0"
      }`}
      onClick={handleCancel}
    >
      <div
        className={`relative bg-[var(--c-bg-soft)] px-8 py-10 rounded-2xl shadow-2xl w-full max-w-md mx-4 text-center space-y-6 border border-[var(--c-border)] transition-all duration-300 ${
          isVisible && !isClosing
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <button
          onClick={handleCancel}
          className="cursor-pointer absolute top-4 right-4 p-2 rounded-full hover:bg-[var(-c-bg-hover)] transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </button>

        {/* Icono de advertencia */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[var(--c-trash-bg)] rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Título */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[var(--c-text)]">
            Confirmar Acción
          </h2>
          <p className="text-[var(--c-text)]/80 text-base leading-relaxed">
            Esta acción no se puede deshacer. ¿Confirmas que quieres borrar{" "}
            <span className="font-semibold text-[var(--c-text)]">
              {props.message}
            </span>
            ?
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <button
            onClick={handleCancel}
            className="cursor-pointer group px-6 py-3 rounded-xl font-semibold border-2 border-[var(--c-border)]/80 text-[var(--c-text)] hover:bg-[var(--c-bg-hover)]  transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="cursor-pointer group px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              Eliminar
            </span>
          </button>
        </div>

        {/* Decoración sutil */}
        <div className="absolute -top-px left-1/2 transform -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      </div>
    </div>
  );
}
