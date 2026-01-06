import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  CheckCircle,
  Award,
  Briefcase,
  Users,
  TrendingUp,
} from "lucide-react";

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
  .stagger-4 { animation-delay: 0.4s; }
`;

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
        "http://localhost:5001/api/enroll/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Count completed courses (status='completed' and progress=100)
      const completed = res.data.filter(
        (course) => course.status === 'completed' && course.progress === 100
      ).length;

      setStats((prev) => ({
        ...prev,
        enrolled: res.data.length,
        completed: completed,
        certificates: completed, // Certificates = completed courses
      }));
    } catch (err) {
      console.error("Student dashboard stats error:", err);
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div style={{ backgroundColor: '#FFFBF7' }}>
        {/* Header Section */}
        <div className="mb-12 animate-fade-scale">
          <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full">
            <span className="text-orange-600 font-semibold text-sm tracking-widest uppercase">Dashboard Overview</span>
          </div>
          <h1 className="text-5xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome Back, <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">{name}</span> 👋
          </h1>
          <p className="text-gray-600 text-lg">Monitor your learning progress and achievements</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="animate-slide-up stagger-1">
            <StatCard
              title="Enrolled Courses"
              value={stats.enrolled}
              icon={BookOpen}
              gradientFrom="from-blue-500"
              gradientTo="to-blue-600"
              bgColor="blue"
            />
          </div>
          <div className="animate-slide-up stagger-2">
            <StatCard
              title="Completed Courses"
              value={stats.completed}
              icon={CheckCircle}
              gradientFrom="from-green-500"
              gradientTo="to-green-600"
              bgColor="green"
            />
          </div>
          <div className="animate-slide-up stagger-3">
            <StatCard
              title="Certificates Earned"
              value={stats.certificates}
              icon={Award}
              gradientFrom="from-orange-500"
              gradientTo="to-orange-600"
              bgColor="orange"
            />
          </div>
          <div className="animate-slide-up stagger-4">
            <StatCard
              title="Internship Opportunities"
              value="Available"
              icon={Briefcase}
              gradientFrom="from-purple-500"
              gradientTo="to-purple-600"
              bgColor="purple"
              isText={true}
            />
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Learning Progress Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 animate-slide-up stagger-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Learning Progress</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-semibold text-gray-900">Overall Progress</span>
                  <span className="text-orange-600 font-bold text-lg">
                    {stats.enrolled > 0 ? Math.round((stats.completed / stats.enrolled) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.enrolled > 0 ? (stats.completed / stats.enrolled) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 hover:shadow-md transition">
                  <svg className="w-6 h-6 text-blue-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2c0 1.05.23 2.05.68 2.907C3.72 10.735 4.5 12.25 4.5 14v4a2 2 0 104 0v-4c0-1.75.78-3.265 1.82-4.093C10.77 9.05 11 8.05 11 7V5a2 2 0 10-4 0v2H5V5a2 2 0 00-2-2zm12 0a2 2 0 00-2 2v2c0 1.05.23 2.05.68 2.907C15.72 10.735 16.5 12.25 16.5 14v4a2 2 0 104 0v-4c0-1.75.78-3.265 1.82-4.093C19.77 9.05 20 8.05 20 7V5a2 2 0 10-4 0v2h-3V5a2 2 0 00-2-2z" />
                  </svg>
                  <p className="text-gray-600 text-sm mb-1 font-medium">Active</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.enrolled - stats.completed}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200 hover:shadow-md transition">
                  <svg className="w-6 h-6 text-green-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-600 text-sm mb-1 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200 hover:shadow-md transition">
                  <svg className="w-6 h-6 text-orange-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <p className="text-gray-600 text-sm mb-1 font-medium">Certificates</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.certificates}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 animate-slide-up stagger-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Next Steps</h2>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-md transition">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Complete Courses</p>
                  <p className="text-sm text-gray-600">Finish your enrolled courses with dedication</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Earn Certificates</p>
                  <p className="text-sm text-gray-600">Download your industry-recognized certificates</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Apply for Internships</p>
                  <p className="text-sm text-gray-600">Get real-world experience with top companies</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, icon: Icon, gradientFrom, gradientTo, bgColor, isText = false }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} p-6 flex items-center justify-between`}>
        <div>
          <p className="text-white text-sm font-medium opacity-90 uppercase tracking-widest">{title}</p>
          <p className={`text-4xl font-bold text-white mt-3`}>{value}</p>
        </div>
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}

