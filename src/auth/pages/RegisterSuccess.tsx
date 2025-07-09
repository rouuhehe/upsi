import { MailCheck } from "lucide-react";

export function RegisterSuccess() {
  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="text-center flex flex-col items-center">
        <svg width="0" height="0">
          <linearGradient
            id="checkGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop stopColor="#5de0e6" offset="0%" />
            <stop stopColor="#004aad" offset="100%" />
          </linearGradient>
        </svg>

        <MailCheck
          size={64}
          className="mb-4"
          style={{ stroke: "url(#checkGradient)" }}
        />

        <h1 className="text-3xl font-bold text-[var(--c-text)] mb-4">
          Verifica tu cuenta
        </h1>

        <div className="px-6 text-[var(--c-text)] text-lg text-left leading-relaxed flex flex-col gap-2 items-start mt-4">
          <p>
            <strong>1.</strong> Abre tu aplicación de correo (Gmail, Outlook,
            etc).
          </p>
          <p>
            <strong>2.</strong> Busca un mensaje de <strong>LegalCheck</strong>.
          </p>
          <p>
            <strong>3.</strong> Haz clic en el botón que dice{" "}
            <strong>"Verification Email - LegalCheck"</strong>.
          </p>
          <p>
            <strong>4.</strong> Si no lo ves en la bandeja principal, revisa tu
            carpeta de <strong>spam</strong> o{" "}
            <strong>correo no deseado</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
