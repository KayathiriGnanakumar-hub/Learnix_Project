import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaChartLine, FaExclamationTriangle, FaChartBar } from "react-icons/fa";

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

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out;
  }
`;

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");
  const token = localStorage.getItem("learnix_token");
  const navigate = useNavigate();

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
        const transformedStudents = Array.isArray(data) ? data : [];
        setStudents(transformedStudents);
        setFilteredStudents(transformedStudents);
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

  // Helper function to get student status
  const getStudentStatus = (student) => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const lastActivity = student.last_activity || student.lastActivity || null;

    if (lastActivity) {
      const last = new Date(lastActivity).getTime();
      if (now - last <= sevenDays) return "active";
    }

    const enrolledOn = student.enrolled_on || student.enrolledAt || student.created_at || student.createdAt || null;
    if (enrolledOn) {
      const started = new Date(enrolledOn).getTime();
      const daysSince = Math.floor((now - started) / (24 * 60 * 60 * 1000));
      const progress = Number(student.avg_progress || 0);
      if (daysSince > 7 && progress < 100) return "inactive";
    }

    return "active";
  };

  // Filter and sort students
  useEffect(() => {
    let result = [...students];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter(s => getStudentStatus(s) === filterStatus);
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "progress") {
      result.sort((a, b) => (b.avg_progress || 0) - (a.avg_progress || 0));
    } else if (sortBy === "courses") {
      result.sort((a, b) => (b.enrolled_courses_count || 0) - (a.enrolled_courses_count || 0));
    }

    setFilteredStudents(result);
  }, [students, searchQuery, sortBy, filterStatus]);

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
            <span className="text-orange-600 font-semibold text-sm tracking-widest uppercase flex items-center gap-2"><FaUsers /> Student Management</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manage <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Students</span>
          </h1>
          <p className="text-gray-600 text-lg">Monitor and manage {students.length} student(s) learning progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{students.length}</p>
              </div>
              <div className="text-4xl text-orange-500"><FaUsers /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {students.filter(s => getStudentStatus(s) === "active").length}
                </p>
              </div>
              <div className="text-4xl text-green-500"><FaChartLine /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Inactive</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {students.filter(s => getStudentStatus(s) === "inactive").length}
                </p>
              </div>
              <div className="text-4xl text-red-500"><FaExclamationTriangle /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Avg Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {students.length > 0 
                    ? Math.round(students.reduce((sum, s) => sum + (s.avg_progress || 0), 0) / students.length)
                    : 0}%
                </p>
              </div>
              <div className="text-4xl text-blue-500"><FaChartBar /></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Students</label>
              <input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="all">All Students</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="name">Name (A-Z)</option>
                <option value="progress">Progress (High to Low)</option>
                <option value="courses">Courses Enrolled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center animate-slide-up">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20H1v-2a3 3 0 015.856-1.487M13 16H9m4 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No students found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-900 text-xs">NAME</th>
                    <th className="text-left p-3 font-semibold text-gray-900 text-xs">EMAIL</th>
                    <th className="text-left p-3 font-semibold text-gray-900 text-xs">COURSES ENROLLED</th>
                    <th className="text-left p-3 font-semibold text-gray-900 text-xs">PROGRESS</th>
                    <th className="text-left p-3 font-semibold text-gray-900 text-xs">STATUS</th>
                    <th className="text-left p-3 font-semibold text-gray-900 text-xs">JOINED</th>
                    <th className="text-center p-3 font-semibold text-gray-900 text-xs">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, idx) => {
                    const status = getStudentStatus(student);
                    return (
                      <tr key={student.id || idx} className="border-b hover:bg-orange-50/30 transition">
                        <td className="p-3 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                              {student.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            {student.name || "Unknown"}
                          </div>
                        </td>
                        <td className="p-3 text-gray-600 text-xs">{student.email || "—"}</td>
                        <td className="p-3">
                          <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                            {student.enrolled_courses_count || 0}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${student.avg_progress || 0}%` }}
                                className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
                              ></div>
                            </div>
                            <span className="text-orange-600 font-bold text-xs">{student.avg_progress || 0}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-red-500"}`}></span>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600 text-xs">
                          {student.created_at
                            ? new Date(student.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                            : "—"}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            title="View Details"
                            onClick={() => navigate(`/admin/students/${student.id}`)}
                            className="px-3 py-1 bg-orange-500 text-white rounded-md text-xs font-semibold hover:bg-orange-600 transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
