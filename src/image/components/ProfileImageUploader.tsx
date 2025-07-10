import { Avatar } from "./Avatar";
import { useProfileImage } from "../hooks/useProfileImage";

export function ProfileImageUploader({
  onImageChange,
  size = "md",
}: {
  onImageChange?: (url: string) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const { uploadImage } = useProfileImage();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadImage(file, {
      onSuccess: (data) => {
        onImageChange?.(data.profile);
      },
    });
  }

  return (
    <label className="cursor-pointer">
      <Avatar size={size} />
      <input type="file" onChange={handleFileChange} className="hidden" />
    </label>
  );
}
