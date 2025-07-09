import { useMyLawyerProfile } from "../hooks/useMyLawyerProfile";
import { useToggleLawyerVisibility } from "../hooks/useToggleLawyerVisibility";
import { Toggle } from "./Toggle";

export function PublicProfileToggle() {
  const { data: lawyer } = useMyLawyerProfile();
  const { mutate, isPending } = useToggleLawyerVisibility();

  const isVisible = lawyer?.isPublic ?? false;

  return (
    <div className="flex items-center gap-4">
      <Toggle
        checked={isVisible}
        onChange={(checked) => mutate(checked)}
        disabled={isPending}
      />
      <span className="text-sm text-gray-700">
        {isVisible ? "Perfil activo y visible públicamente" : "Perfil oculto"}
      </span>
    </div>
  );
}
