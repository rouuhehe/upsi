import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import clsx from "clsx";
import type { LawyerRegister } from "../../lawyer/types/LawyerRegister";
import { LawyerRegisterSchema } from "../../lawyer/schemas/LawyerRegisterSchema";
import { sendLawyerRequest } from "../services/sendLawyerRequest";
import type { RegisterRequest } from "../types/RegisterRequest";
import { ResultAsync } from "neverthrow";
import { useRef, useState } from "react";
import { useClickOutside } from "../../common/hooks/useClickOutside";
import type { LawyerSpecialization } from "../../lawyer/types/LawyerSpecialization";
import { LawyerSpecializationLabels } from "../../lawyer/schemas/lawyerLabels";

interface LawyerRegisterFormProps {
  registerForm: RegisterRequest;
  onBack: () => void;
}

export default function LawyerRegisterForm(props: LawyerRegisterFormProps) {
  const navigate = useNavigate();
  const { register: rg } = useAuthContext();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LawyerRegister>({
    resolver: zodResolver(LawyerRegisterSchema),
    defaultValues: {
      tuitionNumber: "",
      contactPrice: 0,
      yearExperience: 0,
      province: "LIMA",
      specializations: [],
    },
  });

  const selectedSpecializations = watch("specializations");

  const mutation = useMutation({
    mutationFn: async (data: LawyerRegister) => {
      const userPromise = rg(props.registerForm);
      const lawyerPromise = sendLawyerRequest(data);
      return ResultAsync.combineWithAllErrors([userPromise, lawyerPromise]);
    },

    onSuccess: () => navigate("/auth/register-success"),

    onError: (err) =>
      console.error("Error sending lawyer registration request: ", err),
  });

  const handleSpecializationChange = (value: LawyerSpecialization) => {
    const current = watch("specializations");
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue("specializations", updated, { shouldValidate: true });
  };

  const onSubmit = (data: LawyerRegister) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-xs sm:max-w-sm px-4 sm:px-6 flex flex-col"
    >
      <h1 className="text-xl font-bold text-center text-[var(--c-text)] mb-4">
        REGISTRO DE ABOGADO
      </h1>

      <div className="flex flex-col gap-3">
        {/* Número de colegiatura */}
        <div>
          <label className="text-sm text-[var(--c-text)]/70">
            Número de colegiatura
          </label>
          <input
            {...register("tuitionNumber")}
            className="w-full border-b border-gray-300 focus:border-sky-500 outline-none py-1 text-[var(--c-text)]"
          />
          {errors.tuitionNumber && (
            <p className="text-red-500 text-xs">
              {errors.tuitionNumber.message}
            </p>
          )}
        </div>

        {/* Precio de contacto */}
        <div>
          <label className="text-sm text-[var(--c-text)]/70">
            Precio de contacto S/.
          </label>
          <input
            {...register("contactPrice")}
            className="w-full border-b border-gray-300 focus:border-sky-500 outline-none py-1 text-[var(--c-text)]"
          />
          {errors.contactPrice && (
            <p className="text-red-500 text-xs">
              {errors.contactPrice.message}
            </p>
          )}
        </div>

        {/* Años de experiencia */}
        <div>
          <label className="text-sm text-[var(--c-text)]/70">
            Años de experiencia
          </label>
          <input
            type="number"
            {...register("yearExperience")}
            className="w-full border-b border-gray-300 focus:border-sky-500 outline-none py-1 text-[var(--c-text)]"
          />
          {errors.yearExperience && (
            <p className="text-red-500 text-xs">
              {errors.yearExperience.message}
            </p>
          )}
        </div>

        {/* Provincia */}
        <div>
          <label className="text-sm text-[var(--c-text)]/70">Provincia</label>
          <select
            {...register("province")}
            className="w-full bg-transparent border-b border-gray-300 focus:border-sky-500 outline-none py-1 text-[var(--c-text)]"
          >
            <option value="">Seleccione...</option>
            <option value="LIMA">Lima</option>
            <option value="OTHER">Otro</option>
          </select>
          {errors.province && (
            <p className="text-red-500 text-xs">{errors.province.message}</p>
          )}
        </div>

        {/* Especializaciones */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-sm text-[var(--c-text)]/70">
            Especializaciones
          </label>
          <button
            type="button"
            className="w-full border-b border-gray-300 focus:border-sky-500 outline-none py-1 text-left text-[var(--c-text)]"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {selectedSpecializations.length > 0
              ? selectedSpecializations
                  .map((spec) => LawyerSpecializationLabels[spec])
                  .join(", ")
              : "Seleccione una o más..."}
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 bg-[var(--c-bg)] shadow-lg mt-2 p-2 border rounded w-full max-h-48 overflow-y-auto">
              {Object.entries(LawyerSpecializationLabels).map(
                ([key, label]) => (
                  <label key={key} className="flex items-center gap-2 p-1">
                    <input
                      type="checkbox"
                      checked={selectedSpecializations.includes(
                        key as LawyerSpecialization,
                      )}
                      onChange={() =>
                        handleSpecializationChange(key as LawyerSpecialization)
                      }
                    />
                    <span className="text-sm text-[var(--c-text)]">
                      {label}
                    </span>
                  </label>
                ),
              )}
            </div>
          )}

          {errors.specializations && (
            <p className="text-red-500 text-xs">
              {errors.specializations.message}
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={props.onBack}
            className="text-sm text-[var(--c-text)]/70 underline"
          >
            Volver
          </button>

          <button
            type="submit"
            className={clsx(
              "bg-sky-500 text-white rounded-full py-2 px-5 text-sm transition duration-200",
              {
                "opacity-50 cursor-not-allowed": mutation.isPending,
                "hover:bg-sky-600": !mutation.isPending,
              },
            )}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Enviando..." : "Finalizar"}
          </button>
        </div>

        <p className="mt-6 text-xs text-[var(--c-text)]/70 text-center">
          La información será enviada a los administradores para su
          verificación. Recibirás un correo con el estado de tu solicitud.
        </p>
      </div>
    </form>
  );
}
