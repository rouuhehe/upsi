interface Props {
  isSubmitting: boolean;
}

export function GuideSubmitButton({ isSubmitting }: Props) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full flex items-center justify-center px-6 py-3 bg-sky-400 text-white font-medium rounded-xl shadow-md hover:bg-sky-500 transition disabled:opacity-70"
    >
      {isSubmitting ? (
        <>
          <svg
            className="animate-spin mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Publicando...
        </>
      ) : (
        <>Publicar guía</>
      )}
    </button>
  );
}
