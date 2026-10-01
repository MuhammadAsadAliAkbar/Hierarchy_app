
import { useEffect, useState } from "react";
import { getStats, getTree } from "../lib/api";
import {
  Users,
  UserCheck,
  Network,
  Building2,
  ArrowUpRight,
  Crown,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [treePreview, setTreePreview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getTree()])
      .then(([s, t]) => {
        setStats(s.data.data);
        setTreePreview(t.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-primary-600" />
          <p className="text-sm text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Employees",
      value: stats?.total ?? 0,
      icon: Users,
      iconBg: "bg-primary-50",
      iconColor: "text-primary-600",
      accent: "from-primary-500 to-blue-500",
    },
    {
      title: "Active Employees",
      value: stats?.active ?? 0,
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "from-emerald-500 to-green-500",
    },
    {
      title: "Departments",
      value: stats?.byDepartment?.length ?? 0,
      icon: Building2,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      accent: "from-purple-500 to-violet-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Organization Overview
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Monitor your organization hierarchy and workforce.
          </p>
        </div>

        <Link
          to="/tree"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-primary-200 hover:text-primary-600 hover:shadow-md"
        >
          <Network className="w-4 h-4" />
          View Hierarchy
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="card relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Top accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accent}`}
              />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                    {item.value}
                  </p>

                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Current records
                  </div>
                </div>

                <div
                  className={`p-3.5 ${item.iconBg} rounded-2xl transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Designation */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-slate-900">
                By Designation
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Employee distribution by role
              </p>
            </div>

            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-primary-600" />
            </div>
          </div>

          <div className="space-y-1">
            {(stats?.byDesignation || []).map((d) => (
              <div
                key={d._id}
                className="flex justify-between items-center py-3 px-3 rounded-xl border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-primary-500" />

                  <span className="text-sm font-medium text-slate-700">
                    {d._id || "Unknown"}
                  </span>
                </div>

                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                  {d.count}
                </span>
              </div>
            ))}

            {(!stats?.byDesignation ||
              stats.byDesignation.length === 0) && (
              <div className="text-center py-8">
                <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />

                <p className="text-slate-400 text-sm">
                  No designation data available.
                </p>

                <p className="text-xs text-slate-300 mt-1">
                  Run seed or add employees.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Hierarchy */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-slate-900">
                Hierarchy Snapshot
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Quick view of your organization structure
              </p>
            </div>

            <Link
              to="/tree"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Full Tree
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {treePreview.length === 0 ? (
            <div className="text-center py-8">
              <Network className="w-9 h-9 mx-auto text-slate-300 mb-2" />

              <p className="text-slate-400 text-sm">
                No hierarchy yet.
              </p>

              <p className="text-xs text-slate-300 mt-1">
                Seed data or add a CEO.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {treePreview.map((ceo) => (
                <div key={ceo._id}>
                  {/* CEO */}
                  <div className="flex items-center gap-3 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white p-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Crown className="w-4.5 h-4.5 text-purple-600" />
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-slate-800">
                        {ceo.name}
                      </p>

                      <p className="text-xs text-purple-600 font-medium">
                        Chief Executive Officer
                      </p>
                    </div>
                  </div>

                  {/* Managers */}
                  {(ceo.children || []).map((mgr) => (
                    <div
                      key={mgr._id}
                      className="ml-6 mt-2 relative"
                    >
                      <div className="absolute -left-3 top-0 bottom-0 w-px bg-slate-200" />

                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 hover:bg-blue-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Users className="w-3.5 h-3.5 text-blue-600" />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-blue-700">
                              {mgr.name}
                            </p>

                            <p className="text-[11px] text-slate-400">
                              Manager
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-medium text-slate-500 bg-white border border-slate-100 px-2 py-1 rounded-lg">
                          {(mgr.children || []).length} PM
                          {(mgr.children || []).length !== 1
                            ? "s"
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tip */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-sm">
        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl" />

        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
            <span className="text-lg">💡</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-amber-900">
              Quick Tip
            </p>

            <p className="text-sm text-amber-800/80 mt-0.5">
              Run{" "}
              <code className="bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-md font-mono text-xs">
                npm run seed
              </code>{" "}
              in backend to load sample hierarchy:
              <span className="font-medium">
                {" "}
                CEO → Managers → PMs → Team Leads → Juniors / Associates /
                Interns
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

