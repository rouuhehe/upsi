import { useState } from "react";
import { User } from "lucide-react";
import { useProfileImage } from "../hooks/useProfileImage";

interface AvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

const sizeClasses = {
  xs: "w-8 h-8",
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
};

const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

export function Avatar({
                         size = "md",
                         src,
                         alt,
                         fallback,
                         className = "",
                       }: AvatarProps) {
  const { image } = useProfileImage();
  const [hasError, setHasError] = useState(false);

  const imageUrl = src || image?.profile || "";
  const altText = alt || image?.altText || "Avatar";

  const shouldShowImage = imageUrl && !hasError;

  return (
      <div
          className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}
      >
        {shouldShowImage ? (
            <img
                src={imageUrl}
                alt={altText}
                loading="lazy"
                className={`${sizeClasses[size]} object-cover`}
                onError={() => setHasError(true)}
            />
        ) : (
            <div
                className={`${sizeClasses[size]} bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-white font-semibold`}
            >
              {fallback ? (
                  <span
                      className={`${
                          size === "xs"
                              ? "text-xs"
                              : size === "sm"
                                  ? "text-sm"
                                  : "text-base"
                      }`}
                  >
              {fallback}
            </span>
              ) : (
                  <User className={iconSizes[size]} />
              )}
            </div>
        )}
      </div>
  );
}