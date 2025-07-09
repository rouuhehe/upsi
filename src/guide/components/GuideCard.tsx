import { useNavigate } from "react-router-dom";
import { GuideTypeLabels } from "../constants/guideLabels";
import { useCurrentUser } from "../../user/hooks/useCurrentUser";
import type { GuideType } from "../schemas/GuideTypeSchema";
import { useMemo } from "react";

interface GuideCardProps {
  id: string;
  title: string;
  type: GuideType;
  authorId: string;
  createdAt: string;
}


const GuideCard = ({ id, title, type, createdAt }: GuideCardProps) => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const canEdit =
    user && (user.roles.includes("ADMIN") || user.roles.includes("LAWYER"));

  const formattedDate = useMemo(() => {
    return new Date(createdAt).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [createdAt]);

  const handleClick = () => {
    navigate(`/guides/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer relative bg-[var(--c-dropdown-bg)]/90 border border-[color:var(--c-border)]/60 rounded-2xl px-5 py-5 w-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] backdrop-blur-md"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold leading-6 text-[var(--c-text)] pr-4">
          {title}
        </h3>
        <div
          className={`px-3 py-1.5 text-xs font-semibold text-white rounded-full bg-sky-400`}
        >
          {GuideTypeLabels[type]}
        </div>
      </div>

      <div className="pt-3 border-t border-[color:var(--c-border)] flex justify-between items-center">
        <span className="text-sm text-[var(--c-text)]/70">
          Creado el {formattedDate}
        </span>

        {canEdit ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/guides/edit/${id}`);
            }}
            className="group/btn inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl bg-sky-400 hover:bg-sky-500 text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow hover:shadow-md"
          >
            <svg
              className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Editar</span>
          </button>
        ) : (
          <span className="text-sm text-sky-500 font-medium ">
            Leer más →
          </span>
        )}
      </div>
    </div>
  );
};

export default GuideCard;
