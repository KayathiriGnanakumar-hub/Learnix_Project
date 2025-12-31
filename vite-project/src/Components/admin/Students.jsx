import { useEffect, useState } from "react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem("learnix_token");

  useEffect(() => {
    fetch("http://localhost:5001/api/admin/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch(console.error);
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Students</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Enrolled Courses</th>
              <th>Joined On</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="p-4 font-semibold">{s.name}</td>
                <td>{s.email}</td>
                <td className="max-w-md">
                  {s.enrolled_courses || "—"}
                </td>
                <td>
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
