import { useCallback, useState } from "react";
import messages from "@constants/messages";
import { useAuthContext } from "@contexts/AuthContext";
import { useLoader } from "@contexts/LoaderContext";
import { ApiError } from "@models/api";

type LoginData = {
  username: string;
  password: string;
};

export function useAuth() {
  const auth = useAuthContext();
  const { showLoader, hideLoader } = useLoader();
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (data: LoginData) => {
      showLoader();
      setError(null);

      try {
        await auth.login({
          username: data.username.trim(),
          password: data.password,
        });
      } catch (err) {
        setError(err instanceof ApiError ? err.message : messages.auth.loginError);
        throw err;
      } finally {
        hideLoader();
      }
    },
    [auth, hideLoader, showLoader],
  );

  const logout = useCallback(async () => {
    showLoader();
    setError(null);

    try {
      await auth.logout();
    } catch (err) {
      setError(messages.auth.logoutError);
      throw err;
    } finally {
      hideLoader();
    }
  }, [auth, hideLoader, showLoader]);

  return {
    ...auth,
    login,
    logout,
    error,
  };
}
