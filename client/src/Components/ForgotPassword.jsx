import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("If an account with that email exists, a password reset link has been sent. Please check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF7E5' }} className="min-h-[calc(100vh-80px)] flex items-start justify-center py-20 px-4">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Forgot Password</h1>
          <p className="text-gray-600 mt-2">Enter your email to receive a password reset link</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          {error && (
            <p className="text-red-600 text-center mb-4 bg-red-50 p-3 rounded">
              {error}
            </p>
          )}

          {message && (
            <p className="text-green-600 text-center mb-4 bg-green-50 p-3 rounded">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-200 outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4 text-sm">
            Remember your password? <a href="/login" className="text-orange-600 font-semibold hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}