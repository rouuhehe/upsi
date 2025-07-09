import {
  BadgeCheck,
  Bot,
  CheckCircle,
  FileText,
  Handshake,
  UserSearch,
  MessageCircle,
  BookOpen,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-40 w-full max-w-7xl py-8 lg:py-16 xl:py-32">
          <div className="flex flex-col items-center lg:items-start gap-4 text-center lg:text-left max-w-2xl">
            <h1 className="font-helvetica font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--c-text)] mb-4 leading-tight">
              ¡Bienvenido a LegalCheck!
            </h1>
            <div className="text-base sm:text-lg md:text-xl text-[var(--c-text)] space-y-2">
              <p>
                Tu plataforma legal está lista. Comienza a resolver tus
                consultas, explora guías especializadas o conecta con
                abogados verificados de Lima Metropolitana.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
              <a
                href="/chat"
                className="w-full sm:w-auto mt-6 cursor-pointer bg-sky-500 text-white px-6 sm:px-8 py-3 rounded-3xl transition-colors duration-300 hover:bg-black hover:text-white text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Iniciar Chat con IA
              </a>
              <a
                href="/guides"
                className="w-full sm:w-auto mt-2 sm:mt-6 cursor-pointer text-sky-400 px-6 sm:px-8 py-3 rounded-3xl border border-sky-400 transition-colors duration-300 hover:bg-[var(--c-bg-hover)] hover:text-white text-center flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Ver Guías
              </a>
            </div>
          </div>
          <div className="mt-10 w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 flex-shrink-0 order-first lg:order-last">
            <img 
              src="/assets/logo-bg.png" 
              alt="logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center text-center gap-2 sm:gap-8 lg:gap-12 w-full max-w-4xl py-8 lg:py-12">
          <div className="flex items-center justify-center gap-3">
            <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-[var(--c-text)]/70 uppercase tracking-wider">
              100% Gratuito
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Handshake className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-[var(--c-text)]/70 uppercase tracking-wider text-center">
              Abogados verificados de Lima Metropolitana
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-sky-500 w-full text-center text-black px-4 sm:px-6 lg:px-8">
        <h2 className="font-bold text-4xl sm:text-4xl lg:text-5xl text-center text-white mb-12 sm:mb-16 lg:mb-24 mt-16 sm:mt-24 lg:mt-32">
          ¿Qué puedes hacer hoy?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto mb-24 sm:mb-32 lg:mb-48">
          <a href="/chat" className="flex flex-col items-center bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
            <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-sky-500 mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2 text-center">
              Consulta con IA
            </h3>
            <p className="text-sm text-center text-gray-700 leading-relaxed mb-4">
              Chatea con nuestra IA legal. Recibe orientación en segundos sobre cualquier tema legal.
            </p>
            <ArrowRight className="w-4 h-4 text-sky-500 mt-auto" />
          </a>

          <a href="/guides" className="flex flex-col items-center bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-sky-500 mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2 text-center">
              Explora Guías
            </h3>
            <p className="text-sm text-center text-gray-700 leading-relaxed mb-4">
              Información paso a paso sobre despidos, violencia familiar, deudas y más.
            </p>
            <ArrowRight className="w-4 h-4 text-sky-500 mt-auto" />
          </a>

          <a href="/lawyers" className="flex flex-col items-center bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
            <UserSearch className="w-8 h-8 sm:w-10 sm:h-10 text-sky-500 mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2 text-center">
              Contacta Abogados
            </h3>
            <p className="text-sm text-center text-gray-700 leading-relaxed mb-4">
              Encuentra abogados confiables con filtros por distrito, especialidad y presupuesto.
            </p>
            <ArrowRight className="w-4 h-4 text-sky-500 mt-auto" />
          </a>

          <div className="flex flex-col items-center bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-sky-500 mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2 text-center">
              Herramientas Legales
            </h3>
            <p className="text-sm text-center text-gray-700 leading-relaxed">
              Utiliza nuestras herramientas para anticipar escenarios y entender tus derechos.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 text-center lg:text-left">
        <div className="w-full max-w-sm lg:max-w-md xl:max-w-lg order-2 lg:order-1">
          <img
            src="https://img.freepik.com/premium-vector/business-team-coworker-faceless_18591-46023.jpg?semt=ais_hybrid&w=740"
            alt="Abogados"
            className="w-full h-auto object-cover rounded-md -scale-x-100"
          />
        </div>

        <div className="flex flex-col items-center lg:items-start max-w-xl order-1 lg:order-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-6 sm:mb-8 leading-tight">
            ¿Tienes una consulta urgente?
          </h2>
          <p className="text-base sm:text-lg text-black/70 mb-8 sm:mb-10 leading-relaxed">
            Nuestro asistente legal potenciado con inteligencia artificial está disponible 24/7 para ayudarte con cualquier consulta que puedas tener. 
            Obtén respuestas inmediatas o conecta directamente con un abogado especializado.
          </p>

          <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-10 w-full text-black font-medium text-sm sm:text-base">
            <div className="border-l-4 border-sky-500 pl-4 text-left">
              <p>Respuestas instantáneas</p>
            </div>
            <div className="border-l-4 border-sky-500 pl-4 text-left">
              <p>Disponible las 24 horas</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
            <a
              href="/chat"
              className="flex items-center gap-2 justify-center cursor-pointer bg-black hover:bg-sky-500 text-white px-6 sm:px-8 py-3 rounded-full transition duration-300 w-full sm:w-auto"
            >
              Iniciar nueva consulta
              <MessageCircle className="w-4 h-4 text-white" />
            </a>

            <a
              href="/lawyers"
              className="flex items-center gap-2 justify-center cursor-pointer bg-black hover:bg-sky-500 text-white px-6 sm:px-8 py-3 rounded-full transition duration-300 w-full sm:w-auto"
            >
              Contacta con un abogado
              <GraduationCap className="w-4 h-4 text-white" />
            </a>
          </div>

          

        </div>
      </div>

      <footer className="bg-black text-white w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 text-sm">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-2">LegalCheck</h3>
            <p className="text-gray-300 leading-relaxed">
              Democratizando el acceso a la justicia en Perú a través de
              tecnología e información clara.
            </p>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 text-white">
              Herramientas
            </h4>
            <ul className="space-y-1 text-gray-300">
              <li><a href="/guides" className="hover:text-sky-400 transition-colors">Guías Legales</a></li>
              <li><a href="/chat" className="hover:text-sky-400 transition-colors">Asistente IA</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 text-white">Recursos</h4>
            <ul className="space-y-1 text-gray-300">
              <li><a href="/lawyers" className="hover:text-sky-400 transition-colors">Contactar Abogado</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 sm:mt-10 pt-4 sm:pt-6 text-center text-xs text-gray-400">
          © 2025 LegalCheck. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}