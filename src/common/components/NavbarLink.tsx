import clsx from "clsx";
import { NavLink } from "react-router-dom";

interface NavbarLinkProps {
  to: string;
  label: string;
}

export default function NavbarLink({ to, label }: NavbarLinkProps) {
  const mainNavClass =
    "relative h-full px-3 flex items-center font-semibold text-sm transition-colors";

  return (
    <NavLink
      key={label}
      to={to}
      className={({ isActive }) =>
        clsx(mainNavClass, {
          "text-sky-500": isActive,
          "text-[var(--c-text-muted)] hover:bg-[var(--c-bg-hover)]": !isActive,
        })
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative z-10">{label}</span>
          <span
            className={clsx(
              "absolute bottom-0 left-0 right-0 h-[3px] bg-sky-400 rounded-full transition-all duration-300",
              {
                "opacity-100 scale-y-100": isActive,
                "opacity-0 scale-y-0": !isActive,
              },
            )}
          />
        </>
      )}
    </NavLink>
  );
}
