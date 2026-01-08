import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [params] = useSearchParams();
  const redirect = params.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      login(data.user, data.user, data.token);

      if (redirect) navigate(redirect);
      else if (data.user.isAdmin) navigate("/admin");
      else navigate("/students");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7E5' }} className="min-h-[calc(100vh-80px)] flex items-start justify-center py-20 px-4">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to access your courses and dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          {error && (
            <p className="text-red-600 text-center mb-4 bg-red-50 p-3 rounded">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-200 outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-200 outline-none"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4 text-sm">
            Don't have an account? <a href="/register" className="text-orange-600 font-semibold hover:underline">Register</a>
          </p>

          <p className="text-center text-gray-600 mt-2 text-sm">
            <a href="/forgot-password" className="text-orange-600 font-semibold hover:underline">Forgot Password?</a>
          </p>
        </div>
      </div>
    </div>
  );
}
