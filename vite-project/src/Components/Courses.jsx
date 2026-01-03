import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/courses")
      .then((res) => res.json())
      .then((data) => {
        console.log("COURSES FROM API:", data);
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="pt-28 text-center text-gray-600">
        Loading courses...
      </section>
    );
  }

  return (
    <section id="courses" className="pt-28 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-700 mb-10">
          Our Courses
        </h1>

        {courses.length === 0 ? (
          <p className="text-center text-gray-500">
            No courses available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
              >
                <div className="h-36 mb-4 overflow-hidden rounded-xl">
                  <img
                    src={
                      course.image
                        ? course.image.startsWith("http")
                          ? course.image
                          : `http://localhost:5001${course.image.startsWith("/") ? "" : "/"}${course.image}`
                        : "/placeholder.jpg"
                    }
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-[15px] font-semibold text-indigo-700 mb-2">
                  {course.title}
                </h3>

                {course.duration && (
                  <p className="text-xs text-gray-500 mb-1">
                    Duration:{" "}
                    <span className="font-semibold">
                      {course.duration}
                    </span>
                  </p>
                )}

                <p className="text-purple-700 font-bold text-sm mb-4">
                  ₹{course.price}
                </p>

                <Link
                  to={`/course/${course.id}`}
                  className="mt-auto text-center border-2 border-indigo-700 text-indigo-700
                  py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 hover:text-white transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
