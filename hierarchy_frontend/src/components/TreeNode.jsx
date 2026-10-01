
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Users,
  Crown,
  UserRound,
} from "lucide-react";
import clsx from "clsx";

const ROLE_COLORS = {
  CEO: "bg-purple-100 text-purple-800 border-purple-200",
  Manager: "bg-blue-100 text-blue-800 border-blue-200",
  "Project Manager": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Team Lead": "bg-cyan-100 text-cyan-800 border-cyan-200",
  Junior: "bg-green-100 text-green-800 border-green-200",
  Associate: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Intern: "bg-amber-100 text-amber-800 border-amber-200",
};

const ROLE_DOT = {
  CEO: "bg-purple-500",
  Manager: "bg-blue-500",
  "Project Manager": "bg-indigo-500",
  "Team Lead": "bg-cyan-500",
  Junior: "bg-green-500",
  Associate: "bg-emerald-500",
  Intern: "bg-amber-500",
};

export default function TreeNode({
  node,
  level = 0,
  onSelect,
  selectedId,
}) {
  const [expanded, setExpanded] = useState(level < 3);

  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node._id;

  const roleColor =
    ROLE_COLORS[node.designation] ||
    "bg-slate-100 text-slate-600 border-slate-200";

  const roleDot = ROLE_DOT[node.designation] || "bg-slate-400";

  return (
    <div className="select-none">
      {/* Node */}
      <div
        className={clsx(
          "relative flex items-center gap-2.5 py-2 px-2 rounded-xl cursor-pointer group",
          "transition-all duration-200",
          isSelected
            ? "bg-primary-50 ring-1 ring-primary-200 shadow-sm"
            : "hover:bg-white hover:shadow-sm"
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => onSelect?.(node)}
      >
        {/* Active indicator */}
        {isSelected && (
          <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary-500" />
        )}

        {/* Expand toggle */}
        <button
          type="button"
          className={clsx(
            "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0",
            "text-slate-400 transition-all duration-200",
            hasChildren
              ? "hover:bg-slate-100 hover:text-slate-700"
              : "cursor-default"
          )}
          onClick={(e) => {
            e.stopPropagation();

            if (hasChildren) {
              setExpanded((prev) => !prev);
            }
          }}
          aria-label={
            hasChildren
              ? expanded
                ? "Collapse"
                : "Expand"
              : "No children"
          }
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>

        {/* Avatar */}
        <div
          className={clsx(
            "relative w-9 h-9 rounded-xl flex items-center justify-center",
            "text-xs font-bold text-white flex-shrink-0 shadow-sm",
            roleDot
          )}
        >
          {node.designation === "CEO" ? (
            <Crown className="w-4 h-4" />
          ) : (
            node.name?.charAt(0)?.toUpperCase() || "?"
          )}

          {/* Online/status dot */}
          <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={clsx(
                "font-semibold text-sm truncate",
                isSelected
                  ? "text-primary-700"
                  : "text-slate-800"
              )}
            >
              {node.name}
            </span>

            <span
              className={clsx(
                "text-[10px] px-2 py-0.5 rounded-full border font-semibold whitespace-nowrap",
                "shadow-sm",
                roleColor
              )}
            >
              {node.designation}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-slate-400 truncate">
              {node.department || "No department"}
            </p>

            {hasChildren && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md flex-shrink-0">
                <Users className="w-3 h-3" />
                {node.children.length}
              </span>
            )}
          </div>
        </div>

        {/* Selected arrow */}
        {isSelected && (
          <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg bg-primary-100 text-primary-600">
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="relative ml-5 border-l border-slate-200/80">
          {/* Small connector */}
          <div className="absolute -left-px top-0 bottom-0 bg-gradient-to-b from-primary-200 via-slate-200 to-transparent w-px" />

          <div className="pl-1">
            {node.children.map((child) => (
              <TreeNode
                key={child._id}
                node={child}
                level={level + 1}
                onSelect={onSelect}
                selectedId={selectedId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

