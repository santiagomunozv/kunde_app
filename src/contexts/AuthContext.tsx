import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import ApiServiceFetch from "@api/ApiServiceFetch";
import StorageService from "@api/StorageService";
import endPoints from "@constants/endPoints";
import storageKeys from "@constants/storageKeys";
import { Client, Company, LoginResponse, MeResponse, User } from "@models/auth";

type LoginData = {
  username: string;
  password: string;
};

type AuthContextValue = {
  bootstrapping: boolean;
  isAuthenticated: boolean;
  user: User | null;
  client: Client | null;
  company: Company | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  const persistSession = useCallback(async (session: LoginResponse | MeResponse, token?: string) => {
    setUser(session.user);
    setClient(session.client);
    setCompany(session.company);

    const values: [string, string][] = [
      [storageKeys.USER_KEY, JSON.stringify(session.user)],
      [storageKeys.CLIENT_KEY, JSON.stringify(session.client)],
      [storageKeys.COMPANY_KEY, JSON.stringify(session.company)],
    ];

    if (token) {
      values.push([storageKeys.AUTH_TOKEN_KEY, token]);
    }

    await StorageService.multiSet(values);
  }, []);

  const clearSession = useCallback(async () => {
    setUser(null);
    setClient(null);
    setCompany(null);
    await StorageService.multiRemove([
      storageKeys.AUTH_TOKEN_KEY,
      storageKeys.USER_KEY,
      storageKeys.CLIENT_KEY,
      storageKeys.COMPANY_KEY,
    ]);
  }, []);

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await StorageService.getValue(storageKeys.AUTH_TOKEN_KEY);
        if (!token) {
          return;
        }

        const me = await ApiServiceFetch.get<MeResponse>({ url: endPoints.app.auth.me, bearer: true });
        await persistSession(me);
      } catch {
        await clearSession();
      } finally {
        setBootstrapping(false);
      }
    }

    bootstrap();
  }, [clearSession, persistSession]);

  const login = useCallback(
    async (data: LoginData) => {
      const response = await ApiServiceFetch.post<LoginResponse>({
        url: endPoints.app.auth.login,
        data,
        bearer: false,
      });

      await persistSession(response, response.accessToken);
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    try {
      await ApiServiceFetch.post<null>({ url: endPoints.app.auth.logout, bearer: true });
    } finally {
      await clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      bootstrapping,
      isAuthenticated: Boolean(user),
      user,
      client,
      company,
      login,
      logout,
    }),
    [bootstrapping, user, client, company, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }

  return context;
}
