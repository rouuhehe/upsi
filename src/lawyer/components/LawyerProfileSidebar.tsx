import { Star } from "lucide-react";
import type { LawyerResponse } from "../schemas/LawyerResponseSchema";
import type { z } from "zod";
import { LawyerRatingSummarySchema } from "../schemas/LawyerRatingSummarySchema";
import { Mail, MapPin } from "lucide-react";
import { hasCooldown } from "../../utils/contactCooldown";
import { useState } from "react";

type LawyerRatingSummary = z.infer<typeof LawyerRatingSummarySchema>;

export function LawyerSidebar({
  lawyer,
  summary,
  error,
}: {
  lawyer: LawyerResponse | null;
  summary: LawyerRatingSummary | null;
  error?: string | null;
}) {
  const canReview = lawyer?.id ? !hasCooldown(lawyer.id) : false;

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const handleWriteReview = () => {
    setShowReviewForm(true);
  };

  const handleSubmitReview = async () => {
    if (rating === 0 || reviewText.trim() === "") return;
    if (!lawyer?.userId) return;
  };

  return (
    <aside className="mt-11 w-full md:w-[300px] p-7 ">
      {lawyer ? (
        <>
          <div className="flex flex-col items-center">
            <img
              src="/assets/lawyer-demo.jpg"
              alt="Foto del abogado"
              className="items-center justify-center w-32 h-32 rounded-3xl object-cover mb-4"
            />
          </div>

          <div className="mb-3">
            <h3 className="font-semibold text-lg text-[var(--c-text)]/90">
              Contacto
            </h3>
            <div className="mt-1 mb-4 border-1 border-sky-400" />
            <div className="flex items-center gap-2 text-[var(--c-text)]/90 mb-1">
              <Mail className="w-4 h-4 text-sky-500" />
              <span>{lawyer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--c-text)]/90">
              <MapPin className="w-4 h-4 text-sky-500" />
              <span>
                {lawyer.province === "LIMA" ? "Lima, Perú" : "Fuera de Lima"}
              </span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">{error ?? "Cargando abogado..."}</p>
      )}

      <div>
        <h3 className=" font-semibold text-lg text-[var(--c-text)]/90 mb-1">
          Resumen de Reseñas
        </h3>
        <div className="mt-1 mb-4 border-1 border-sky-400" />
        {summary ? (
          <div className="flex flex-col items-center justify-center text-[var(--c-text)]/90">
            <h1 className="text-4xl font-bold mb-2">
              {summary.average === 0 ? "0.0" : summary.average.toFixed(1)}
            </h1>
            <StarRating value={summary.average} />
            <span className="text-sm mt-1 text-[var(--c-text)]/70">
              ({summary.numReviews} reseña{summary.numReviews === 1 ? "" : "s"})
            </span>
          </div>
        ) : (
          <p className="text-gray-500">Cargando...</p>
        )}
      </div>

      {canReview && !showReviewForm && (
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={handleWriteReview}
            className="text-md flex justify-center mt-4 px-4 py-2 bg-sky-500 text-white bold rounded-full  hover:bg-sky-600 transition-all"
          >
            Escribir una reseña
          </button>
        </div>
      )}

      {showReviewForm && (
        <div className=" mt-4 w-full bg-[var(--c-dropdown-bg)] border border-[var(--c-border)]/50 shadow-lg rounded-xl p-4 space-y-3 flex flex-col items-center">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  size={20}
                  className={
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }
                />
              </button>
            ))}
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="text-[var(--c-text)]/90  w-full border border-gray-300/70 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none"
            rows={4}
            placeholder="Escribe tu reseña aquí..."
          />

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setShowReviewForm(false)}
              className="text-[var(--c-text)]/90 bold text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-[var(--c-bg-hover2)]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitReview}
              disabled={rating === 0 || reviewText.trim() === ""}
              className="bold text-sm px-4 py-2 bg-sky-400 text-white rounded-full hover:bg-sky-500"
            >
              Enviar reseña
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

function StarRating({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={18}
          className={
            i <= rounded ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}
