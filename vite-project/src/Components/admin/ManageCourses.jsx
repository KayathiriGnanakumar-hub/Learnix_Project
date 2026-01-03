import { useEffect, useState } from "react";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [editingVideoId, setEditingVideoId] = useState(null);

  /* =========================
     COURSE FORM
  ========================= */
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    instructor: "",
    duration: "",
  });

  /* =========================
     VIDEO FORM (NEW)
  ========================= */
  const [videoForm, setVideoForm] = useState({
    courseId: "",
    title: "",
    youtubeUrl: "",
    orderNo: "",
  });

  /* =========================
     FETCH COURSES
  ========================= */
  const fetchCourses = async () => {
    const res = await fetch("http://localhost:5001/api/courses");
    const data = await res.json();
    setCourses(data);
  };

  /* =========================
     FETCH VIDEOS
  ========================= */
  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/videos");
      const data = await res.json();
      console.log("Fetched videos:", data);
      setVideos(data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchVideos();
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
    await fetch(`http://localhost:5001/api/courses/${editingId}`, {
      method: "PUT",
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
     DELETE COURSE
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    await fetch(`http://localhost:5001/api/courses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("learnix_token")}`,
      },
    });

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

  /* =========================
     ADD VIDEO (NEW)
  ========================= */
  const addVideo = async () => {
    if (
      !videoForm.courseId ||
      !videoForm.title ||
      !videoForm.youtubeUrl ||
      !videoForm.orderNo
    ) {
      alert("All video fields required");
      return;
    }

    if (editingVideoId) {
      // Update video
      await fetch(`http://localhost:5001/api/videos/${editingVideoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("learnix_token")}`,
        },
        body: JSON.stringify(videoForm),
      });
      alert("Video updated successfully");
      setEditingVideoId(null);
    } else {
      // Add new video
      await fetch("http://localhost:5001/api/admin/videos/add-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("learnix_token")}`,
        },
        body: JSON.stringify(videoForm),
      });
      alert("Video added successfully");
    }

    setVideoForm({
      courseId: "",
      title: "",
      youtubeUrl: "",
      orderNo: "",
    });
    fetchVideos();
  };

  const editVideo = (video) => {
    setEditingVideoId(video.id);
    setVideoForm({
      courseId: video.course_id,
      title: video.title,
      youtubeUrl: video.youtube_url,
      orderNo: video.order_no,
    });
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;
    
    await fetch(`http://localhost:5001/api/videos/${videoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("learnix_token")}`,
      },
    });
    alert("Video deleted");
    fetchVideos();
  };

  const resetVideoForm = () => {
    setEditingVideoId(null);
    setVideoForm({
      courseId: "",
      title: "",
      youtubeUrl: "",
      orderNo: "",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Manage Courses
      </h1>

      {/* =========================
          ADD / EDIT COURSE
      ========================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
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
          ADD VIDEO (NEW SECTION)
      ========================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="font-semibold mb-4">
          Add Course Video
        </h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Course ID"
          value={videoForm.courseId}
          onChange={(e) =>
            setVideoForm({ ...videoForm, courseId: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Video Title"
          value={videoForm.title}
          onChange={(e) =>
            setVideoForm({ ...videoForm, title: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="YouTube URL"
          value={videoForm.youtubeUrl}
          onChange={(e) =>
            setVideoForm({ ...videoForm, youtubeUrl: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-4 rounded"
          placeholder="Order No"
          value={videoForm.orderNo}
          onChange={(e) =>
            setVideoForm({ ...videoForm, orderNo: e.target.value })
          }
        />

        <button
          onClick={addVideo}
          className="px-6 py-2 bg-purple-600 text-white rounded"
        >
          {editingVideoId ? "Update Video" : "Add Video"}
        </button>
        {editingVideoId && (
          <button
            onClick={resetVideoForm}
            className="px-6 py-2 bg-gray-400 text-white rounded ml-2"
          >
            Cancel
          </button>
        )}
      </div>

      {/* =========================
          VIDEOS LIST
      ========================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="font-semibold mb-4 text-lg">📹 All Videos ({videos.length})</h2>
        {videos.length === 0 ? (
          <p className="text-gray-500 py-6 text-center">No videos added yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-3 font-semibold">ID</th>
                  <th className="text-left p-3 font-semibold">Course</th>
                  <th className="text-left p-3 font-semibold">Video Title</th>
                  <th className="text-left p-3 font-semibold">YouTube URL</th>
                  <th className="text-left p-3 font-semibold">Order</th>
                  <th className="text-center p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 text-gray-600">{video.id}</td>
                    <td className="p-3 font-medium text-gray-900">{video.course_title || `Course ${video.course_id}`}</td>
                    <td className="p-3 text-gray-700">{video.title}</td>
                    <td className="p-3">
                      <a 
                        href={video.youtube_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs break-all max-w-xs"
                      >
                        {video.youtube_url}
                      </a>
                    </td>
                    <td className="p-3 text-center text-gray-600">{video.order_no}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => editVideo(video)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteVideo(video.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
