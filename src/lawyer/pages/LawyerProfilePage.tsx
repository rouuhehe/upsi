import { useParams } from "react-router-dom";
import { useLawyerReview } from "../hooks/useLawyerReview";
import { useLawyerReviewList } from "../hooks/useLawyerReviewList";
import { usePublicLawyerById } from "../hooks/usePublicLawyerById";
import { Star, GraduationCap } from "lucide-react";
import { LawyerSidebar } from "../components/LawyerProfileSidebar";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../user/hooks/useCurrentUser";
import { apiClient, wrap } from "../../utils/api";
import type { LawyerResponse } from "../schemas/LawyerResponseSchema";
import {LawyerSpecializationLabels} from "../schemas/lawyerLabels.ts";

export default function LawyerProfilePage() {
  const { lawyerId } = useParams<{ lawyerId: string }>();
  const { user } = useCurrentUser();
  const [showFullDescription, setShowFullDescription] = useState(false);

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
  const descriptionLines = localDescription.split("\n");
  const visibleLines = showFullDescription ? descriptionLines : descriptionLines.slice(0, 8);

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

  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const checkBlocked = async () => {
      if (!lawyer?.id) return;
      try {
        const contacted = (
            await wrap<boolean>(
                apiClient.hasContactedLawyer({ params: { lawyerId: lawyer.id } })
            )
        )._unsafeUnwrap();
        setIsBlocked(contacted);
      } catch (err) {
        console.error("Error verificando contacto:", err);
      }
    };
    checkBlocked();
  }, [lawyer?.id]);

  const handleSend = async () => {
    setIsSending(true);
    const result = await wrap(
        apiClient.sendLawyerContact({
          body: { subject, message },
          params: { lawyerId: lawyer!.id },
        })
    );

    if (result.isOk()) {
      alert("Correo enviado con éxito");
      setIsBlocked(true);
      setShowForm(false);
      setSubject("");
      setMessage("");
    } else {
      console.error("Error enviando:", result.error);
    }

    setIsSending(false);
  };

  const handleToggleForm = () => {
    if (isBlocked) {
      alert("Ya contactaste a este abogado. Intenta nuevamente más tarde.");
      return;
    }
    setShowForm(!showForm);
  };

  const maxChars = 400;
  const isTooLong = localDescription.length > maxChars;
  const shortDescription = localDescription.slice(0, maxChars);


  return (
    <div className="flex flex-col md:flex-row min-h-screen text-[var(--c-text)]">
      <LawyerSidebar
        lawyer={lawyer}
        summary={summary}
        error={lawyerError}
        reloadReviews={reloadReviews}
      />

      <main className="mt-22 flex-1 px-6 py-* space-y-3">
        <div className="flex flex-col md:flex-row items-baseline justify-between">
          <div>
            <div className="mt-2 flex items-center gap-2 text-4xl font-semibold text-[var(--c-text)]">
              Dr. {lawyer?.firstName} {lawyer?.lastName}
            </div>
            <div className="mt-4 mb-4">
              <h3 className="flex items-center text-[var(--c-text)]/90 font-semibold text-lg mb-2">
                <GraduationCap className="w-5 h-5 text-black mr-2" />
                Especializaciones
              </h3>

              <div className="ml-8 flex flex-wrap items-center justify-start gap-3">
                {lawyer?.specializations.map((spec) => (
                    <span
                        key={spec}
                        className="bg-blue-800 text-white text-sm font-light px-4 py-0.5 rounded-full"
                    >
                  Derecho{" "}
                      {
                        LawyerSpecializationLabels[
                            spec as keyof typeof LawyerSpecializationLabels
                            ]
                      }
                </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-[1px] rounded-xl">
              <button
                  onClick={handleToggleForm}
                  className="cursor-pointer bg-[var(--c-bg)] text-sky-500 font-semibold py-2 px-4 rounded-xl text-sm transition-all duration-200 hover:bg-gradient-to-r from-sky-400 to-blue-500 hover:text-white"
              >
                Contactar Ahora
              </button>
            </div>
            {isBlocked && (
                <span className="text-xs text-[var(--c-text)]/70 bold mt-1">
                  Espera antes de volver a contactar
                </span>
            )}
          </div>
        </div>

        {showForm && (
            <div className="bg-[var(--c-dropdown-bg)] border border-[var(--c-border)] rounded-2xl p-6 shadow-sm transition-all duration-300 mt-4">
              <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
              >
                <div>
                  <label className="block text-sm font-medium text-[var(--c-text)]/70 mb-1">
                    Asunto <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="text-[var(--c-text)] w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                      placeholder="Consulta legal sobre..."
                      required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--c-text)]/70 mb-1">
                    Mensaje <span className="text-red-500">*</span>
                  </label>
                  <textarea
                      className="text-[var(--c-text)] w-full border border-gray-300 rounded-lg p-3 pb-8 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Describe tu situación legal..."
                      required
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <button
                      type="submit"
                      disabled={isSending}
                      className="cursor-pointer border-lime-400 border-2 hover:border-lime-600 hover:text-lime-600 text-lime-500 text-md font-semibold py-2 px-4 rounded-full transition-all duration-200 flex items-center gap-2"
                  >
                    Enviar correo
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.01 21l20.99-9L2.01 3v7l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
        )}

        <h2 className="mt-8 text-2xl font-bold text-[var(--c-text)] flex items-center gap-2">
          Sobre mí
        </h2>

        <section>
          <div className="mt-4 p-1 mr-8">
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
                        reloadLawyer();
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
              <div>
                <p className="whitespace-pre-line leading-relaxed text-[var(--c-text)]/80">
                  {showFullDescription || !isTooLong
                      ? localDescription
                      : shortDescription + "..."}
                </p>
                {isTooLong && (
                    <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="cursor-pointer text-sky-400 hover:text-sky-500 text-sm underline"
                    >
                      {showFullDescription ? "Mostrar menos" : "Leer más"}
                    </button>
                )}

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
          Reseñas de clientes
        </h2>

        <section className="mb-10">
          <div className="p-2">
            {listError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="text-red-700 font-medium">{listError}</span>
                  </div>
                </div>
            )}

            {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[var(--c-bg-hover2)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">No hay reseñas aún</p>
                  <p className="text-gray-400">Sé el primero en dejar una reseña</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {reviews.map((review) => (
                      <div
                          key={review.id}
                          className="bg-[var(--c-bg)] text-[var(--c-text)] rounded-xl border border-[var(--c-border)] hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between h-full"
                      >
                        <p className="text-[var(--c-text)]/90 text-base mb-6 leading-relaxed">
                          {review.content}
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                            {review.reviewerFirstName[0]}
                            {review.reviewerLastName[0]}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[var(--c-text)]">
                              {review.reviewerFirstName} {review.reviewerLastName}
                            </p>
                            <p className="text-xs text-[var(--c-text)]/60">
                              {new Date(review.createdAt).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <StarRating value={review.rating} />
                        </div>
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
