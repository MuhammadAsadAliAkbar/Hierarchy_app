
import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../lib/api";
import {
  Plus,
  Trash2,
  Pencil,
  Search,
  Users,
  Mail,
  Building2,
  BriefcaseBusiness,
  UserCircle,
  X,
  Phone,
  Hash,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const ROLES = [
  "CEO",
  "Manager",
  "Project Manager",
  "Team Lead",
  "Junior",
  "Associate",
  "Intern",
];

const ROLE_STYLES = {
  CEO: "bg-purple-50 text-purple-700 border-purple-200",
  Manager: "bg-blue-50 text-blue-700 border-blue-200",
  "Project Manager": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Team Lead": "bg-cyan-50 text-cyan-700 border-cyan-200",
  Junior: "bg-green-50 text-green-700 border-green-200",
  Associate: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intern: "bg-amber-50 text-amber-700 border-amber-200",
};

const ROLE_DOTS = {
  CEO: "bg-purple-500",
  Manager: "bg-blue-500",
  "Project Manager": "bg-indigo-500",
  "Team Lead": "bg-cyan-500",
  Junior: "bg-green-500",
  Associate: "bg-emerald-500",
  Intern: "bg-amber-500",
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "Junior",
    department: "Engineering",
    parent: "",
    employeeId: "",
    salary: "",
    status: "active",
  });

  const fetchData = async () => {
    try {
      const res = await getEmployees(search ? { search } : {});
      setEmployees(res.data.data);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditId(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      designation: "Junior",
      department: "Engineering",
      parent: "",
      employeeId: "",
      salary: "",
      status: "active",
    });

    setShowModal(true);
  };

  const openEdit = (emp) => {
    setEditId(emp._id);

    setForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone || "",
      designation: emp.designation,
      department: emp.department || "",
      parent: emp.parent?._id || emp.parent || "",
      employeeId: emp.employeeId || "",
      salary: emp.salary || "",
      status: emp.status || "active",
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      salary: form.salary ? Number(form.salary) : 0,
      parent: form.parent || null,
    };

    try {
      if (editId) {
        await updateEmployee(editId, payload);
        toast.success("Updated");
      } else {
        await createEmployee(payload);
        toast.success("Created");
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Delete employee? Subordinates will be reassigned to their grandparent."
      )
    )
      return;

    try {
      await deleteEmployee(id);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Failed");
    }
  };

  const parentOptions = employees.filter((e) => e._id !== editId);

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Employees
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Manage employees and organizational reporting relationships
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              className="input pl-9 w-full sm:w-60 bg-white border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
            />
          </div>

          {/* Add Employee */}
          <button
            className="btn-primary flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
            onClick={openCreate}
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* =========================================================
          QUICK SUMMARY
      ========================================================= */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card flex items-center gap-3 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium">
                Total Employees
              </p>

              <p className="text-xl font-bold text-slate-800">
                {employees.length}
              </p>
            </div>
          </div>

          <div className="card flex items-center gap-3 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium">
                Active Employees
              </p>

              <p className="text-xl font-bold text-slate-800">
                {employees.filter((e) => e.status === "active").length}
              </p>
            </div>
          </div>

          <div className="card flex items-center gap-3 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <BriefcaseBusiness className="w-5 h-5 text-purple-600" />
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium">
                Departments
              </p>

              <p className="text-xl font-bold text-slate-800">
                {new Set(
                  employees
                    .map((e) => e.department)
                    .filter(Boolean)
                ).size}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          EMPLOYEE TABLE
      ========================================================= */}
      {loading ? (
        <div className="card flex flex-col items-center justify-center py-20 border border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-primary-500 animate-pulse" />
          </div>

          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary-600 mb-3" />

          <p className="text-sm text-slate-500">
            Loading employees...
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0 border border-slate-100 shadow-sm">
          {/* Table header */}
          <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-white via-white to-primary-50/30">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-800">
                  Employee Directory
                </h2>

                <p className="text-xs text-slate-400 mt-0.5">
                  View and manage your organization members
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-500">
                  {employees.length} Records
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                  <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-400">
                    Employee
                  </th>

                  <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-400">
                    Designation
                  </th>

                  <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-400">
                    Department
                  </th>

                  <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-400">
                    Reports To
                  </th>

                  <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {employees.map((e) => (
                  <tr
                    key={e._id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Employee */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {e.name?.charAt(0)?.toUpperCase() || "?"}

                          <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                        </div>

                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 truncate">
                            {e.name}
                          </div>

                          <div className="flex items-center gap-1 text-xs text-slate-400 truncate mt-0.5">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{e.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Designation */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold whitespace-nowrap ${
                          ROLE_STYLES[e.designation] ||
                          "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ROLE_DOTS[e.designation] || "bg-slate-400"
                          }`}
                        />

                        {e.designation}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="whitespace-nowrap">
                          {e.department || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Parent */}
                    <td className="px-5 py-4">
                      {e.parent?.name ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                            <UserCircle className="w-4 h-4 text-slate-500" />
                          </div>

                          <span className="text-slate-600 whitespace-nowrap">
                            {e.parent.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          e.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : e.status === "on-leave"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            e.status === "active"
                              ? "bg-emerald-500"
                              : e.status === "on-leave"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                          }`}
                        />

                        {e.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(e)}
                          title="Edit employee"
                          className="w-8 h-8 flex items-center justify-center text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(e._id)}
                          title="Delete employee"
                          className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {employees.length === 0 && (
            <div className="py-14 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-slate-300" />
              </div>

              <h3 className="font-semibold text-slate-700 mb-1">
                No Employees Found
              </h3>

              <p className="text-sm text-slate-400">
                Run seed or add your first employee.
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          CREATE / EDIT MODAL
      ========================================================= */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/20 w-full max-w-lg max-h-[90vh] overflow-hidden border border-white/80">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-primary-50/40">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                    {editId ? (
                      <Pencil className="w-5 h-5 text-primary-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-primary-600" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {editId ? "Edit Employee" : "Add Employee"}
                    </h2>

                    <p className="text-xs text-slate-400 mt-0.5">
                      {editId
                        ? "Update employee information"
                        : "Add a new member to your organization"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-150px)]">
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4"
              >
                {/* Name / Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Name *
                    </label>

                    <div className="relative mt-1">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        className="input pl-9"
                        value={form.name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            name: e.target.value,
                          })
                        }
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Email *
                    </label>

                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="email"
                        className="input pl-9"
                        value={form.email}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            email: e.target.value,
                          })
                        }
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Designation / Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Designation *
                    </label>

                    <div className="relative mt-1">
                      <BriefcaseBusiness className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                      <select
                        className="input pl-9"
                        value={form.designation}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            designation: e.target.value,
                          })
                        }
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Department
                    </label>

                    <div className="relative mt-1">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                      <input
                        className="input pl-9"
                        value={form.department}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            department: e.target.value,
                          })
                        }
                        placeholder="Engineering"
                      />
                    </div>
                  </div>
                </div>

                {/* Parent */}
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Reports To (Parent)
                  </label>

                  <select
                    className="input mt-1"
                    value={form.parent}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        parent: e.target.value,
                      })
                    }
                  >
                    <option value="">— None (for CEO) —</option>

                    {parentOptions.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.designation})
                      </option>
                    ))}
                  </select>

                  <div className="mt-2 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      <span className="font-semibold text-slate-600">
                        Hierarchy rules:
                      </span>{" "}
                      Manager → CEO, PM → Manager, TL → PM,
                      Junior/Associate → TL, Intern → TL/Junior
                    </p>
                  </div>
                </div>

                {/* Employee ID / Salary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Employee ID
                    </label>

                    <div className="relative mt-1">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        className="input pl-9"
                        value={form.employeeId}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            employeeId: e.target.value,
                          })
                        }
                        placeholder="EMP-001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Salary
                    </label>

                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="number"
                        className="input pl-9"
                        value={form.salary}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            salary: e.target.value,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone / Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Phone
                    </label>

                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        className="input pl-9"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+92..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">
                      Status
                    </label>

                    <select
                      className="input mt-1"
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    className="btn-secondary flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-primary flex-1 shadow-sm"
                  >
                    {editId ? "Update Employee" : "Create Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

