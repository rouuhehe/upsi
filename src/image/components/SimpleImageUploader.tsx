import { User } from "lucide-react";

interface SimpleImageUploaderProps {
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-40 h-40",
};

export function SimpleImageUploader({ size = "lg" }: SimpleImageUploaderProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center shadow-lg`}
      >
        <User className="w-8 h-8 text-white" />
      </div>
      <button className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm">
        Subir Imagen
      </button>
      <p className="text-gray-500 text-xs text-center">
        Componente de prueba funcionando
      </p>
    </div>
  );
}
