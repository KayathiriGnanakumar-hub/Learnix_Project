import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [name, setName] = useState("Student");

  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    certificates: 0,
    internshipStatus: "Not Eligible",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("learnix_user"));
    if (user?.name) setName(user.name);

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("learnix_token");

      const res = await axios.get(
        "http://localhost:5001/api/enroll/my-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats((prev) => ({
        ...prev,
        enrolled: res.data.length,
      }));
    } catch (err) {
      console.error("Student dashboard stats error:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        Welcome, <span className="text-violet-700">{name}</span> 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Enrolled Courses" value={stats.enrolled} color="violet" />
        <Card title="Completed Courses" value={0} color="green" />
        <Card title="Certificates Earned" value={0} color="purple" />
        <Card title="Internship Status" value="Not Eligible" color="yellow" />
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`bg-white rounded-xl shadow p-5 border-2 border-${color}-300`}>
      <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );
}
