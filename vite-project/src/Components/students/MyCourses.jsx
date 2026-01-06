import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await res.json();
      setCourses(data || []);
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
        <div className="text-6xl mb-4">📚</div>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            {/* Course Image */}
            {course.image && (
              <div className="h-48 bg-linear-to-br from-indigo-500 to-blue-600 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}

            {/* Course Info */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {course.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="space-y-2 text-sm text-gray-700 mb-4">
                {course.instructor && (
                  <div className="flex items-center gap-2">
                    <span>👨‍🏫</span>
                    <span>{course.instructor}</span>
                  </div>
                )}
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{course.duration}</span>
                  </div>
                )}
                {course.price && (
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span className="font-bold text-indigo-600">${course.price}</span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  ✓ Enrolled
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/course/${course.id}`);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded transition-all text-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
