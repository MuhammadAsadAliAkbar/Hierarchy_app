
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Network,
  Users,
  LayoutDashboard,
  BarChart3,
  LogOut,
  Building2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tree", label: "Org Tree", icon: Network },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-200/80 flex flex-col shadow-sm">
        {/* Brand */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-primary-500/20 blur-md" />

              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-sky-500 flex items-center justify-center shadow-md shadow-primary-500/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 truncate">
                HierarchyMgr
              </h1>

              <p className="text-[10px] text-slate-400 mt-0.5">
                Organization Manager
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 pt-5 pb-2">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {links.map((l) => {
            const Icon = l.icon;

            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  clsx(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary-50 text-primary-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary-600" />
                    )}

                    <span
                      className={clsx(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        isActive
                          ? "bg-primary-100 text-primary-600"
                          : "bg-transparent text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
                      )}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </span>

                    <span className="flex-1">{l.label}</span>

                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-primary-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Account */}
        <div className="p-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-sky-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.name || "User"}
                </p>

                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Account status */}
            <div className="flex items-center gap-2 px-2 py-1.5 mb-2 rounded-lg bg-white border border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />

              <span className="text-[11px] font-medium text-slate-500">
                Account secured
              </span>

              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="group flex items-center gap-2 w-full px-2.5 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

