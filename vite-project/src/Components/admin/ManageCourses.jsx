import { useEffect, useState } from "react";

const STORAGE_KEY = "courses";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
    image: "",
    instructor: "",
    duration: "",
  });

  useEffect(() => {
    const storedCourses =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setCourses(storedCourses);
  }, []);

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.price) {
      alert("Title and price are required");
      return;
    }

    const course = {
      ...newCourse,
      id: Date.now().toString(),
    };

    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedCourses)
    );

    setNewCourse({
      id: "",
      title: "",
      description: "",
      price: "",
      image: "",
      instructor: "",
      duration: "",
    });

    alert("Course added (temporary)");
  };

  const handleDeleteCourse = (id) => {
    const updatedCourses = courses.filter(
      (course) => course.id !== id
    );
    setCourses(updatedCourses);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedCourses)
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Manage Courses (Frontend Only)
      </h1>

      {/* ADD COURSE */}
      <div className="bg-white p-6 rounded-xl shadow border mb-8">
        <h3 className="font-semibold mb-4">
          Add New Course
        </h3>

        <input className="border p-2 w-full mb-2 rounded"
          placeholder="Title"
          value={newCourse.title}
          onChange={(e) =>
            setNewCourse({ ...newCourse, title: e.target.value })
          }
        />

        <input className="border p-2 w-full mb-2 rounded"
          placeholder="Description"
          value={newCourse.description}
          onChange={(e) =>
            setNewCourse({ ...newCourse, description: e.target.value })
          }
        />

        <input className="border p-2 w-full mb-2 rounded"
          placeholder="Price"
          value={newCourse.price}
          onChange={(e) =>
            setNewCourse({ ...newCourse, price: e.target.value })
          }
        />

        <input className="border p-2 w-full mb-2 rounded"
          placeholder="Image URL"
          value={newCourse.image}
          onChange={(e) =>
            setNewCourse({ ...newCourse, image: e.target.value })
          }
        />

        <input className="border p-2 w-full mb-4 rounded"
          placeholder="Instructor"
          value={newCourse.instructor}
          onChange={(e) =>
            setNewCourse({ ...newCourse, instructor: e.target.value })
          }
        />

        <button
          onClick={handleAddCourse}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Add Course
        </button>
      </div>

      {/* COURSE LIST */}
      <h3 className="font-semibold mb-4">
        All Courses
      </h3>

      {courses.length === 0 ? (
        <p>No courses added yet.</p>
      ) : (
        courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border rounded-xl p-4 mb-3 shadow-sm hover:shadow transition"
          >
            <h4 className="font-semibold">{course.title}</h4>
            <p>{course.description}</p>
            <p className="font-bold">₹{course.price}</p>

            {course.image && (
              <img
                src={course.image}
                alt={course.title}
                className="w-40 mt-2 rounded"
              />
            )}

            <button
              onClick={() => handleDeleteCourse(course.id)}
              className="mt-3 text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageCourses;
