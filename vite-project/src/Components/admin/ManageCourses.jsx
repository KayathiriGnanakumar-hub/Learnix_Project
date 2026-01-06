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
    <div style={{ backgroundColor: 'var(--site-bg)' }} className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full">
          <span className="text-orange-600 font-semibold text-sm tracking-widest uppercase">Course Management</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Manage <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">Courses</span>
        </h1>
        <p className="text-gray-600">Create, edit, and manage all your courses and course videos</p>
      </div>

      {/* =========================
          ADD / EDIT COURSE
      ========================= */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-10 hover:shadow-xl transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          {editingId ? (
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">Edit</span>
          ) : (
            <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full">New</span>
          )}
          <span>{editingId ? 'Edit Course' : 'Add New Course'}</span>
        </h2>

        {[
          ["title", "Course Title", "text"],
          ["description", "Course Description", "textarea"],
          ["price", "Price (₹)", "number"],
          ["image", "Course Image URL", "url"],
          ["instructor", "Instructor Name", "text"],
          ["duration", "Duration (e.g., 4 weeks)", "text"],
        ].map(([key, label, type]) => 
          type === "textarea" ? (
            <textarea
              key={key}
              className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder={label}
              rows="3"
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          ) : (
            <input
              key={key}
              type={type}
              className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder={label}
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          )
        )}

        <div className="flex gap-3">
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
                Update Course
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all duration-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Course
            </button>
          )}
        </div>
      </div>

      {/* =========================
          ADD VIDEO (NEW SECTION)
      ========================= */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-10 hover:shadow-xl transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🎬 Add Course Video
        </h2>

        <input
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          placeholder="Course ID"
          value={videoForm.courseId}
          onChange={(e) =>
            setVideoForm({ ...videoForm, courseId: e.target.value })
          }
        />

        <input
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          placeholder="Video Title"
          value={videoForm.title}
          onChange={(e) =>
            setVideoForm({ ...videoForm, title: e.target.value })
          }
        />

        <input
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          placeholder="YouTube URL"
          value={videoForm.youtubeUrl}
          onChange={(e) =>
            setVideoForm({ ...videoForm, youtubeUrl: e.target.value })
          }
        />

        <input
          className="border border-gray-300 p-3 w-full mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          placeholder="Order No"
          value={videoForm.orderNo}
          onChange={(e) =>
            setVideoForm({ ...videoForm, orderNo: e.target.value })
          }
        />

        <div className="flex gap-3">
          <button
            onClick={addVideo}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {editingVideoId ? "Update Video" : "Add Video"}
          </button>
          {editingVideoId && (
            <button
              onClick={resetVideoForm}
              className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* =========================
          VIDEOS LIST
      ========================= */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-10 hover:shadow-xl transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.5 2a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V4a2 2 0 00-2-2h-11z" />
          </svg>
          All Videos ({videos.length})
        </h2>
        {videos.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No videos added yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                <tr>
                  <th className="text-left p-4 font-bold text-gray-900">ID</th>
                  <th className="text-left p-4 font-bold text-gray-900">Course</th>
                  <th className="text-left p-4 font-bold text-gray-900">Video Title</th>
                  <th className="text-left p-4 font-bold text-gray-900">YouTube URL</th>
                  <th className="text-left p-4 font-bold text-gray-900">Order</th>
                  <th className="text-center p-4 font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id} className="border-b hover:bg-orange-50/50 transition">
                    <td className="p-4 text-gray-600 font-medium">{video.id}</td>
                    <td className="p-4 font-semibold text-gray-900">{video.course_title || `Course ${video.course_id}`}</td>
                    <td className="p-4 text-gray-700">{video.title}</td>
                    <td className="p-4">
                      <a 
                        href={video.youtube_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-xs break-all max-w-xs font-medium"
                      >
                        {video.youtube_url?.substring(0, 40)}...
                      </a>
                    </td>
                    <td className="p-4 text-center text-gray-600 font-medium">{video.order_no}</td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => editVideo(video)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteVideo(video.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition"
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
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2h1a1 1 0 100 2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1a1 1 0 100-2h1a2 2 0 012 2v10a4 4 0 01-4 4H8a4 4 0 01-4-4V5z" clipRule="evenodd" />
          </svg>
          All Courses ({courses.length})
        </h2>
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-11.747 0-5.502-4.5-10.747-10-10.747z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No courses created yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {course.image && (
                  <div className="h-40 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.688 16.4l7.07-7.07a1 1 0 10-1.414-1.414L7.979 14.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0z" />
                      </svg>
                      <span className="text-xs text-gray-600 font-semibold">₹{course.price}</span>
                    </div>
                    {course.duration && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">{course.duration}</span>
                    )}
                  </div>

                  {course.instructor && (
                    <p className="text-xs text-gray-500 mb-4">👨‍🏫 {course.instructor}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(course)}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
