import { login } from "../services/login";
import { register } from "../services/register";
import { createContext, useState, type ReactNode } from "react";
import { ResultAsync } from "neverthrow";
import type { RegisterRequest } from "../types/RegisterRequest";
import type { LoginRequest } from "../types/LoginRequest";

interface AuthContextType {
  register: (registerRequest: RegisterRequest) => ResultAsync<void, Error>;
  login: (loginRequest: LoginRequest) => ResultAsync<void, Error>;
  logout: () => void;
  session?: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider(props: { children: ReactNode }) {
  const [session, setSession] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const loginHandler = (data: LoginRequest): ResultAsync<void, Error> => {
    return login(data).map((res) => {
      localStorage.setItem("token", res.token);
      setSession(res.token);
    });
  };

  const registerHandler = (data: RegisterRequest): ResultAsync<void, Error> => {
    return register(data)
      .map(() => {})
      .mapErr((err) => {
        console.error("Error al registrarse:", err);
        return err;
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        register: registerHandler,
        login: loginHandler,
        logout,
        session,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
