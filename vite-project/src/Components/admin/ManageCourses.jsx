import { useEffect, useState } from "react";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    instructor: "",
    duration: "",
  });

  /* =========================
     FETCH COURSES
  ========================= */
  const fetchCourses = async () => {
    const res = await fetch("http://localhost:5001/api/courses");
    const data = await res.json();
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* =========================
     ADD COURSE
  ========================= */
  const handleAdd = async () => {
    if (!form.title || !form.price) {
      alert("Title & price required");
      return;
    }

    await fetch("http://localhost:5001/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("learnix_token")}`,
      },
      body: JSON.stringify(form),
    });

    resetForm();
    fetchCourses();
  };

  /* =========================
     START EDIT
  ========================= */
  const startEdit = (course) => {
    setEditingId(course.id);
    setForm(course);
  };

  /* =========================
     UPDATE COURSE
  ========================= */
  const handleUpdate = async () => {
    await fetch(
      `http://localhost:5001/api/courses/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("learnix_token")}`,
        },
        body: JSON.stringify(form),
      }
    );

    resetForm();
    fetchCourses();
  };

  /* =========================
     DELETE COURSE
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    await fetch(
      `http://localhost:5001/api/courses/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("learnix_token")}`,
        },
      }
    );

    fetchCourses();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      price: "",
      image: "",
      instructor: "",
      duration: "",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Manage Courses
      </h1>

      {/* =========================
          ADD / EDIT FORM
      ========================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="font-semibold mb-4">
          {editingId ? "Edit Course" : "Add Course"}
        </h2>

        {[
          ["title", "Title"],
          ["description", "Description"],
          ["price", "Price"],
          ["image", "Image URL"],
          ["instructor", "Instructor"],
          ["duration", "Duration"],
        ].map(([key, label]) => (
          <input
            key={key}
            className="border p-2 w-full mb-3 rounded"
            placeholder={label}
            value={form[key]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        ))}

        <div className="flex gap-3">
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-green-600 text-white rounded"
              >
                Update
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-indigo-600 text-white rounded"
            >
              Add Course
            </button>
          )}
        </div>
      </div>

      {/* =========================
          COURSE LIST
      ========================= */}
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white border rounded-xl p-4 mb-4 shadow"
        >
          <h3 className="font-semibold text-lg">
            {course.title}
          </h3>

          <p>{course.description}</p>
          <p className="font-bold">₹{course.price}</p>

          {course.image && (
            <img
              src={course.image}
              alt={course.title}
              className="w-40 mt-2 rounded"
            />
          )}

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => startEdit(course)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(course.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
