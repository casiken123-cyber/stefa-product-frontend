import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { adminLogin, adminLogout } from "../api/products";
import AdminLoginDialog from "../components/AdminLoginDialog";

const AdminContext = createContext(null);

const readAdmin = () => {
  try {
    return localStorage.getItem("admin_token") ? JSON.parse(localStorage.getItem("admin_user")) : null;
  } catch (error) {
    return null;
  }
};

const clearSession = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
};

// Keeps the admin session for the whole app and shows the login dialog when an action needs it.
export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(readAdmin);
  const [loginOpen, setLoginOpen] = useState(false);
  const pendingAction = useRef(null);

  const handleLogin = useCallback(async (email, password) => {
    const data = await adminLogin(email, password);
    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_user", JSON.stringify(data.admin ?? {}));
    setAdmin(data.admin ?? {});
    setLoginOpen(false);

    // Continue the action the person was trying to do (add, edit or delete)
    const next = pendingAction.current;
    pendingAction.current = null;
    if (next) next();
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminLogout();
    } catch (error) {
      // The token may already be invalid, so just clear it here
    }
    clearSession();
    setAdmin(null);
  }, []);

  // Runs the action now if an admin is logged in, otherwise asks them to log in first
  const requireAdmin = useCallback((action) => {
    if (localStorage.getItem("admin_token")) {
      action();
    } else {
      pendingAction.current = action;
      setLoginOpen(true);
    }
  }, []);

  const openLogin = useCallback(() => {
    pendingAction.current = null;
    setLoginOpen(true);
  }, []);

  // Used when the API says the token is no longer valid
  const expireSession = useCallback(() => {
    clearSession();
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({ admin, logout, requireAdmin, openLogin, expireSession }),
    [admin, logout, requireAdmin, openLogin, expireSession]
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
      <AdminLoginDialog
        open={loginOpen}
        onClose={() => { pendingAction.current = null; setLoginOpen(false); }}
        onLogin={handleLogin}
      />
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}