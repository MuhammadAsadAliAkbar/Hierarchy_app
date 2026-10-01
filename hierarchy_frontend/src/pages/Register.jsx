
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Building2,
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handle = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password min 6 chars");
    }

    setLoading(true);

    try {
      await register(name, email, password);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-sky-100 px-4 py-8">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Premium card */}
        <div className="card w-full !rounded-2xl border border-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="relative inline-flex mb-4">
              <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl" />

              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-sky-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create Account
            </h1>

            <p className="text-slate-500 text-sm mt-1.5">
              Create your account to manage your organization
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handle} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <div className="relative mt-1.5">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />

                <input
                  type="text"
                  className="input !pl-11 !pr-4 transition-all duration-200 focus:ring-4 focus:ring-primary-500/10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>

              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />

                <input
                  type="email"
                  className="input !pl-11 !pr-4 transition-all duration-200 focus:ring-4 focus:ring-primary-500/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                <span className="text-xs text-slate-400">
                  Minimum 6 characters
                </span>
              </div>

              <div className="relative mt-1.5">
                <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />

                <input
                  type={showPassword ? "text" : "password"}
                  className="input !pl-11 !pr-11 transition-all duration-200 focus:ring-4 focus:ring-primary-500/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Security info */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />

              <p className="text-xs text-slate-500">
                Your account information is securely protected.
              </p>
            </div>

            {/* Register button */}
            <button
              type="submit"
              className="btn-primary w-full !py-3 !rounded-xl flex items-center justify-center gap-2 group shadow-md shadow-primary-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-5">
          Secure organization management
        </p>
      </div>
    </div>
  );
}

