import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme, toggleTheme } = useTheme();
  // const { user, logout } = useAuth();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   logout();
  //   navigate("/login", { replace: true });
  // };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-slate-200 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-slate-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
            {/* <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300">
                {user?.email || "Admin"}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div> */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
