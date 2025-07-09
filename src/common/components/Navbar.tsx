import { useTheme } from "../hooks/useTheme";
import { useClickOutside } from "../hooks/useClickOutside";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, Moon, LogOut, Sun } from "lucide-react";
import { useAuthContext } from "../../auth/hooks/useAuthContext";
import { useRef, useState } from "react";
import NavbarLink from "./NavbarLink";
import { useCurrentUser } from "../../user/hooks/useCurrentUser";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { user } = useCurrentUser();
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  const links = [
    { to: "/lawyers", label: "Abogados" },
    { to: "/chat", label: "Chat" },
    { to: "/guides", label: "Guías" },
  ];

  const userMenuBtnClass =
    "p-2 rounded-full hover:bg-[var(--c-bg-hover)] cursor-pointer";
  const dropdownItemClass =
    "w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--c-bg-hover2)]";

  return (
    <header className="fixed w-full bg-[var(--c-bg)] text-[var(--c-text)] z-50">
      <nav className="px-4 sm:px-6 lg:px-8 shadow-md h-14 flex justify-between items-center">
        <Link
          className="flex items-center gap-2"
          to={user ? "/welcome" : "/home"}
        >
          <img
            src="/assets/logo-bg-tiny.png"
            alt="Logo"
            className="w-12 h-12"
          />
          <span className="hidden sm:inline ml-1 font-extrabold font-helvetica text-xl scale-y-110 scale-x-115">
            LegalCheck
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-2 relative h-full">
            {links.map((link) => (
              <NavbarLink key={link.to} {...link} />
            ))}

            <button
              id="user-menu-button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className={userMenuBtnClass}
            >
              <UserCircle className="w-7 h-7 text-sky-500" />
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 top-12 w-64 bg-[var(--c-dropdown-bg)] border border-[var(--c-dropdown-border)] rounded-lg shadow-xl"
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--c-border)] ">
                  <UserCircle className="w-10 h-10 text-sky-500" />
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex flex-col text-left"
                  >
                    <span className="font-semibold text-sm text-[var(--c-text)] cursor-pointer">
                      ¡Hola, {user?.firstName || "Usuario"}!
                    </span>
                    <span className="text-xs text-[var(--c-text-muted)]">
                      Ver perfil
                    </span>
                  </button>
                </div>

                <div className="py-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--c-bg-hover2)]"
                  >
                    {isDark ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                    {isDark ? "Modo Claro" : "Modo Oscuro"}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      navigate(0);
                    }}
                    className={dropdownItemClass}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/auth/login"
              className="px-4 py-1.5 text-sm font-semibold border-2 border-[var(--c-accent)] text-[var(--c-accent)] rounded-full hover:text-[var(--c-accent)] transition-colors duration-200"
            >
              Iniciar Sesión
            </Link>

            <Link
              to="/auth/register"
              className="px-4 py-2 rounded-full font-bold text-sm bg-[var(--c-text)] text-[var(--c-text-invert)] hover:brightness-110 transition-all duration-200"
            >
              Registrarse
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
