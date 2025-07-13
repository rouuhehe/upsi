import { useParams } from "react-router-dom";
import { useLawyerReview } from "../hooks/useLawyerReview";
import { useLawyerReviewList } from "../hooks/useLawyerReviewList";
import { usePublicLawyerById } from "../hooks/usePublicLawyerById";
import { Star } from "lucide-react";
import { LawyerSidebar } from "../components/LawyerProfileSidebar";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../user/hooks/useCurrentUser";
import { apiClient, wrap } from "../../utils/api";
import type { LawyerResponse } from "../schemas/LawyerResponseSchema";

export default function LawyerProfilePage() {
  const { lawyerId } = useParams<{ lawyerId: string }>();
  const { user } = useCurrentUser();

  const {
    lawyer,
    error: lawyerError,
    reloadLawyer,
  } = usePublicLawyerById(lawyerId || "");
  const { summary, reloadSummary } = useLawyerReview(lawyerId || "");
  const {
    reviews,
    error: listError,
    reloadReviews,
  } = useLawyerReviewList(lawyerId || "");

  const [editingDescription, setEditingDescription] = useState(false);
  const [localDescription, setLocalDescription] = useState(
    lawyer?.description ?? "Este usuario no tiene descripción",
  );

  useEffect(() => {
    if (lawyer?.description !== undefined && lawyer?.description !== null) {
      setLocalDescription(lawyer.description);
    }
  }, [lawyer?.description]);

  useEffect(() => {
    if (lawyerId) {
      reloadSummary();
    }
  }, [lawyerId, reloadSummary]);

  if (!lawyerId) return <p>Abogado no encontrado.</p>;
  return (
    <div className="flex flex-col md:flex-row min-h-screen text-[var(--c-text)]">
      <LawyerSidebar
        lawyer={lawyer}
        summary={summary}
        error={lawyerError}
        reloadReviews={() => reloadReviews(lawyerId || "")}
      />

      <main className="mt-22 flex-1 px-6 py-* space-y-3">
        <h2 className="text-2xl font-bold text-[var(--c-text)] flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          Sobre {lawyer?.firstName} {lawyer?.lastName}
        </h2>

        <section className="bg-[var(--c-dropdown-bg)] rounded-xl shadow-sm  overflow-hidden">
          <div className="p-6">
            {editingDescription ? (
              <div className="space-y-2">
                <textarea
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200"
                  rows={6}
                  placeholder="Describe tu experiencia, especialidades y enfoque profesional..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      {
                        await wrap<LawyerResponse>(
                          apiClient.editCurrentUserLawyerDescription({
                            query: { newDescription: localDescription },
                          }),
                        );
                        reloadLawyer(lawyerId);
                        setEditingDescription(false);
                      }
                    }}
                    className="bg-sky-400 text-white px-6 py-2 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    ✓ Guardar cambios
                  </button>
                  <button
                    onClick={() => setEditingDescription(false)}
                    className="px-6 py-2 text-[var(--c-text)]/70 hover:text-[var(--c-text)]/70 hover:bg-[var(--c-bg-hover2)] rounded-lg transition-all duration-200 font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[var(--c-text)]/70 leading-relaxed text-lg">
                  {localDescription}
                </p>
                {(lawyer?.email === user?.email ||
                  user?.roles.includes("ADMIN")) && (
                  <button
                    onClick={() => setEditingDescription(true)}
                    className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-500 hover:bg-[var(--c-bg-hover2)] px-3 py-2 rounded-lg transition-all duration-200 font-medium"
                  >
                    <svg
                      className="w-4 h-4"
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
                    Editar descripción
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
        {/* Reseñas */}
        <h2 className="mt-10 text-2xl font-bold text-[var(--c-text)] flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          Reseñas de otros usuarios
        </h2>

        <section className="mb-10 bg-[var(--c-dropdown-bg)] rounded-xl shadow-sm  overflow-hidden">
          <div className="p-6">
            {listError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="text-red-700 font-medium">{listError}</span>
                </div>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[var(--c-bg-hover2)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">No hay reseñas aún</p>
                <p className="text-gray-400">
                  Sé el primero en dejar una reseña
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {review.reviewerFirstName[0]}
                            {review.reviewerLastName[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {review.reviewerFirstName} {review.reviewerLastName}
                          </h4>
                          <StarRating value={review.rating} />
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                        {new Date(review.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed pl-0 sm:pl-13">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
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
