import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(null);

  useEffect(() => {
    // Optionally, you could verify the token here, but for now we'll let the backend handle it
    setValidToken(true);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Basic client-side validation (server will do more thorough validation)
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setError("Password must contain uppercase, lowercase, number, and special character");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        // Handle validation errors from server
        if (data.errors) {
          setError(data.errors.join(", "));
        } else {
          throw new Error(data.message);
        }
        return;
      }

      setMessage("Password reset successful! All sessions have been invalidated. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (validToken === null) {
    return (
      <div style={{ backgroundColor: '#FAF7E5' }} className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div style={{ backgroundColor: '#FAF7E5' }} className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <div className="max-w-xl w-full mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-8">This password reset link is invalid or has expired.</p>
          <a href="/forgot-password" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
            Request New Reset Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF7E5' }} className="min-h-[calc(100vh-80px)] flex items-start justify-center py-20 px-4">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your new password</p>
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
              type="password"
              placeholder="New Password (min 8 chars, uppercase, lowercase, number, special)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={8}
            />

            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-200 outline-none"
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={8}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
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