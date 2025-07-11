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
import { ProfileImageUploader } from "../../image/components/ProfileImageUploader";

const rolePriority = ["ADMIN", "LAWYER", "USER"] as const;

const roleMap: Record<(typeof rolePriority)[number], string> = {
  ADMIN: "Administrador",
  LAWYER: "Abogado",
  USER: "Usuario",
};

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[var(--c-bg-soft)] border border-[var(--c-border)] p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-1 text-[var(--c-text)]">
        {title}
      </h2>
      <p className="text-md text-[var(--c-text)]/70">{value}</p>
    </div>
  );
}

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
    <div className="flex flex-col min-h-screen bg-[var(--c-bg)] text-[var(--c-text)] px-6 py-18">
      <div className="mt-3 flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-10">
        <div className="flex-1 lg:pr-8">
          <h1 className="text-4xl lg:text-5xl font-semibold mb-4 text-[var(--c-text)]">
            Bienvenido a tu Panel
          </h1>
          <p className="text-[var(--c-text)]/70 text-lg lg:text-xl">
            Aquí puedes ver tu información personal y acceder rápidamente a tus
            herramientas legales.
          </p>
        </div>

        <div className="w-full flex justify-center lg:justify-end lg:w-auto lg:flex-shrink-0">
          <div className="relative flex flex-col items-center gap-4 group text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-[var(--c-bg-soft)] border-2 border-[var(--c-border)] rounded-full p-1 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <ProfileImageUploader
                  size="xl"
                  onImageChange={(url) => {
                    console.log("Imagen de perfil actualizada:", url);
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-sky-500 rounded-full border-2 border-[var(--c-bg)] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-[var(--c-text)] group-hover:text-sky-500 transition-colors duration-200">
                Foto de perfil
              </h3>
              <p className="text-sm text-[var(--c-text)]/60 group-hover:text-[var(--c-text)]/80 transition-colors duration-200 max-w-xs">
                Haz clic sobre la imagen para cambiarla
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <InfoCard
          title="Nombre completo"
          value={`${user?.firstName} ${user?.lastName}`}
        />
        <InfoCard title="Correo electrónico" value={user?.email ?? ""} />
        <InfoCard title="Rol en la plataforma" value={finalRole} />
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
        <div className="mt-16 bg-[var(--c-bg-soft)] border border-[var(--c-border)] rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <Toggle
            checked={lawyer.isPublic}
            onChange={(checked) => mutate(checked)}
            disabled={isPending}
          />
          <span className="text-sm text-[var(--c-text)]/80">
            {lawyer.isPublic
              ? "Tu perfil está activo y visible públicamente."
              : "Tu perfil está oculto. Los usuarios no pueden verlo."}
          </span>
        </div>
      )}

      <div className="mt-20 text-center">
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transition-all duration-300"
        >
          Eliminar cuenta
        </button>
      </div>

      <div className="text-[var(--c-text)]">
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
{
  /*         <div className="flex flex-col items-center gap-4"> */
}
{
  /*           <h3 className="text-lg font-semibold text-[var(--c-text)]"> */
}
{
  /*             Foto de Perfil */
}
{
  /*           </h3> */
}
{
  /*           <ProfileImageUploader */
}
{
  /*             size="lg" */
}
{
  /*             onImageChange={(url) => { */
}
{
  /*               console.log("Imagen de perfil actualizada:", url); */
}
{
  /*             }} */
}
{
  /*           /> */
}
{
  /*         </div> */
}
{
  /*       </div> */
}
{
  /**/
}
{
  /*       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"> */
}
{
  /*         <div className="bg-sky-500 text-white p-6 rounded-2xl shadow-lg"> */
}
{
  /*           <h2 className="text-xl font-bold mb-2">Nombre completo</h2> */
}
{
  /*           <p className="text-md"> */
}
{
  /*             {user?.firstName} {user?.lastName} */
}
{
  /*           </p> */
}
{
  /*         </div> */
}
{
  /**/
}
{
  /*         <div className="bg-[var(--c-bg-soft)] border border-[var(--c-border)] p-6 rounded-2xl shadow-lg"> */
}
{
  /*           <h2 className="text-xl font-bold mb-2 text-[var(--c-text)]"> */
}
{
  /*             Correo electrónico */
}
{
  /*           </h2> */
}
{
  /*           <p className="text-[var(--c-text)]/70">{user?.email}</p> */
}
{
  /*         </div> */
}
{
  /**/
}
{
  /*         <div className="bg-[var(--c-bg-soft)] border border-[var(--c-border)] p-6 rounded-2xl shadow-lg"> */
}
{
  /*           <h2 className="text-xl font-bold mb-2 text-[var(--c-text)]"> */
}
{
  /*             Rol en la plataforma */
}
{
  /*           </h2> */
}
{
  /*           <p className="text-[var(--c-text)]/70">{finalRole}</p> */
}
{
  /*         </div> */
}
{
  /*       </div> */
}
{
  /**/
}
{
  /*       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> */
}
{
  /*         <button */
}
{
  /*           onClick={() => navigate("/guides")} */
}
{
  /*           className="cursor-pointer flex flex-col items-center bg-[var(--c-bg-soft)] border border-[var(--c-border)] p-6 rounded-2xl shadow-lg hover:bg-[var(--c-bg-hover)] transition-colors" */
}
{
  /*         > */
}
{
  /*           <FileText className="w-8 h-8 text-sky-500 mb-2" /> */
}
{
  /*           <h3 className="font-semibold text-lg mb-1 text-[var(--c-text)]"> */
}
{
  /*             Mis Guías */
}
{
  /*           </h3> */
}
{
  /*           <p className="text-sm text-[var(--c-text)]/60 text-center"> */
}
{
  /*             Revisa tus guías legales guardadas o recomendadas. */
}
{
  /*           </p> */
}
{
  /*         </button> */
}
{
  /**/
}
{
  /*         <button */
}
{
  /*           onClick={() => navigate("/chat")} */
}
{
  /*           className="cursor-pointer flex flex-col items-center bg-[var(--c-bg-soft)] border border-[var(--c-border)] p-6 rounded-2xl shadow-lg hover:bg-[var(--c-bg-hover)] transition-colors" */
}
{
  /*         > */
}
{
  /*           <Bot className="w-8 h-8 text-sky-500 mb-2" /> */
}
{
  /*           <h3 className="font-semibold text-lg mb-1 text-[var(--c-text)]"> */
}
{
  /*             Sesiones con IA */
}
{
  /*           </h3> */
}
{
  /*           <p className="text-sm text-[var(--c-text)]/60 text-center"> */
}
{
  /*             Consulta tus conversaciones anteriores con la IA legal. */
}
{
  /*           </p> */
}
{
  /*         </button> */
}
{
  /**/
}
{
  /*         <button */
}
{
  /*           onClick={() => navigate("/lawyers")} */
}
{
  /*           className="cursor-pointer flex flex-col items-center bg-[var(--c-bg-soft)] border border-[var(--c-border)] p-6 rounded-2xl shadow-lg hover:bg-[var(--c-bg-hover)] transition-colors" */
}
{
  /*         > */
}
{
  /*           <UserSearch className="w-8 h-8 text-sky-500 mb-2" /> */
}
{
  /*           <h3 className="font-semibold text-lg mb-1 text-[var(--c-text)]"> */
}
{
  /*             Abogados Contactados */
}
{
  /*           </h3> */
}
{
  /*           <p className="text-sm text-[var(--c-text)]/60 text-center"> */
}
{
  /*             Visualiza los abogados con los que has interactuado. */
}
{
  /*           </p> */
}
{
  /*         </button> */
}
{
  /*       </div> */
}
{
  /**/
}
{
  /*       {isLawyer && lawyer && ( */
}
{
  /*         <div className="mt-16 flex items-center gap-4"> */
}
{
  /*           <Toggle */
}
{
  /*             checked={lawyer.isPublic} */
}
{
  /*             onChange={(checked) => mutate(checked)} */
}
{
  /*             disabled={isPending} */
}
{
  /*           /> */
}
{
  /*           <span className="text-sm text-[var(--c-text)]/70"> */
}
{
  /*             {lawyer.isPublic */
}
{
  /*               ? "Perfil activo y visible públicamente" */
}
{
  /*               : "Perfil oculto"} */
}
{
  /*           </span> */
}
{
  /*         </div> */
}
{
  /*       )} */
}
{
  /**/
}
{
  /*       <div className="mt-16 text-center"> */
}
{
  /*         <button */
}
{
  /*           onClick={() => setShowConfirm(true)} */
}
{
  /*           className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl shadow transition duration-300" */
}
{
  /*         > */
}
{
  /*           Eliminar Cuenta */
}
{
  /*         </button> */
}
{
  /*       </div> */
}
{
  /**/
}
{
  /*       <div className="text-[var(--c-text)]"> */
}
{
  /*         {showConfirm && ( */
}
{
  /*           <ConfirmModal */
}
{
  /*             message="tu cuenta permanentemente" */
}
{
  /*             onCancel={() => setShowConfirm(false)} */
}
{
  /*             onConfirm={async () => { */
}
{
  /*               await apiClient.deleteCurrentUser(); */
}
{
  /*               logout(); */
}
{
  /*             }} */
}
{
  /*           /> */
}
{
  /*         )} */
}
{
  /*       </div> */
}
{
  /*     </div> */
}
{
  /*   ); */
}
{
  /* } */
}
