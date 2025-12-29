import { useEffect, useState } from "react";

export default function Progress() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // TEMP: get enrolled courses from localStorage
    const enrolled =
      JSON.parse(localStorage.getItem("enrollments")) || [];

    setCourses(enrolled);
  }, []);

  const markCompleted = (courseId) => {
    const updatedCourses = courses.map((course) =>
      course.id === courseId
        ? { ...course, progress: 100, completed: true }
        : course
    );

    setCourses(updatedCourses);
    localStorage.setItem(
      "enrollments",
      JSON.stringify(updatedCourses)
    );
  };

  if (courses.length === 0) {
    return <p>No enrolled courses yet.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Course Progress
      </h1>

      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white p-5 rounded-xl shadow mb-4"
        >
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">
              {course.title}
            </h3>
            <span className="text-indigo-600">
              {course.progress || 0}%
            </span>
          </div>

          <div className="w-full bg-gray-200 h-3 rounded-full">
            <div
              className="bg-indigo-600 h-3 rounded-full"
              style={{
                width: `${course.progress || 0}%`,
              }}
            />
          </div>

          {!course.completed ? (
            <button
              onClick={() => markCompleted(course.id)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Mark as Completed
            </button>
          ) : (
            <p className="mt-4 text-green-600 font-medium">
              ✔ Completed
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
