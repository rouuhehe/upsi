import { useParams } from "react-router-dom";
import { useLawyerReview } from "../hooks/useLawyerReview";
import { useLawyerReviewList } from "../hooks/useLawyerReviewList";
import { usePublicLawyerById } from "../hooks/usePublicLawyerById";
import { Star } from "lucide-react";
import { LawyerSidebar } from "../components/LawyerProfileSidebar";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../user/hooks/useCurrentUser";
import { editLawyerDescription } from "../services/edit-lawyer-description";

export default function LawyerProfilePage() {
  const { lawyerId } = useParams<{ lawyerId: string }>();
  const { user } = useCurrentUser();

  const {
    lawyer,
    error: lawyerError,
    reloadLawyer,
  } = usePublicLawyerById(lawyerId || "");
  const { summary, reloadSummary } = useLawyerReview(lawyerId || "");
  const { reviews, error: listError } = useLawyerReviewList(lawyerId || "");

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
      {/* Sidebar */}
      <LawyerSidebar lawyer={lawyer} summary={summary} error={lawyerError} />

      <main className="flex-1 p-6 space-y-6">
        {/* Descripción */}(
        <section>
          <h2 className="text-xl font-bold mb-4">Sobre el abogado</h2>
          <p className="text-[var(--c-text)]/90 leading-relaxed">
            {editingDescription ? (
              <div className="space-y-2">
                <textarea
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  className="w-full p-2 border rounded resize-none"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      {
                        await editLawyerDescription(localDescription);
                        reloadLawyer();
                        setEditingDescription(false);
                      }
                    }}
                    className="bg-sky-500 text-white px-4 py-1 rounded hover:bg-sky-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingDescription(false)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[var(--c-text)]/90 leading-relaxed">
                {localDescription}
              </p>
            )}
          </p>
          {(lawyer?.email === user?.email || user?.roles.includes("ADMIN")) && (
            <button
              onClick={() => setEditingDescription(true)}
              className="text-sm text-sky-500 hover:underline"
            >
              Editar descripción
            </button>
          )}
        </section>
        {/* Reseñas */}
        <section>
          <h2 className="text-xl font-bold mb-4">Reseñas de otros usuarios</h2>
          {listError && <p className="text-red-500">{listError}</p>}
          {reviews.length === 0 ? (
            <p>No hay reseñas aún.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review.id} className="border p-4 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <strong>
                      {review.reviewerFirstName} {review.reviewerLastName}
                    </strong>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StarRating value={review.rating} />
                  <p className="mt-2">{review.content}</p>
                </li>
              ))}
            </ul>
          )}
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
