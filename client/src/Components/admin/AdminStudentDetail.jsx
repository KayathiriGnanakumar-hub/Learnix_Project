import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminStudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("learnix_token");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/admin/students/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        if (!res.ok) {
          console.error("Failed to fetch student detail", res.status);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStudent();
  }, [id, token]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!student) return <div className="p-8">Student not found or access denied.</div>;

  return (
    <div style={{ backgroundColor: 'var(--site-bg)' }} className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{student.name}</h2>
            <p className="text-sm text-gray-600">{student.email}</p>
          </div>
          <div>
            <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-md bg-slate-800 text-white">Back</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-gray-500">Joined</h4>
              <p className="font-medium">{student.created_at ? new Date(student.created_at).toLocaleString() : '—'}</p>
            </div>

            <div>
              <h4 className="text-sm text-gray-500">Enrolled Courses</h4>
              <p className="font-medium">{student.enrolled_courses || '—'}</p>
            </div>

            <div>
              <h4 className="text-sm text-gray-500">Courses Count</h4>
              <p className="font-medium">{student.enrolled_courses_count || 0}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-gray-500">Average Progress</h4>
              <p className="font-medium">{student.avg_progress || 0}%</p>
            </div>

            <div>
              <h4 className="text-sm text-gray-500">Last Activity</h4>
              <p className="font-medium">{student.last_activity ? new Date(student.last_activity).toLocaleString() : '—'}</p>
            </div>

            <div>
              <h4 className="text-sm text-gray-500">Raw Data</h4>
              <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(student, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
