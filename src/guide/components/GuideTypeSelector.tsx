// src/components/guides/GuideTypeSelector.tsx
import { type GuideType, GuideTypeLabels } from "../schemas/GuideTypeSchema";

interface Props {
  value: GuideType;
  onChange: (value: GuideType) => void;
}

export function GuideTypeSelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="text-[var(--c-text)]/70 block text-sm font-medium mb-2">
        Área del derecho *
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as GuideType)}
        className="w-full px-4 py-3 bg-[var(--c-bg)] border border-gray-300 text-[var(--c-text)]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
      >
        {Object.entries(GuideTypeLabels).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
