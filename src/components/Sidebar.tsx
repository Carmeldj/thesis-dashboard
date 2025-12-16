import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Store,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/users", icon: UserCircle, label: "Users" },
    { path: "/streamers", icon: Users, label: "Streamers" },
    { path: "/shops", icon: Store, label: "Shops" },
  ];

  return (
    <aside className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white w-64 min-h-screen p-4 flex flex-col border-r border-slate-200 dark:border-slate-800">
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
        <div className="mb-3 px-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Logged in as
          </p>
          <p className="font-medium truncate text-slate-700 dark:text-slate-200">
            {user?.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-3 p-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 w-full transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
