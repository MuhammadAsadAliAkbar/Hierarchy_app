
import { useEffect, useState } from "react";
import { getTree, getEmployee } from "../lib/api";
import OrgTree from "../components/OrgTree";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  DollarSign,
  User,
  Users,
  Network,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

// Simple date format without date-fns dependency
function formatDate(d) {
  if (!d) return "—";

  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function TreeView() {
  const [tree, setTree] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTree()
      .then((res) => setTree(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (node) => {
    setSelected(node);

    try {
      const res = await getEmployee(node._id);
      setDetail(res.data.data);
    } catch {
      setDetail(node);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mb-4">
          <Network className="w-7 h-7 text-primary-500 animate-pulse" />
        </div>

        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary-600 mb-3" />

        <p className="text-sm text-slate-500">
          Loading organization hierarchy...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
              <Network className="w-5 h-5 text-primary-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Organization Tree
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Explore your organization's reporting structure
              </p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />

          <span className="text-xs font-semibold text-slate-600">
            {tree.length} {tree.length === 1 ? "Root" : "Root Nodes"}
          </span>
        </div>
      </div>

      {/* Hierarchy description */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-600 font-medium">
          CEO
        </span>

        <ChevronRight className="w-3.5 h-3.5" />

        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 font-medium">
          Manager
        </span>

        <ChevronRight className="w-3.5 h-3.5" />

        <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 font-medium">
          Project Manager
        </span>

        <ChevronRight className="w-3.5 h-3.5" />

        <span className="px-2 py-1 rounded-md bg-cyan-50 text-cyan-600 font-medium">
          Team Lead
        </span>

        <ChevronRight className="w-3.5 h-3.5" />

        <span className="px-2 py-1 rounded-md bg-green-50 text-green-600 font-medium">
          Junior / Associate / Intern
        </span>
      </div>

      {/* =========================================================
          TREE + DETAILS
      ========================================================= */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Organization Tree */}
        <div className="lg:col-span-2 min-w-0">
          <OrgTree
            tree={tree}
            onSelect={handleSelect}
            selectedId={selected?._id}
          />
        </div>

        {/* =====================================================
            EMPLOYEE DETAILS
        ===================================================== */}
        <div className="card h-fit sticky top-6 p-0 overflow-hidden border border-slate-100 shadow-sm">
          {/* Details Header */}
          <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-white via-white to-primary-50/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Employee Details
                </h2>

                <p className="text-xs text-slate-400 mt-0.5">
                  Selected organization member
                </p>
              </div>
            </div>
          </div>

          {!detail ? (
            /* Empty State */
            <div className="px-5 py-12 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <User className="w-7 h-7 text-slate-300" />
              </div>

              <h3 className="font-semibold text-slate-700 mb-1">
                No Employee Selected
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                Click a person in the organization tree to view their
                details.
              </p>
            </div>
          ) : (
            <div className="p-5">
              {/* Profile */}
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-sky-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-primary-500/20">
                  {detail.name?.charAt(0)?.toUpperCase() || "?"}

                  <span className="absolute -right-1 -bottom-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-base text-slate-900 truncate">
                    {detail.name}
                  </p>

                  <p className="text-sm text-primary-600 font-medium truncate">
                    {detail.designation}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                    <span className="text-[11px] text-slate-400">
                      {detail.status === "active"
                        ? "Currently active"
                        : detail.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="py-4 space-y-2">
                {/* Email */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                      Email
                    </p>

                    <p className="text-sm text-slate-600 truncate">
                      {detail.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                {detail.phone && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-emerald-500" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                        Phone
                      </p>

                      <p className="text-sm text-slate-600 truncate">
                        {detail.phone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Department */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-purple-500" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                      Department
                    </p>

                    <p className="text-sm text-slate-600 truncate">
                      {detail.department || "—"}
                    </p>
                  </div>
                </div>

                {/* Joining Date */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-amber-500" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                      Joined
                    </p>

                    <p className="text-sm text-slate-600">
                      {formatDate(detail.joiningDate)}
                    </p>
                  </div>
                </div>

                {/* Salary */}
                {detail.salary > 0 && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-green-500" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-400">
                        Salary
                      </p>

                      <p className="text-sm font-semibold text-slate-700">
                        {detail.salary?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reports To */}
              {detail.parent && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="w-4 h-4 text-primary-500" />

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Reports To
                    </p>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-sm text-primary-600">
                      {detail.parent.name
                        ?.charAt(0)
                        ?.toUpperCase() || "?"}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {detail.parent.name}
                      </p>

                      <p className="text-xs text-slate-400 truncate">
                        {detail.parent.designation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Reports */}
              {detail.children?.length > 0 && (
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary-500" />

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Direct Reports
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-bold">
                      {detail.children.length}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {detail.children.map((c) => (
                      <div
                        key={c._id}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                          {c.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-700 truncate">
                            {c.name}
                          </p>

                          <p className="text-[10px] text-slate-400 truncate">
                            {c.designation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    detail.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : detail.status === "on-leave"
                      ? "bg-amber-50 text-amber-700 border-amber-100"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      detail.status === "active"
                        ? "bg-emerald-500"
                        : detail.status === "on-leave"
                        ? "bg-amber-500"
                        : "bg-slate-400"
                    }`}
                  />

                  {detail.status}
                </span>
              </div>

              {/* Security / Info */}
              <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />

                <span className="text-[11px] text-slate-400">
                  Organization information
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

