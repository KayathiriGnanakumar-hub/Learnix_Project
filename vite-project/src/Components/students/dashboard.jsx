import { useEffect, useState } from "react";

export default function dashboard() {
  const [name, setName] = useState("Student");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("learnix_user"));
    if (user?.name) {
      setName(user.name);
    }
  }, []);

  return (
    <div>
      {/* WELCOME HEADING */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        Welcome, <span className="text-violet-700">{name}</span> 👋
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-5 border-2 border-violet-300">
          <h3 className="font-semibold text-gray-700 mb-1">
            Enrolled Courses
          </h3>
          <p className="text-3xl font-bold text-violet-600">
            0
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border-2 border-green-300">
          <h3 className="font-semibold text-gray-700 mb-1">
            Completed Courses
          </h3>
          <p className="text-3xl font-bold text-green-600">
            0
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border-2 border-purple-300">
          <h3 className="font-semibold text-gray-700 mb-1">
            Certificates Earned
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            0
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border-2 border-yellow-300">
          <h3 className="font-semibold text-gray-700 mb-1">
            Internship Status
          </h3>
          <p className="text-yellow-600 font-semibold">
            Not Eligible
          </p>
        </div>

      </div>
    </div>
  );
}
