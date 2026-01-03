import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("learnix_token", data.token);
      localStorage.setItem("learnix_user", JSON.stringify(data.user));

      // ✅ ALWAYS GO BACK TO REDIRECT PAGE
      if (redirect) {
        navigate(redirect);
      } else if (data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/students");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex justify-center px-4 pb-24">
      <div className="w-full max-w-md mt-28 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Login
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full px-4 py-3 border rounded-md"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full px-4 py-3 border rounded-md"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
