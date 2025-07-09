import { useAnimatedCount } from "../hooks/useAnimatedCounter";

export default function Statistics() {
  const count = useAnimatedCount(73);

  return (
    <div className="flex items-center justify-center min-h-screen0">
      <div className="rounded-2xl  px-10 py-6 backdrop-blur-sm bg-white/20 text-center text-black max-w-md">
        <p className="text-5xl font-bold text-sky-400 mb-2">{count}%</p>
        <p className="text-lg leading-snug text-black/70">
          de peruanos no saben cómo ejercer sus derechos legales básicos.
        </p>
      </div>
    </div>
  );
}
