import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import type { AuthResponse } from "../types/AuthResponse";
import {
  AlertTriangle,
  CheckCircle,
  Mail,
  XCircle,
  Loader2,
} from "lucide-react";
import { apiClient, wrap } from "../../utils/api";

const tokenSchema = z.string().min(10, "token inválido");

export default function VerificationPage() {
  const navigate = useNavigate();
  const { token: rawToken } = useParams<{ token: string }>();
  const tokenResult = tokenSchema.safeParse(rawToken);

  const verifyQuery = useQuery<AuthResponse, Error>({
    queryKey: ["verify", rawToken],
    queryFn: async () => {
      if (!rawToken) throw new Error("Missing token");

      return (
        await wrap<AuthResponse>(
          apiClient.verifyUser({ query: { token: rawToken } }),
        )
      )._unsafeUnwrap();
    },
    enabled: tokenResult.success,
    retry: false,
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!rawToken) throw new Error("Missing token");

      return (
        await wrap(apiClient.resendVerification({ query: { token: rawToken } }))
      )._unsafeUnwrap();
    },

    onSuccess: () => navigate("/auth/login"),

    onError: (err) =>
      console.error("Error resending verification request: ", err),
  });

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-md w-full">
        {/* Header con logo */}
        <div className="mt-8 text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--c-text)] mb-2">
            LegalCheck
          </h1>
          <p className="text-[var(--c-text)]/70">Verificación de cuenta</p>
        </div>

        {/* Tarjeta principal */}
        <div className=" p-8">
          {/* Estado: Verificando */}
          {verifyQuery.isLoading && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center bg-sky-100 w-16 h-16  mb-4">
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Verificando tu cuenta
              </h2>
              <p className="text-[var(--c-text)]/70">
                Por favor espera mientras procesamos tu solicitud...
              </p>
            </div>
          )}

          {/* Estado: Token inválido */}
          {!tokenResult.success && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Token inválido
              </h2>
              <p className="text-[var(--c-text)]/70 mb-6">
                El enlace de verificación no es válido. Por favor, verifica que
                hayas copiado correctamente la URL.
              </p>
              <button
                onClick={() => navigate("/auth/login")}
                className="inline-flex items-center px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105"
              >
                Volver al inicio de sesión
              </button>
            </div>
          )}

          {/* Estado: Verificación exitosa */}
          {verifyQuery.isSuccess && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-green-600 mb-2">
                ¡Cuenta verificada con éxito!
              </h2>
              <p className="text-gray-600 mb-6">
                Tu cuenta ha sido verificada correctamente. Ya puedes acceder a
                todas las funcionalidades de LegalCheck.
              </p>
              <button
                onClick={() => navigate("/auth/login")}
                className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105"
              >
                Iniciar sesión
              </button>
            </div>
          )}

          {/* Estado: Error de verificación */}
          {verifyQuery.isError && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--c-text)] mb-2">
                No se pudo verificar la cuenta
              </h2>
              <p className="text-[var(--c-text)]/70 mb-6">
                El enlace de verificación puede estar expirado o ser inválido.
                Puedes solicitar un nuevo enlace de verificación.
              </p>

              {/* Botón de reenvío */}
              <button
                onClick={() => resendMutation.mutate()}
                disabled={resendMutation.isPending}
                className="inline-flex items-center px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 mb-4"
              >
                {resendMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Reenviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Reenviar verificación
                  </>
                )}
              </button>

              {/* Mensajes de estado del reenvío */}
              {resendMutation.isSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-center text-green-700">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      Correo reenviado exitosamente
                    </span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Revisa tu bandeja de entrada y carpeta de spam
                  </p>
                </div>
              )}

              {resendMutation.isError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center justify-center text-red-700">
                    <XCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      Error al reenviar el correo
                    </span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">
                    Inténtalo de nuevo más tarde o contacta soporte
                  </p>
                </div>
              )}

              {/* Enlace alternativo */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-[var(--c-text)]/70 mb-2">
                  ¿Tienes problemas con la verificación?
                </p>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="text-sky-600 hover:text-sky-700 font-medium text-sm hover:underline transition-colors"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-[var(--c-text)]/70">
            ¿Necesitas ayuda? Contactanos por{" "}
            <span className="font-semibold">legalcheck666@gmail.com </span>
          </p>
        </div>
      </div>
    </div>
  );
}
