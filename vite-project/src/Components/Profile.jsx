import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) {
    return <p className="pt-28 text-center">Loading profile...</p>;
  }

  if (!user || !profile) {
    return <p className="pt-28 text-center">No profile data found.</p>;
  }

  return (
    <section className="pt-28 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8">

        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          My Profile
        </h1>

        {/* PROFILE DETAILS */}
        <div className="space-y-4">

          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-semibold text-gray-800">
              {profile.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-semibold text-gray-800">
              {profile.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-full
              bg-indigo-100 text-indigo-700 text-sm font-semibold uppercase">
              {profile.role}
            </span>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={logout}
            className="px-8 py-3 bg-red-600 text-white rounded-lg
            font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </section>
  );
}

