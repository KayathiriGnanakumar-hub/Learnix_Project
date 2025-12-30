import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const ADMIN_EMAIL = "admin@learnix.com";
const ADMIN_PASSWORD = "admin123";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      /* =========================
         ADMIN LOGIN (FRONTEND RULE)
      ========================= */
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          email: ADMIN_EMAIL,
          name: "Admin",
          isAdmin: true,
        };

        localStorage.setItem("learnix_token", "admin-token");
        localStorage.setItem("learnix_user", JSON.stringify(adminUser));

        navigate("/admin");
        return;
      }

      /* =========================
         STUDENT LOGIN (BACKEND)
      ========================= */
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const studentUser = {
        ...data.user,
        isAdmin: false,
      };

      localStorage.setItem("learnix_token", data.token);
      localStorage.setItem("learnix_user", JSON.stringify(studentUser));

      navigate(redirect || "/students");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-700">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl w-96 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          Login
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
