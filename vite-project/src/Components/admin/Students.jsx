import { useEffect, useState } from "react";

const animationStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-up {
    animation: slideInUp 0.6s ease-out;
  }
`;

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("learnix_token");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/admin/students", {
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
      <div style={{ backgroundColor: 'var(--site-bg)' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      <div style={{ backgroundColor: 'var(--site-bg)' }} className="min-h-screen p-8">
        {/* Header */}
          <div className="mb-10 animate-slide-up">
          <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full">
            <span className="text-orange-600 font-semibold text-sm tracking-widest uppercase">Student Management</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manage <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Students</span>
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-lg">Total Students: <span className="font-bold text-orange-600">{students.length}</span></p>
            <div className="flex items-center gap-3">
              <input
                placeholder="Search..."
                onChange={(e) => {
                  const q = e.target.value.toLowerCase();
                  // simple client-side filter
                  if (!q) {
                    // refetch or reset - for simplicity, refetch from server
                    const token = localStorage.getItem("learnix_token");
                    if (token) fetch('/api/admin/students', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => setStudents(Array.isArray(d) ? d : []));
                    return;
                  }
                  setStudents((prev) => prev.filter(s => {
                    return (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q) || String(s.enrolled_courses_count || '').includes(q);
                  }));
                }}
                className="px-3 py-2 border border-slate-200 rounded-md w-64 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center animate-slide-up">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20H1v-2a3 3 0 015.856-1.487M13 16H9m4 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No students found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                  <tr>
                    <th className="p-4 font-bold text-gray-900 text-sm uppercase tracking-widest">Name</th>
                    <th className="p-4 font-bold text-gray-900 text-sm uppercase tracking-widest">Email</th>
                    <th className="p-4 font-bold text-gray-900 text-sm uppercase tracking-widest">Enrolled Courses</th>
                    <th className="p-4 font-bold text-gray-900 text-sm uppercase tracking-widest">Progress</th>
                    <th className="p-4 font-bold text-gray-900 text-sm uppercase tracking-widest">Status</th>
                    <th className="p-4 font-bold text-gray-900 text-sm uppercase tracking-widest">Actions</th>
                    <th className="p-4 font-bold text-gray-900 text-sm uppercase tracking-widest">Joined On</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student.id || idx} className="border-b hover:bg-orange-50/50 transition-colors">
                      <td className="p-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold">
                            {student.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          {student.name || "—"}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 font-medium">
                        {student.email || "—"}
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-bold">
                          <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2h1a1 1 0 100 2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1a1 1 0 100-2h1a2 2 0 012 2v10a4 4 0 01-4 4H8a4 4 0 01-4-4V5z" clipRule="evenodd" />
                          </svg>
                          {student.enrolled_courses_count || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="w-48">
                          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div style={{ width: `${student.avg_progress || 0}%` }} className="h-3 bg-gradient-to-r from-orange-400 to-orange-500"></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{student.avg_progress || 0}%</div>
                        </div>
                      </td>
                      <td className="p-4">
                        {(() => {
                          // Status logic:
                          // - If last activity within 7 days => Active
                          // - Else if enrollment/created date is older than 7 days AND avg_progress < 100 => Inactive
                          // - Otherwise Active
                          const now = Date.now();
                          const sevenDays = 7 * 24 * 60 * 60 * 1000;

                          const lastActivity = student.last_activity || student.lastActivity || null;
                          if (lastActivity) {
                            const last = new Date(lastActivity).getTime();
                            if (now - last <= sevenDays) {
                              return (
                                <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Active
                                </span>
                              );
                            }
                          }

                          const enrolledOn = student.enrolled_on || student.enrolledAt || student.created_at || student.createdAt || null;
                          if (enrolledOn) {
                            const started = new Date(enrolledOn).getTime();
                            const daysSince = Math.floor((now - started) / (24 * 60 * 60 * 1000));
                            const progress = Number(student.avg_progress || 0);
                            if (daysSince > 7 && progress < 100) {
                              return (
                                <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.707 7.707a1 1 0 010-1.414L9.586 4.414a1 1 0 011.414 0L12.293 5.707a1 1 0 010 1.414L10.414 9.999l1.879 1.879a1 1 0 01-1.414 1.414L9 11.414 7.707 12.707a1 1 0 01-1.414-1.414L7.586 9.999 5.707 8.121a1 1 0 011.414-1.414L9 8.586l-1.293-1.293z" />
                                  </svg>
                                  Inactive
                                </span>
                              );
                            }
                          }

                          return (
                            <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Active
                            </span>
                          );
                        })()}
                      </td>

                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button title="View" onClick={() => window.location.href = `/admin/students/${student.id}` } className="p-2 rounded-md bg-slate-50 hover:bg-slate-100">
                            <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          </button>
                          <button title="Edit" onClick={() => window.location.href = `/admin/students/edit/${student.id}` } className="p-2 rounded-md bg-slate-50 hover:bg-slate-100">
                            <svg className="w-4 h-4 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 font-medium">
                        {student.created_at
                          ? new Date(student.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
