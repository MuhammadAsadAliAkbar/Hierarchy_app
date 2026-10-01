
import TreeNode from "./TreeNode";
import { Network, GitBranch, Sparkles } from "lucide-react";

export default function OrgTree({ tree, onSelect, selectedId }) {
  if (!tree || tree.length === 0) {
    return (
      <div className="card relative overflow-hidden text-center py-16 border border-slate-100 shadow-sm">
        {/* Background decoration */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary-100/50 rounded-full blur-3xl" />

        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center">
            <Network className="w-8 h-8 text-primary-500" />
          </div>

          <h3 className="text-base font-semibold text-slate-800 mb-1">
            No Organization Hierarchy
          </h3>

          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Add a CEO first, then build your organization tree by adding
            managers, team leads and employees.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card relative overflow-hidden p-0 border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-white via-white to-primary-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-primary-600" />
          </div>

          <div>
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              Organization Tree
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h2>

            <p className="text-xs text-slate-400 mt-0.5">
              Explore your organization's reporting structure
            </p>
          </div>
        </div>

        {/* Node count */}
        <div className="self-start sm:self-auto inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-slate-600">
            {tree.length} Root {tree.length === 1 ? "Node" : "Nodes"}
          </span>
        </div>
      </div>

      {/* Tree content */}
      <div className="overflow-auto max-h-[70vh] custom-scrollbar">
        <div className="min-w-fit p-5">
          <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
            <div className="space-y-0.5">
              {tree.map((node) => (
                <TreeNode
                  key={node._id}
                  node={node}
                  level={0}
                  onSelect={onSelect}
                  selectedId={selectedId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Network className="w-3.5 h-3.5" />
          <span>
            Select a member to view or manage their organizational details.
          </span>
        </div>
      </div>
    </div>
  );
}

