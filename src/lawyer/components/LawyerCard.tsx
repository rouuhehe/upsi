import type { LawyerResponse } from "../schemas/LawyerResponseSchema";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, wrap } from "../../utils/api";
import { LawyerSpecializationLabels } from "../schemas/lawyerLabels";
import { useLawyerReview } from "../hooks/useLawyerReview";

export function LawyerCard({ lawyer }: { lawyer: LawyerResponse }) {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();
  const { summary } = useLawyerReview(lawyer.id);

  const goToProfile = () => {
    navigate(`/lawyers/${lawyer.id}`);
  };

  useEffect(() => {
    const checkBlocked = async () => {
      try {
        const contacted = (
          await wrap<boolean>(
            apiClient.hasContactedLawyer({ params: { lawyerId: lawyer.id } }),
          )
        )._unsafeUnwrap();
        setIsBlocked(contacted);
      } catch (err) {
        console.error("Error verificando contacto:", err);
      }
    };

    checkBlocked();
  }, [lawyer.id]);

  const handleSend = async () => {
    setIsSending(true);

    const result = await wrap(
      apiClient.sendLawyerContact({
        body: { subject, message },
        params: { lawyerId: lawyer.id },
      }),
    );

    if (result.isOk()) {
      alert("Correo enviado con éxito");
      setIsBlocked(true);
      setShowForm(false);
      setSubject("");
      setMessage("");
    } else {
      console.error("Error sending email:", result.error);
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

  return (
    <div className="space-y-4">
      <div
        onClick={goToProfile}
        className="cursor-pointer bg-[var(--c-bg-soft)] rounded-2xl p-6 border  border-[var(--c-border)]/50  hover:shadow-md transition-all duration-300 group-hover:bg-[var(--c-bg)] ... flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className="w-25 h-25 rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center">
            {lawyer.imageURL ? (
              <img
                src={lawyer.imageURL}
                alt={`Foto de ${lawyer.firstName} ${lawyer.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-xl">
                {lawyer.firstName[0]}

                {lawyer.lastName[0]}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-[var(--c-text)]/90 group-hover:text-sky-400 transition-colors">
              {lawyer.firstName} {lawyer.lastName}
            </h2>
            
            <p className="text-sm text-sky-400 font-medium">
              {lawyer.specializations
                .map(
                  (spec) =>
                    LawyerSpecializationLabels[
                      spec as keyof typeof LawyerSpecializationLabels
                    ],
                )
                .join(", ")}
            </p>
            <p className="text-sm font-semibold text-[var(--c-text)]/90 mt-1">
              {lawyer.province === "LIMA" ? "Lima Metropolitana" : "Fuera de Lima"}
            </p>
            <p className="text-sm font-bold text-[var(--c-text)]/90 mt-1">
              S/.{lawyer.contactPrice} por consulta
            </p>
            
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-[var(--c-text)] text-sm font-semibold">
          
          <span>{summary?.average?.toFixed(1) ?? "Sin calificación"}</span>
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.951c.3.92-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.198-1.539-1.119l1.287-3.95a1 1 0 00-.364-1.118L2.075 9.377c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.95z" />
          </svg>
          
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleForm();
          }}
          className="hover:border-sky-500 mb-1 hover:bg-sky-200/10 border-2 border-sky-400 text-sky-400 font-semibold py-2 px-4 rounded-xl transition-all duration-200 text-sm"
        >
          Contactar Ahora
        </button>

        {isBlocked && (
          <span className="text-xs text-[var(--c-text)]/70 bold">
            Espera antes de volver a contactar
          </span>
        )}
      </div>

      </div>

      {showForm && (
        <div className="bg-[var(--c-dropdown-bg)] border border-[var(--c-border)] rounded-2xl p-6 shadow-sm transition-all duration-300">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-bold text-sky-400 mb-4">
                Contactar Ahora
              </h1>
              <div className="h-px bg-[var(--c-border)] w-full max-w-[320px] mb-4" />
              <div className="bg-[var(--c-bg-hover2)]/60 border border-[var(--c-border)]/60 rounded-2xl p-6 min-w-[320px] relative overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 w-[6px] bg-gradient-to-b from-sky-400 to-sky-500 rounded-full z-0" />
                <div className="relative z-10 ml-6 space-y-2">
                  <h4 className="font-bold text-[var(--c-text)] text-xl">
                    Dr. {lawyer.firstName} {lawyer.lastName}
                  </h4>
                  <p className="text-sky-500 font-medium">
                    {lawyer.specializations
                      .map(
                        (spec) =>
                          LawyerSpecializationLabels[
                            spec as keyof typeof LawyerSpecializationLabels
                          ],
                      )
                      .join(" - ")}
                  </p>
                  <p className="text-[var(--c-text)]/80">
                    {lawyer.province === "LIMA"
                      ? "Lima, Perú"
                      : "Fuera de Lima"}
                  </p>
                  <p className="text-[var(--c-text)]/80">
                    {lawyer.yearExperience} años de experiencia
                  </p>
                  <p className="font-bold text-[var(--c-text)] text-lg mt-4">
                    Tarifa: S/.{lawyer.contactPrice} por consulta
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1">
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
                    placeholder="Describe tu situación legal y cómo podemos ayudarte..."
                    required
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="border-lime-400 border-3 hover:border-lime-600 hover:text-lime-600 text-lime-500 text-md font-semibold py-3 px-5 rounded-full transition-all duration-200 flex items-center gap-2"
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
          </div>
        </div>
      )}
    </div>
  );
}
