import { useEffect, useState } from "react";
import axios from "axios";

export default function Progress() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("learnix_token");

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const enrolled = await axios.get(
        "http://localhost:5001/api/enroll/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await Promise.all(
        enrolled.data.map(async (course) => {
          const res = await axios.get(
            `http://localhost:5001/api/progress/${course.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const total = res.data.total || 0;
          const completed = res.data.completed || 0;
          const percent =
            total === 0 ? 0 : Math.round((completed / total) * 100);

          return { 
            ...course, 
            percent,
            completed,
            total,
            isComplete: percent === 100 && total > 0
          };
        })
      );

      setCourses(data);
    } catch (err) {
      console.error("Progress fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-300 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading progress...</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No enrolled courses yet</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">📊 Your Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div 
            key={c.id} 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-gray-100"
          >
            {/* Course Title */}
            <div className="mb-4">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{c.title}</h3>
              <p className="text-sm text-gray-600">
                {c.completed} of {c.total} videos completed
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Progress</span>
                <span className="text-lg font-bold text-indigo-600">{c.percent}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all ${
                    c.isComplete 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                      : "bg-gradient-to-r from-indigo-500 to-blue-500"
                  }`}
                  style={{ width: `${c.percent}%` }}
                />
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {c.isComplete ? (
                <div className="inline-flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  <span className="text-sm font-bold text-green-600">Course Complete!</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  <span className="text-sm text-gray-600">
                    {c.total - c.completed} videos left
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">{courses.length}</p>
            <p className="text-gray-600">Courses Enrolled</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {courses.filter(c => c.isComplete).length}
            </p>
            <p className="text-gray-600">Courses Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {Math.round(courses.reduce((sum, c) => sum + c.percent, 0) / courses.length)}%
            </p>
            <p className="text-gray-600">Average Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
