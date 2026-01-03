import { useEffect, useState } from "react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("learnix_token");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/admin/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          console.error("Failed to fetch students:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Students data:", data);
        
        // Transform the data to ensure we have proper structure
        const transformedStudents = Array.isArray(data) ? data : [];
        setStudents(transformedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStudents();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-teal-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-600 text-sm mt-1">Total Students: {students.length}</p>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-slate-600">No students found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-600 border-b">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Enrolled Courses</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Joined On</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, idx) => (
                <tr key={student.id || idx} className="border-t hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">
                    {student.name || "—"}
                  </td>
                  <td className="p-4 text-slate-700">
                    {student.email || "—"}
                  </td>
                  <td className="p-4 text-slate-700">
                    <span className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                      {student.enrolled_courses_count || 0} courses
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-slate-700">
                    {student.created_at
                      ? new Date(student.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
