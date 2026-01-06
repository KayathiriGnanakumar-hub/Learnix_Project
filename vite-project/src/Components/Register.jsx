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
    <div style={{ backgroundColor: '#FAF7E5' }} className="min-h-[calc(100vh-80px)] flex items-start justify-center py-20 px-4">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Create your account</h1>
          <p className="text-gray-600 mt-2">Join E-LearnHub and start learning today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm" name="name" placeholder="Full Name" onChange={handleChange} required />
            <input className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm" name="email" placeholder="Email" onChange={handleChange} required />
            <input className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm" type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm" type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold transition hover:shadow-lg">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
