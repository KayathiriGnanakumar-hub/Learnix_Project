import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaUser } from "react-icons/fa";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCourses = useCallback(async () => {
    try {
      const token = localStorage.getItem("learnix_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(
        "http://localhost:5001/api/enroll/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          console.error("Unauthorized: Token may be invalid or expired");
          localStorage.removeItem("learnix_token");
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch courses");
      }

      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-300 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-6xl mb-4 text-orange-500"><FaBook /></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Courses Yet</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          You haven't enrolled in any courses yet. Start learning today!
        </p>
        <button
          onClick={() => navigate("/courses")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer border border-slate-100"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            {/* Course Image */}
            {course.image && (
              <div className="h-36 overflow-hidden bg-slate-50">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Course Info */}
            <div className="p-4">
              <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1 line-clamp-2">
                {course.title}
              </h3>

              <p className="text-xs md:text-sm text-slate-600 mb-3 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  {course.instructor && (
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500"><FaUser /></span>
                      <span className="truncate max-w-[8rem]">{course.instructor}</span>
                    </div>
                  )}
                  {course.duration && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">⏱️</span>
                      <span>{course.duration}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    ✓ Enrolled
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/course/${course.id}`);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-md hover:shadow-md transition-all text-sm"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
