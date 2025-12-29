import { useEffect, useState } from "react";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("enrollments")) || [];
    setCourses(data);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Enrolled Courses</h1>

      {courses.length === 0 ? (
        <p>No courses enrolled yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow p-4"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="mt-3 font-semibold">
                {course.title}
              </h2>
              <p className="text-indigo-600 font-bold">
                ₹{course.price}
              </p>
              <span className="text-green-600 text-sm font-medium">
                Enrolled
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
