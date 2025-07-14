import type { LawyerResponse } from "../schemas/LawyerResponseSchema";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, wrap } from "../../utils/api";
import { LawyerSpecializationLabels } from "../schemas/lawyerLabels";
import { BriefcaseBusiness, Star } from "lucide-react";

export function LawyerCard({
                             lawyer,
                             currentUserEmail,
                           }: {
  lawyer: LawyerResponse;
  currentUserEmail?: string;
}) {

  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

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
        className="cursor-pointer bg-[var(--c-bg)] rounded-2xl p-4 hover:shadow-md transition-all duration-300 group-hover:bg-[var(--c-bg)] ... flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center">
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
            <h2 className="text-2xl font-bold text-[var(--c-text)] group-hover:text-sky-400 transition-colors mb-1">
              {lawyer.firstName} {lawyer.lastName}
            </h2>
            <p className="text-large text-[var(--c-text)] font-medium">
              Especialista en Derecho{" "}
              {
                lawyer.specializations.length === 1
                    ? LawyerSpecializationLabels[lawyer.specializations[0] as keyof typeof LawyerSpecializationLabels]
                    : lawyer.specializations
                        .map(
                            (spec) =>
                                LawyerSpecializationLabels[spec as keyof typeof LawyerSpecializationLabels]
                        )
                        .join(", ")
                        .replace(/, ([^,]*)$/, " y $1")
              }
            </p>
            <div className="flex items-center justify-start gap-2 mt-1">
              <p className="text-sm font-normal text-[var(--c-text)]/90">S/.</p>
              <p className="text-sm font-normal text-[var(--c-text)]/90">
                {lawyer.contactPrice} por consulta
              </p>
            </div>
            <div className="flex items-center justify-start gap-2 mt-1">
              <BriefcaseBusiness className="w-4 h-4 text-black" />
              <p className="text-sm font-normal text-[var(--c-text)]/90">
                {lawyer.yearExperience} años de experiencia
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex flex-col mb-4">
            <div className="flex items-center justify-between gap-2 text-2xl font-semibold text-[var(--c-text)]">
              {lawyer.avgRating}
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            </div>
            <p className="text-large font-light">Reseñas</p>
          </div>

          {lawyer.email !== currentUserEmail && (
              <div className="p-[1.5px] rounded-xl bg-gradient-to-r from-sky-400 to-blue-500">
                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleForm();
                    }}
                    className="cursor-pointer bg-[var(--c-bg)] text-sky-500 font-semibold py-2 px-4 rounded-xl text-sm transition-all duration-200 hover:bg-gradient-to-r from-sky-400 to-blue-500 hover:text-white"
                >
                  Contactar Ahora
                </button>
              </div>
          )}

          {lawyer.email === currentUserEmail && (
              <span className="text-xs text-[var(--c-text)]/60 font-semibold mt-1">
    Este es tu perfil
  </span>
          )}


          {isBlocked && (
              <span className="text-xs text-[var(--c-text)]/70 font-semibold mt-1">
                Espera antes de volver a contactar
              </span>
          )}
        </div>
      </div>

      {/* Formulario de contacto */}
      {showForm && (
        <div className="bg-[var(--c-dropdown-bg)] border border-[var(--c-border)] rounded-2xl p-6 shadow-sm transition-all duration-300">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Info del abogado */}
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

            {/* Formulario */}
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
          </div>
        </div>
      )}
    </div>
  );
}
