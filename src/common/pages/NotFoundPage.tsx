import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 text-center">
      <AlertTriangle className="w-16 h-16 text-sky-500 mb-6" />
      <h1 className="text-5xl font-extrabold text-black mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Página no encontrada
      </h2>
      <p className="text-gray-600 text-md mb-8">
        Lo sentimos, la página que estás buscando no existe o fue movida.
      </p>
      <Link
        to="/"
        className="bg-sky-500 text-white px-8 py-3 rounded-full hover:bg-black hover:text-white transition duration-300"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
