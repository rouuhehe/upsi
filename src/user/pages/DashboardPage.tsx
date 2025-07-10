import { Bot, FileText, UserSearch } from "lucide-react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "../../common/components/ConfirmModal";
import { useAuthContext } from "../../auth/hooks/useAuthContext";
import { useMyLawyerProfile } from "../../lawyer/hooks/useMyLawyerProfile";
import { useToggleLawyerVisibility } from "../../lawyer/hooks/useToggleLawyerVisibility";
import { Toggle } from "../../lawyer/components/Toggle";
import { apiClient } from "../../utils/api";

const rolePriority = ["ADMIN", "LAWYER", "USER"] as const;

const roleMap: Record<(typeof rolePriority)[number], string> = {
  ADMIN: "Administrador",
  LAWYER: "Abogado",
  USER: "Usuario",
};

export default function DashboardPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useCurrentUser();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const highestRole = user?.roles.sort(
    (a, b) => rolePriority.indexOf(a) - rolePriority.indexOf(b),
  )[0];

  const finalRole = highestRole ? roleMap[highestRole] : "";
  const isLawyer = highestRole === "LAWYER";
  const { data: lawyer } = useMyLawyerProfile();
  const { mutate, isPending } = useToggleLawyerVisibility();

  return (
    <div className="flex flex-col min-h-screen bg-white text-black px-6 py-18">
      <h1 className="text-4xl font-extrabold mb-4">Bienvenido a tu Panel</h1>
      <p className="text-gray-600 text-lg mb-10">
        Aquí puedes ver tu información personal y acceder rápidamente a tus
        herramientas legales.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-sky-500 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-2">Nombre completo</h2>
          <p className="text-md">
            {user?.firstName} {user?.lastName}
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-2">Correo electrónico</h2>
          <p className="text-gray-700">{user?.email}</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-2">Rol en la plataforma</h2>
          <p className="text-gray-700">{finalRole}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <button
          onClick={() => navigate("/guides")}
          className="cursor-pointer flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg"
        >
          <FileText className="w-8 h-8 text-sky-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1">Mis Guías</h3>
          <p className="text-sm text-gray-600 text-center">
            Revisa tus guías legales guardadas o recomendadas.
          </p>
        </button>

        <button
          onClick={() => navigate("/chat")}
          className="cursor-pointer flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg"
        >
          <Bot className="w-8 h-8 text-sky-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1">Sesiones con IA</h3>
          <p className="text-sm text-gray-600 text-center">
            Consulta tus conversaciones anteriores con la IA legal.
          </p>
        </button>

        <button
          onClick={() => navigate("/lawyers")}
          className="cursor-pointer flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg"
        >
          <UserSearch className="w-8 h-8 text-sky-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1">Abogados Contactados</h3>
          <p className="text-sm text-gray-600 text-center">
            Visualiza los abogados con los que has interactuado.
          </p>
        </button>
      </div>

      {isLawyer && lawyer && (
        <div className="mt-16 flex items-center gap-4">
          <Toggle
            checked={lawyer.isPublic}
            onChange={(checked) => mutate(checked)}
            disabled={isPending}
          />
          <span className="text-sm text-gray-700">
            {lawyer.isPublic
              ? "Perfil activo y visible públicamente"
              : "Perfil oculto"}
          </span>
        </div>
      )}

      <div className="mt-16 text-center">
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-300"
        >
          Eliminar Cuenta
        </button>
      </div>

      <div className="text-white">
        {showConfirm && (
          <ConfirmModal
            message="tu cuenta permanentemente"
            onCancel={() => setShowConfirm(false)}
            onConfirm={async () => {
              await apiClient.deleteCurrentUser();
              logout();
            }}
          />
        )}
      </div>
    </div>
  );
}
