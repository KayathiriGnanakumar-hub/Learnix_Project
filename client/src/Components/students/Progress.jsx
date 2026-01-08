import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaChartPie, FaBook } from "react-icons/fa";

export default function Progress() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("learnix_token");

  const fetchProgress = useCallback(async () => {
    try {
      const enrolled = await axios.get(
        "http://localhost:5001/api/enroll/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await Promise.all(
        enrolled.data.map(async (course) => {
          // Get video progress details
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

          // A course is complete if either:
          // 1. Enrolled with status='completed' and progress=100 (instant completion via payment)
          // 2. All videos watched (percent = 100)
          const isComplete = (course.status === 'completed' && course.progress === 100) || 
                            (percent === 100 && total > 0);

          return { 
            ...course, 
            percent: course.status === 'completed' ? 100 : percent,
            completed,
            total,
            isComplete
          };
        })
      );

      setCourses(data);
    } catch (err) {
      console.error("Progress fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-60">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-orange-500 mb-3"></div>
          <p className="text-slate-600">Loading progress...</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600 mb-4">No enrolled courses yet</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-slate-900 flex items-center gap-2"><FaChartPie /> Your Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div
            key={c.enrollment_id || c.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-slate-100"
          >
            {/* Course Title */}
            <div className="mb-3">
              <h3 className="font-semibold text-sm md:text-base text-slate-900 mb-0.5 line-clamp-2">{c.title}</h3>
              <p className="text-xs text-slate-500">{c.completed} of {c.total} videos</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-700">Progress</span>
                <span className="text-sm font-semibold text-orange-600">{c.percent}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all ${c.isComplete ? "bg-emerald-500" : "bg-orange-500"}`}
                  style={{ width: `${c.percent}%` }}
                />
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between pt-2">
              {c.isComplete ? (
                <div className="inline-flex items-center gap-2 text-sm text-green-600">
                  <span>🎉</span>
                  <span className="font-medium">Completed</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <span className="text-orange-500"><FaBook /></span>
                  <span>{c.total - c.completed} left</span>
                </div>
              )}
              <button
                onClick={() => window.location.href = `/course/${c.id || c.enrollment_id}`}
                className="ml-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md text-sm font-semibold hover:shadow-md transition"
              >
                Continue
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-white border border-slate-100 rounded-lg p-4 md:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Summary</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-orange-600">{courses.length}</p>
            <p className="text-xs text-slate-500">Courses Enrolled</p>
          </div>
          <div>
            <p className="text-xl font-bold text-green-600">{courses.filter(c => c.isComplete).length}</p>
            <p className="text-xs text-slate-500">Courses Completed</p>
          </div>
          <div>
            <p className="text-xl font-bold text-orange-600">{Math.round(courses.reduce((sum, c) => sum + c.percent, 0) / courses.length)}%</p>
            <p className="text-xs text-slate-500">Average Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
