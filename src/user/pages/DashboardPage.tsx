import { Bot, FileText, UserSearch } from "lucide-react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "../../common/components/ConfirmModal";
import { deleteCurrentUser } from "../services/deleteCurrentUser";
import { useAuthContext } from "../../auth/hooks/useAuthContext";
import { useMyLawyerProfile } from "../../lawyer/hooks/useMyLawyerProfile";
import { useToggleLawyerVisibility } from "../../lawyer/hooks/useToggleLawyerVisibility";
import { Toggle } from "../../lawyer/components/Toggle";
import { ProfileImageUploader } from "../../image/components/ProfileImageUploader";

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
    (a, b) => rolePriority.indexOf(a) - rolePriority.indexOf(b)
  )[0];

  const finalRole = highestRole ? roleMap[highestRole] : "";
  const isLawyer = highestRole === "LAWYER";
  const { data: lawyer } = useMyLawyerProfile();
  const { mutate, isPending } = useToggleLawyerVisibility();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--c-bg)] text-[var(--c-text)] px-6 py-18">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-10">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold mb-4 text-[var(--c-text)]">
            Bienvenido a tu Panel
          </h1>
          <p className="text-[var(--c-text)]/70 text-lg">
            Aquí puedes ver tu información personal y acceder rápidamente a tus
            herramientas legales.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold text-[var(--c-text)]">
            Foto de Perfil
          </h3>
          <ProfileImageUploader
            size="lg"
            onImageChange={(url) => {
              console.log("Imagen de perfil actualizada:", url);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-sky-500 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-2">Nombre completo</h2>
          <p className="text-md">
            {user?.firstName} {user?.lastName}
          </p>
        </div>

        <div className="bg-[var(--c-bg-soft)] border border-[var(--c-border)] p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-[var(--c-text)]">
            Correo electrónico
          </h2>
          <p className="text-[var(--c-text)]/70">{user?.email}</p>
        </div>

        <div className="bg-[var(--c-bg-soft)] border border-[var(--c-border)] p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-[var(--c-text)]">
            Rol en la plataforma
          </h2>
          <p className="text-[var(--c-text)]/70">{finalRole}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <button
          onClick={() => navigate("/guides")}
          className="cursor-pointer flex flex-col items-center bg-[var(--c-bg-soft)] border border-[var(--c-border)] p-6 rounded-2xl shadow-lg hover:bg-[var(--c-bg-hover)] transition-colors"
        >
          <FileText className="w-8 h-8 text-sky-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1 text-[var(--c-text)]">
            Mis Guías
          </h3>
          <p className="text-sm text-[var(--c-text)]/60 text-center">
            Revisa tus guías legales guardadas o recomendadas.
          </p>
        </button>

        <button
          onClick={() => navigate("/chat")}
          className="cursor-pointer flex flex-col items-center bg-[var(--c-bg-soft)] border border-[var(--c-border)] p-6 rounded-2xl shadow-lg hover:bg-[var(--c-bg-hover)] transition-colors"
        >
          <Bot className="w-8 h-8 text-sky-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1 text-[var(--c-text)]">
            Sesiones con IA
          </h3>
          <p className="text-sm text-[var(--c-text)]/60 text-center">
            Consulta tus conversaciones anteriores con la IA legal.
          </p>
        </button>

        <button
          onClick={() => navigate("/lawyers")}
          className="cursor-pointer flex flex-col items-center bg-[var(--c-bg-soft)] border border-[var(--c-border)] p-6 rounded-2xl shadow-lg hover:bg-[var(--c-bg-hover)] transition-colors"
        >
          <UserSearch className="w-8 h-8 text-sky-500 mb-2" />
          <h3 className="font-semibold text-lg mb-1 text-[var(--c-text)]">
            Abogados Contactados
          </h3>
          <p className="text-sm text-[var(--c-text)]/60 text-center">
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
          <span className="text-sm text-[var(--c-text)]/70">
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

      <div className="text-[var(--c-text)]">
        {showConfirm && (
          <ConfirmModal
            message="tu cuenta permanentemente"
            onCancel={() => setShowConfirm(false)}
            onConfirm={async () => {
              await deleteCurrentUser();
              logout();
            }}
          />
        )}
      </div>
    </div>
  );
}
