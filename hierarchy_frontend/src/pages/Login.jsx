
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Building2,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("admin@hierarchy.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="relative inline-flex mb-4">
              <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl" />

              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-sky-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hierarchy Manager
            </h1>

            <p className="text-slate-500 text-sm mt-1.5">
              Sign in to manage your organization
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handle} className="space-y-5">
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
                  placeholder="Enter your email"
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
                  Secure access
                </span>
              </div>

              <div className="relative mt-1.5">
                <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />

                <input
                  type={showPassword ? "text" : "password"}
                  className="input !pl-11 !pr-11 transition-all duration-200 focus:ring-4 focus:ring-primary-500/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Sign in */}
            <button
              type="submit"
              className="btn-primary w-full !py-3 !rounded-xl flex items-center justify-center gap-2 group shadow-md shadow-primary-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-xl border border-primary-100 bg-primary-50/60 px-4 py-3.5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary-600" />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Demo Account
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  admin@hierarchy.com
                </p>

                <p className="text-xs text-slate-500">
                  Password: admin123
                </p>
              </div>
            </div>
          </div>

          {/* Register */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                Create account
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

