import LoginForm from "../components/LoginForm";
import Statistics from "../components/Statistics";

export default function LoginPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="hidden lg:flex w-1/2 animated-bg flex-col items-center justify-center p-8 text-black">
        <div className="flex flex-col gap-4 items-start max-w-md">
          <h1 className="font-bold text-6xl">LegalCheck</h1>
          <div>
            <h2 className="text-xl mt-4">
              Orientación legal clara, asistencia inteligente
            </h2>
            <h2 className="text-xl mb-8">y abogados a tu medida.</h2>
          </div>
          <Statistics />
        </div>
      </div>

      <div className="mt-40 lg:mt-10  flex w-full lg:w-1/2 items-center justify-center px-4">
        <LoginForm />
      </div>
    </div>
  );
}
