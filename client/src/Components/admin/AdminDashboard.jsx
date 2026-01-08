import { useEffect, useState } from "react";
import { IoSchool, IoPeople, IoLayers } from "react-icons/io5";

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
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-slide-up {
    animation: slideInUp 0.6s ease-out;
  }
  
  .animate-fade-scale {
    animation: fadeInScale 0.6s ease-out;
  }
  
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
`;

const Card = ({ title, value, icon, bgGradient, iconBg, index }) => (
  <div
    className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-slide-up stagger-${index}`}
  >
    <div className={`${bgGradient} p-6 flex items-center justify-between`}>
      <div>
        <p className="text-white text-sm font-medium opacity-90 uppercase tracking-widest">{title}</p>
        <p className="text-4xl font-bold text-white mt-3">{value}</p>
      </div>
      <div className={`${iconBg} p-4 rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("learnix_token");
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
        });
        if (!res.ok) return;
        const data = await res.json();
        setTotalStudents(data.totalStudents || 0);
        setTotalCourses(data.totalCourses || 0);
        setTotalEnrollments(data.totalEnrollments || 0);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const enrolled =
      JSON.parse(localStorage.getItem("enrolled_courses")) || [];
    setTotalEnrollments(enrolled.length);
  }, []);
  

  return (
    <>
      <style>{animationStyles}</style>
      <div style={{ backgroundColor: '#FFFBF7' }} className="min-h-screen p-8">
        {/* Header Section */}
        <div className="mb-12 animate-fade-scale">
          <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full">
            <span className="text-orange-600 font-semibold text-sm tracking-widest uppercase">Platform Statistics</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Admin <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Complete overview of platform performance and user metrics
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card
            title="Total Courses"
            value={totalCourses}
            bgGradient="bg-gradient-to-br from-indigo-500 to-purple-600"
            iconBg="bg-indigo-400/20"
            icon={<IoSchool className="w-8 h-8 text-white" />}
            index={1}
          />

          <Card
            title="Total Students"
            value={totalStudents}
            bgGradient="bg-gradient-to-br from-green-500 to-green-600"
            iconBg="bg-green-400/20"
            icon={<IoPeople className="w-8 h-8 text-white" />}
            index={2}
          />

          <Card
            title="Total Enrollments"
            value={totalEnrollments}
            bgGradient="bg-gradient-to-br from-orange-500 to-orange-600"
            iconBg="bg-orange-400/20"
            icon={<IoLayers className="w-8 h-8 text-white" />}
            index={3}
          />
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 animate-slide-up stagger-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Manage Courses</h3>
            </div>
            <p className="text-gray-600 mb-4">Create, update, and manage all courses in the platform. Monitor course engagement and student feedback.</p>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
              Go to Courses
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 animate-slide-up stagger-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.5 3A1.5 1.5 0 001 4.5v.006c0 .524.205 1.009.541 1.362.524.607 1.364 1.132 2.333 1.132.467 0 .912-.104 1.292-.307a1 1 0 00.9-1.107V4.5A1.5 1.5 0 002.5 3zM14 4.5A1.5 1.5 0 0012.5 3h-8A1.5 1.5 0 003 4.5v2a1.5 1.5 0 001.5 1.5h8a1.5 1.5 0 001.5-1.5v-2zM16.5 7a1.5 1.5 0 00-1.5 1.5v.006c0 .524.205 1.009.541 1.362.524.607 1.364 1.132 2.333 1.132.467 0 .912-.104 1.292-.307a1 1 0 00.9-1.107V8.5A1.5 1.5 0 0016.5 7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Manage Students</h3>
            </div>
            <p className="text-gray-600 mb-4">View student profiles, track progress, and manage enrollments. Support students in their learning journey.</p>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300">
              View Students
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 animate-slide-up stagger-3">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Manage Admins</h3>
            </div>
            <p className="text-gray-600 mb-4">Grant access to other team members and manage admin accounts. Only permanent admin can create new admins.</p>
            <a href="/admin/manage" className="w-full inline-block px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 text-center">
              Manage Admins
            </a>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 animate-slide-up stagger-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <p className="text-gray-600 text-sm font-medium mb-2">Active Courses</p>
              <p className="text-3xl font-bold text-blue-600">{totalCourses || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Ready for enrollment</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <p className="text-gray-600 text-sm font-medium mb-2">Registered Students</p>
              <p className="text-3xl font-bold text-green-600">{totalStudents || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Learning on platform</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <p className="text-gray-600 text-sm font-medium mb-2">Active Enrollments</p>
              <p className="text-3xl font-bold text-orange-600">{totalEnrollments || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Current course registrations</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
