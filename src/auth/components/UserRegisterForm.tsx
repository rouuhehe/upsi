import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useForm } from "react-hook-form";
import type { RegisterRequest } from "../types/RegisterRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterRequestSchema } from "../schemas/RegisterRequestSchema";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useState } from "react";
import LawyerRegisterForm from "./LawyerRegisterForm";

export default function UserRegisterForm() {
  const navigate = useNavigate();
  const { register: rg } = useAuthContext();

  const [formData, setFormdata] = useState<RegisterRequest | null>(null);
  const [isLawyer, setIsLawyer] = useState(false);
  const [showLawyerForm, setShowLawyerForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return (await rg(data))._unsafeUnwrap;
    },

    onSuccess: () => navigate("/auth/register-success"),

    onError: (err) => console.error("Login error: ", err),
  });

  const onSubmit = (data: RegisterRequest) => {
    if (!isLawyer) {
      mutation.mutate(data);
      return;
    }

    setShowLawyerForm(true);
    setFormdata(data);
  };

  return (
    <>
      {!showLawyerForm || !formData ? (
        <div className="flex items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-xs sm:max-w-sm px-4 sm:px-6 flex flex-col"
          >
            <div className="flex justify-center items-center mb-3">
              <h1 className="font-bold text-xl text-[var(--c-text)]">
                CREA UNA CUENTA
              </h1>
            </div>

            <div className="flex flex-col">
              <div>
                <label className=" text-sm text-[var(--c-text)]/70">
                  Nombre
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  className="text-[var(--c-text)] w-full border-b border-gray-300 focus:border-sky-500 outline-none pb-1"
                  disabled={mutation.isPending}
                />
                {errors.firstName && (
                  <p className="text-red-500/80 text-xs">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-[var(--c-text)]/70">
                  Apellido
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="text-[var(--c-text)] w-full border-b border-gray-300 focus:border-sky-500 outline-none p-1"
                  disabled={mutation.isPending}
                />
                {errors.lastName && (
                  <p className="text-red-500/80 text-xs">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-[var(--c-text)]/70">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="text-[var(--c-text)] w-full border-b border-gray-300 focus:border-sky-500 outline-none p-1"
                  disabled={mutation.isPending}
                />
                {errors.email && (
                  <p className="text-red-500/80 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-[var(--c-text)]/70">
                  Teléfono
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="text-[var(--c-text)] w-full border-b border-gray-300 focus:border-sky-500 outline-none p-1"
                  disabled={mutation.isPending}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500/80 text-xs">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-[var(--c-text)]/70">
                  Contraseña
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="text-[var(--c-text)] w-full border-b border-gray-300 focus:border-sky-500 outline-none p-1"
                  disabled={mutation.isPending}
                />
                {errors.password && (
                  <p className="text-red-500/80 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {mutation.isError && (
                <p className="text-red-500/80 text-xs max-w-[200px]">
                  {mutation.error.message}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm text-[var(--c-text)]/70">
                  <input
                    type="checkbox"
                    checked={isLawyer}
                    onChange={(e) => setIsLawyer(e.target.checked)}
                    disabled={mutation.isPending}
                  />
                  Quiero registrarme como abogado
                </label>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className={clsx(
                  "font-semibold text-lg mt-3 cursor-pointer bg-sky-500 text-white rounded-full py-2 transition duration-200",
                  {
                    "opacity-50 cursor-not-allowed": mutation.isPending,
                    "hover:bg-sky-600": !mutation.isPending,
                  },
                )}
              >
                {mutation.isPending
                  ? "Registrando..."
                  : isLawyer
                    ? "Continuar"
                    : "Registrarse"}
              </button>
              <div className="flex justify-center items-center gap-2 text-sm text-[var(--c-text)]/70 text-center mt-2">
                <p>¿Ya tienes una cuenta?</p>
                <Link
                  to="/auth/login"
                  className="text-[var(--c-text)] hover:underline font-semibold"
                >
                  Inicia Sesión
                </Link>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <LawyerRegisterForm
          registerForm={formData}
          onBack={() => {
            setShowLawyerForm(false);
            setFormdata(null);
          }}
        />
      )}
    </>
  );
}
