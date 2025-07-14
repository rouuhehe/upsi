import { X, Star, Mail, MapPin, Pencil, BriefcaseBusiness } from "lucide-react";
import { createPortal } from "react-dom";
import { useState } from "react";
import type { z } from "zod";
import type { LawyerResponse } from "../schemas/LawyerResponseSchema";
import { LawyerRatingSummarySchema } from "../schemas/LawyerRatingSummarySchema";
import { hasCooldown } from "../../utils/contactCooldown";
import { apiClient, wrap } from "../../utils/api";

type LawyerRatingSummary = z.infer<typeof LawyerRatingSummarySchema>;

export function LawyerSidebar({
                                lawyer,
                                summary,
                                error,
                                reloadReviews,
                              }: {
  lawyer: LawyerResponse | null;
  summary: LawyerRatingSummary | null;
  error?: string | null;
  reloadReviews: () => void;
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

    const result = await wrap(
        apiClient.createLawyerReview({
          body: { content: reviewText.trim(), rating },
          params: { lawyerId: lawyer.id },
        }),
    );

    if (result.isOk()) {
      alert("Reseña enviada con éxito");
      setShowReviewForm(false);
      setRating(0);
      setReviewText("");
      reloadReviews();
    } else {
      console.error(result.error);
      alert(result.error.message || "No se pudo enviar la reseña");
    }
  };

  return (
      <>
        <aside className="mt-11 w-full md:w-[300px] p-7 md:sticky md:top-18 self-start">
          {lawyer ? (
              <>
                <div className="flex flex-col items-center">
                  <img
                      src={lawyer.imageURL ?? "/assets/lawyer-demo.jpg"}
                      alt="Foto del abogado"
                      className="items-center justify-center w-32 h-32 rounded-3xl object-cover mb-4"
                  />
                </div>

                <div className="mt-6 mb-4">
                  <h3 className="font-semibold text-lg text-[var(--c-text)]/90">
                    Contacto
                  </h3>
                  <div className="mt-1 mb-4 border-1 border-sky-400" />
                  <div className="flex items-center gap-2 text-[var(--c-text)]/90 mb-1">
                    <Mail className="w-4 h-4 text-[var(--c-text)]" />
                    <span>{lawyer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--c-text)]/90">
                    <MapPin className="w-4 h-4 text-[var(--c-text)]" />
                    <span>
                  {lawyer.province === "LIMA" ? "Lima, Perú" : "Fuera de Lima"}
                </span>
                  </div>
                </div>

                  <div className="mt-8 mb-4">
                      <h3 className="font-semibold text-lg text-[var(--c-text)]/90">
                          Perfil profesional
                      </h3>
                      <div className="mt-1 mb-4 border-1 border-sky-400" />
                      <div className="flex items-center gap-2 text-[var(--c-text)]/90 mb-1">
                          <BriefcaseBusiness className="w-4 h-4 text-[var(--c-text)]" />
                          <span>{lawyer.yearExperience} años de experiencia</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--c-text)]/90">
                          <p> S/. </p>
                          <span>{lawyer.contactPrice} por consulta</span>
                      </div>
                  </div>
              </>
          ) : (
              <p className="text-gray-500">{error ?? "Cargando abogado..."}</p>
          )}

          <div>
            <h3 className="font-semibold text-lg text-[var(--c-text)]/90 mt-8 mb-1">
              Resumen de Reseñas
            </h3>
            <div className="mt-1 mb-4 border-1 border-sky-400" />
            {summary ? (
                <div className="flex flex-col items-center justify-center text-[var(--c-text)]/90">
                  <h1 className="text-4xl font-bold mb-2 mt-2">
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

          {canReview && (
              <div className="flex flex-col items-center justify-center mt-2">
                  <button
                      onClick={(e) => {
                          const btn = e.currentTarget;
                          btn.classList.add('animate-pop');
                          setTimeout(() => btn.classList.remove('animate-pop'), 300);
                          handleWriteReview();
                      }}
                      className="cursor-pointer flex items-center justify-center gap-2 mt-4 px-3 py-1 rounded-full border text-[var(--c-text)] border-[var(--c-text)] bg-transparent transition transform hover:scale-[1.04] hover:bg-sky-500 hover:border-sky-500 hover:text-white duration-200 ease-in-out"
                  >
                      <Pencil className="w-4 h-4" />
                      <span className="font-normal text-md">Escribir una reseña</span>
                  </button>
              </div>
          )}
        </aside>

        {showReviewForm && (
            <ReviewModal
                rating={rating}
                setRating={setRating}
                reviewText={reviewText}
                setReviewText={setReviewText}
                onClose={() => setShowReviewForm(false)}
                onSubmit={handleSubmitReview}
            />
        )}
      </>
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

function ReviewModal({
                       rating,
                       setRating,
                       reviewText,
                       setReviewText,
                       onClose,
                       onSubmit,
                     }: {
  rating: number;
  setRating: (v: number) => void;
  reviewText: string;
  setReviewText: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {

  const GradientDefs = () => (
      <svg width="0" height="0">
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>
        </defs>
      </svg>
  );

  return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

        <GradientDefs />

        <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
          <button
              onClick={onClose}
              className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>

          <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
            Escribe tu reseña
          </h2>

          <div className="flex justify-center gap-2 mb-5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none cursor-pointer"
                >
                  <Star
                      size={24}
                      className={star <= rating ? "text-transparent" : "text-gray-300"}
                      style={star <= rating ? { fill: "url(#starGradient)" } : {}}
                  />
                </button>
            ))}
          </div>

          <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-400"
              rows={4}
              placeholder="Comenta tu experiencia"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
                onClick={onClose}
                className="cursor-pointer px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
                onClick={onSubmit}
                disabled={rating === 0 || reviewText.trim() === ""}
                className="cursor-pointer px-4 py-2 text-sm text-white bg-sky-500 rounded-full hover:bg-sky-600 disabled:opacity-50"
            >
              Enviar reseña
            </button>
          </div>
        </div>
      </div>,
      document.body
  );
}
