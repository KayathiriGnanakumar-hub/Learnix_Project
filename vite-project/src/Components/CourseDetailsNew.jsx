import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCartItems, setCartItems } from "../utils/cartStorage";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoCompleted, setVideoCompleted] = useState(false);

  const fetchCourse = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/courses/${id}`);
      const data = await res.json();
      setCourse(data);
    } catch (err) {
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/videos/course/${id}`
      );
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Error fetching videos:", err);
    }
  }, [id]);

  const checkEnrollment = useCallback(async () => {
    const token = localStorage.getItem("learnix_token");
    if (!token) return;

    try {
      const res = await fetch(
        "http://localhost:5001/api/enroll/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setIsEnrolled(data.some((c) => String(c.id) === String(id)));
    } catch (err) {
      console.error("Error checking enrollment:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
    fetchVideos();
    checkEnrollment();
  }, [fetchCourse, fetchVideos, checkEnrollment]);

  const handleEnroll = () => {
    const token = localStorage.getItem("learnix_token");

    if (!token) {
      navigate(`/login?redirect=/course/${id}`);
      return;
    }

    const cart = getCartItems();
    const alreadyInCart = cart.find((c) => String(c.id) === String(course.id));
    
    if (!alreadyInCart) {
      setCartItems([...cart, course]);
    }

    navigate("/payment");
  };

  const extractYoutubeId = (url) => {
    if (!url) return null;
    
    let videoId = null;
    
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.match(/^[a-zA-Z0-9_-]{11}$/)) {
      videoId = url;
    }
    
    return videoId;
  };

  if (loading) return <div className="pt-28 text-center text-lg">Loading...</div>;
  if (!course) return <div className="pt-28 text-center text-red-600">Course not found</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="pt-28 pb-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column - Text Content */}
            <div className="lg:col-span-2">
              <p className="text-teal-400 font-semibold text-sm mb-2">COURSE</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{course.title}</h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">{course.description}</p>
              
              {/* Instructor & Course Info */}
              <div className="flex flex-wrap gap-8 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👨‍🏫</span>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide">Instructor</p>
                    <p className="font-semibold text-white">{course.instructor || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⏱️</span>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide">Duration</p>
                    <p className="font-semibold text-white">{course.duration || "Self-paced"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide">Level</p>
                    <p className="font-semibold text-white">Beginner to Advanced</p>
                  </div>
                </div>
              </div>

              {isEnrolled && (
                <div className="inline-flex items-center gap-2 bg-teal-500 bg-opacity-20 border border-teal-400 text-teal-200 px-6 py-3 rounded-lg font-semibold">
                  <span>✓</span>
                  <span>Already Enrolled</span>
                </div>
              )}
            </div>

            {/* Right Column - Price Card */}
            {!isEnrolled && (
              <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-2xl p-8 h-fit">
                <p className="text-slate-300 text-sm mb-3">Price</p>
                <p className="text-4xl font-bold text-white mb-6">${course.price}</p>
                <button
                  onClick={handleEnroll}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  🛒 Enroll Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About the Course Section */}
            <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">📚 About This Course</h2>
              <p className="text-slate-700 leading-relaxed text-lg mb-6">
                {course.description}
              </p>
              <p className="text-slate-600 leading-relaxed">
                This comprehensive course is designed to take you from beginner to advanced level, 
                with hands-on projects, real-world examples, and industry best practices. You'll learn 
                from an experienced instructor and get access to all course materials anytime, anywhere.
              </p>
            </div>

            {/* Course Highlights */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-md p-8 border border-teal-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">✨ What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <span className="text-teal-500 text-2xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Core Concepts</h3>
                    <p className="text-slate-700 text-sm">Master fundamental principles and best practices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-teal-500 text-2xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Hands-On Projects</h3>
                    <p className="text-slate-700 text-sm">Build real-world projects to strengthen skills</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-teal-500 text-2xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Professional Certificate</h3>
                    <p className="text-slate-700 text-sm">Earn credentials recognized by industry</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-teal-500 text-2xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Lifetime Access</h3>
                    <p className="text-slate-700 text-sm">Access course materials anytime, anywhere</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Section */}
            {selectedVideo && extractYoutubeId(selectedVideo.youtube_url) ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
                  <div className="bg-black aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${extractYoutubeId(
                        selectedVideo.youtube_url
                      )}?rel=0&modestbranding=1`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedVideo.title}
                    ></iframe>
                  </div>

                  {/* Video Details */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-teal-600 font-semibold text-sm mb-2">
                          Lesson {selectedVideo.order_no} of {videos.length}
                        </p>
                        <h2 className="text-3xl font-bold text-slate-900">{selectedVideo.title}</h2>
                      </div>
                    </div>

                    {isEnrolled && (
                      <button
                        onClick={() => navigate(`/quiz/${selectedVideo.id}`)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg"
                      >
                        📝 Take Quiz & Complete Lesson
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl shadow-md text-center border border-slate-200">
                <p className="text-lg text-slate-600">
                  {videos.length === 0
                    ? "No videos available yet"
                    : "Unable to load video"}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Lessons List */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 sticky top-28">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                📹 Course Lessons ({videos.length})
              </h3>

              {videos.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No videos yet</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {videos.map((video, index) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        selectedVideo?.id === video.id
                          ? "bg-teal-100 border-l-4 border-teal-500"
                          : "bg-slate-50 hover:bg-slate-100 border-l-4 border-slate-200"
                      }`}
                    >
                      <p className={`text-sm font-semibold ${
                        selectedVideo?.id === video.id
                          ? "text-teal-700"
                          : "text-slate-900"
                      }`}>
                        {index + 1}. {video.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">~10 min</p>
                    </button>
                  ))}
                </div>
              )}

              {!isEnrolled && videos.length > 0 && (
                <p className="text-xs text-slate-600 mt-4 p-3 bg-slate-50 rounded border border-slate-200 text-center">
                  👉 Enroll to access all lessons
                </p>
              )}
            </div>

            {/* Certificate Card */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 p-6 rounded-2xl">
              <h4 className="font-bold text-teal-900 mb-3">✨ Certificate Included</h4>
              <p className="text-sm text-teal-800">
                Complete all lessons and quizzes to earn your professional certificate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
