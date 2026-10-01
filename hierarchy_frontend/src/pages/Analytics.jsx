
import { useEffect, useState } from "react";
import { getOrgHealth, getStats } from "../lib/api";
import {
  Activity,
  Users,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const ROLE_COLORS = {
  CEO: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    bar: "bg-purple-500",
  },
  Manager: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    bar: "bg-blue-500",
  },
  "Project Manager": {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    bar: "bg-indigo-500",
  },
  "Team Lead": {
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    bar: "bg-cyan-500",
  },
  Junior: {
    bg: "bg-green-50",
    text: "text-green-600",
    bar: "bg-green-500",
  },
  Associate: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  Intern: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    bar: "bg-amber-500",
  },
};

export default function Analytics() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrgHealth(), getStats()])
      .then(([h, s]) => {
        setHealth(h.data.data || h.data);
        setStats(s.data.data);
      })
      .catch(() => {
        setHealth({
          span_of_control: "Unknown",
          avg_team_size: 0,
          recommendation:
            "Start Python service on port 8001 for live insights",
          score: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-4">
          <BarChart3 className="w-7 h-7 text-primary-500 animate-pulse" />
        </div>

        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary-600 mb-3" />

        <p className="text-sm text-slate-500">
          Loading organization analytics...
        </p>
      </div>
    );
  }

  const roleData = stats?.byDesignation || [];

  const totalHeadcount = roleData.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  const score = Number(health?.score);
  const scorePercentage = Math.min(
    100,
    Math.max(0, Number.isFinite(score) ? score : 0)
  );

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Org Analytics
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Organization health and workforce insights
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>

          <span className="text-xs font-semibold text-slate-600">
            Analytics Service
          </span>
        </div>
      </div>

      {/* =========================================================
          HEALTH METRICS
      ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Health Score */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-600 to-sky-600 text-white p-5 shadow-lg shadow-primary-500/15">
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-10 w-36 h-36 rounded-full bg-sky-300/10 blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>

                <span className="text-sm font-medium text-white/90">
                  Org Health Score
                </span>
              </div>

              <ShieldCheck className="w-5 h-5 text-white/70" />
            </div>

            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold tracking-tight">
                {health?.score ?? "—"}
              </p>

              {health?.score !== undefined &&
                health?.score !== null && (
                  <span className="text-sm text-white/70 pb-1">
                    / 100
                  </span>
                )}
            </div>

            <div className="mt-5">
              <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white/80 transition-all duration-700"
                  style={{ width: `${scorePercentage}%` }}
                />
              </div>

              <div className="flex justify-between mt-2 text-[10px] text-white/60">
                <span>Organization health</span>
                <span>{scorePercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Avg Team Size */}
        <div className="card relative overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>

                <span className="text-sm font-semibold text-slate-600">
                  Avg Team Size
                </span>
              </div>

              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>

            <p className="text-3xl font-bold text-slate-900">
              {health?.avg_team_size ?? "—"}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Average direct reports
            </p>
          </div>
        </div>

        {/* Span of Control */}
        <div className="card relative overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-amber-600" />
                </div>

                <span className="text-sm font-semibold text-slate-600">
                  Span of Control
                </span>
              </div>

              <Activity className="w-4 h-4 text-amber-400" />
            </div>

            <p className="text-2xl font-bold text-slate-900">
              {health?.span_of_control ?? "—"}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Current organizational span
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          RECOMMENDATION
      ========================================================= */}
      <div className="relative overflow-hidden rounded-2xl border border-primary-100 bg-gradient-to-r from-primary-50/80 via-white to-sky-50/60 p-5 shadow-sm">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-100/50 rounded-full blur-3xl" />

        <div className="relative flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-white border border-primary-100 flex items-center justify-center flex-shrink-0 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-primary-500" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800">
                Recommendation
              </h3>

              <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-600 text-[10px] font-semibold">
                AI Insight
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {health?.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          HEADCOUNT BY ROLE
      ========================================================= */}
      <div className="card overflow-hidden p-0 border border-slate-100 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-primary-50/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="font-bold text-slate-800">
                Headcount by Role
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Distribution of employees across designations
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 self-start">
              <Users className="w-3.5 h-3.5 text-slate-400" />

              <span className="text-xs font-semibold text-slate-500">
                {totalHeadcount} Total
              </span>
            </div>
          </div>
        </div>

        <div className="p-5">
          {roleData.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-slate-300" />
              </div>

              <p className="text-sm text-slate-400">
                No role data available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {roleData.map((d) => {
                const style =
                  ROLE_COLORS[d._id] || {
                    bg: "bg-slate-50",
                    text: "text-slate-600",
                    bar: "bg-slate-400",
                  };

                const percentage =
                  totalHeadcount > 0
                    ? Math.round((d.count / totalHeadcount) * 100)
                    : 0;

                return (
                  <div
                    key={d._id}
                    className="group relative rounded-xl border border-slate-100 bg-white p-4 hover:border-slate-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div
                        className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center`}
                      >
                        <Users
                          className={`w-4 h-4 ${style.text}`}
                        />
                      </div>

                      <span className="text-xs font-semibold text-slate-400">
                        {percentage}%
                      </span>
                    </div>

                    <p className="text-2xl font-bold text-slate-900">
                      {d.count}
                    </p>

                    <p className="text-xs font-medium text-slate-500 mt-1 truncate">
                      {d._id || "Unknown"}
                    </p>

                    <div className="mt-4 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${style.bar} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          PYTHON SERVICE
      ========================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

          <span>Python Analytics Service</span>
        </div>

        <span className="hidden sm:block text-slate-300">•</span>

        <code className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-md text-[11px] text-slate-500">
          cd python-service && python run.py
        </code>

        <span className="text-slate-300">(port 8001)</span>
      </div>
    </div>
  );
}

