interface GuideSubmitButtonProps {
  isSubmitting: boolean;
  onClick: (e: React.MouseEvent | React.FormEvent) => void;
  label: string;
}

export function GuideSubmitButton({
  isSubmitting,
  onClick,
  label,
}: GuideSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      onClick={onClick}
      className="w-full md:w-auto px-6 py-3 text-white bg-sky-400 rounded-lg shadow hover:bg-sky-500 transition"
    >
      {isSubmitting ? "Procesando..." : label}
    </button>
  );
}
