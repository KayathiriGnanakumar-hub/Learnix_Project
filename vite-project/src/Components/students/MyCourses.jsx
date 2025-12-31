import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem("learnix_token");

      const res = await axios.get(
        "http://localhost:5001/api/enroll/my-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourses(res.data);
    } catch (error) {
      console.error("Failed to fetch my courses", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Enrolled Courses</h1>

        <button
          onClick={() => navigate("/courses")}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Explore Courses
        </button>
      </div>

      {courses.length === 0 ? (
        <p>No courses enrolled yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow p-4">
              <img
                src={course.image}
                alt={course.title}
                className="h-40 w-full object-cover rounded"
              />

              <h2 className="mt-3 font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-600">{course.description}</p>

              <span className="inline-block mt-2 text-green-600 text-sm font-medium">
                Enrolled
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
