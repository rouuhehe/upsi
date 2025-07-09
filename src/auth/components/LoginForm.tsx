import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LoginRequestSchema } from "../schemas/LoginRequestSchema";
import type { LoginRequest } from "../types/LoginRequest";
import { useMutation } from "@tanstack/react-query";
import { Mail, Lock } from "lucide-react";
import clsx from "clsx";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login: lg } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      return await lg(data).mapErr((err) => {
        throw err;
      });
    },

    onSuccess: () => {
      navigate("/welcome");
    },

    onError: (err) => {
      console.error("Login error: ", err);
    },
  });

  const onSubmit = (data: LoginRequest) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" w-[360px] h-[450px] rounded-3xl flex flex-col items-center justify-center p-8 gap-3"
    >
      <div className="lg:hidden flex flex-col items-center justify-center text-center px-6">
        <img
          src="/assets/assistant-profile.png"
          alt="Asistente Legal"
          className="w-40 h-auto"
        />
      </div>
      <h1 className="p-1 font-bold text-2xl text-[var(--c-text)]">
        {" "}
        BIENVENIDO{" "}
      </h1>

      <div className="w-full flex flex-col gap-3 mt-4">
        <div>
          <div className="flex items-center">
            <Mail className="text-[var(--c-text)]/70 mr-2" size={18} />
            <label className="text-sm text-[var(--c-text)]/70">
              Correo electrónico
            </label>
          </div>
          <input
            type="text"
            {...register("username")}
            className="w-full mt-1 border-b border-sky-500 focus:border-sky-500 outline-none p-2 text-[var(--c-text)]"
            disabled={mutation.isPending}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center">
            <Lock className="text-[var(--c-text)]/70 mr-2" size={18} />
            <label className="text-sm text-[var(--c-text)]/70">
              Contraseña
            </label>
          </div>
          <input
            type="password"
            {...register("password")}
            className="w-full mt-1 border-b border-sky-500 focus:border-sky-500 outline-none p-2 text-[var(--c-text)]"
            disabled={mutation.isPending}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {mutation.isError && (
          <p className="text-red-500 text-sm max-w-[200px]">
            {mutation.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className={clsx(
            "mt-3 cursor-pointer text-lg font-semibold  bg-sky-500 text-white px-4 py-2 rounded-3xl transition-colors duration-300",
            {
              "opacity-50": mutation.isPending,
              "hover:bg-sky-600": !mutation.isPending,
            },
          )}
        >
          {mutation.isPending ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </div>

      <div className="flex items-center justify-center w-full gap-2 mt-3">
        <p className="text-[var(--c-text)]/80 text-sm">
          ¿No tienes una cuenta?
        </p>
        <Link
          to="/auth/register"
          className="text-[var(--c-text)] hover:underline font-semibold text-sm"
        >
          Regístrate
        </Link>
      </div>
    </form>
  );
}
