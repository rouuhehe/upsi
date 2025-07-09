// src/components/guides/GuideTitleInput.tsx
import clsx from "clsx";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function GuideTitleInput({ value, onChange, error }: Props) {
  return (
    <div className="mb-6">
      <label
        htmlFor="guide-title"
        className="block text-sm font-medium text-[var(--c-text)]/70 mb-2"
      >
        Título de la guía *
      </label>
      <input
        id="guide-title"
        type="text"
        placeholder="Ej: Introducción al derecho penal"
        className={clsx(
          "text-[var(--c-text)] w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2",
          error
            ? "border-red-500 focus:ring-red-400"
            : "border-gray-300 focus:ring-sky-400 focus:border-transparent",
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={120}
      />
      <div className="flex justify-between mt-1 text-sm">
        <span className="text-red-500">{error}</span>
        <span className="text-gray-500">{value.length}/120 caracteres</span>
      </div>
    </div>
  );
}
