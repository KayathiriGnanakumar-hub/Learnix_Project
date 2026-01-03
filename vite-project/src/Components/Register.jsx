import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5001/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex justify-center px-4 pb-24">
      <div className="w-full max-w-md mt-28 bg-white p-8 rounded-xl shadow-md animate-fadeUp">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center animate-fadeUp animate-delay-1">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full px-4 py-3 border rounded-md animate-delay-1 animate-fadeUp" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input className="w-full px-4 py-3 border rounded-md animate-delay-2 animate-fadeUp" name="email" placeholder="Email" onChange={handleChange} required />
          <input className="w-full px-4 py-3 border rounded-md animate-delay-3 animate-fadeUp" type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input className="w-full px-4 py-3 border rounded-md animate-delay-4 animate-fadeUp" type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold transition hover:scale-[1.03] active:scale-95">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
