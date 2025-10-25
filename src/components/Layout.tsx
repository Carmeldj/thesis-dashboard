import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  // const { user, logout } = useAuth();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   logout();
  //   navigate("/login", { replace: true });
  // };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-slate-800 shadow-lg border-b border-slate-700 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-slate-100">
              Admin Dashboard
            </h1>
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
