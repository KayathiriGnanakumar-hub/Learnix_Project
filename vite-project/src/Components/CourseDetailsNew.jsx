import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCartItems, setCartItems } from "../utils/cartStorage";

const slideInStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-slide-up {
    animation: slideInUp 0.6s ease-out;
  }
  
  .animate-slide-down {
    animation: slideInDown 0.6s ease-out;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out;
  }
`;

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
    <div className="min-h-screen p-8" style={{ backgroundColor: '#FAF7E5' }}>
      <style>{slideInStyles}</style>
      {/* Hero Section */}
      <div className="pt-28 pb-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white animate-slide-down">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column - Text Content */}
              <div className="lg:col-span-2">
                <p className="text-blue-400 font-semibold text-sm mb-2 tracking-widest uppercase">Professional Development</p>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white transition-all duration-500 hover:text-blue-300">{course.title}</h1>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed font-light">{course.description}</p>
                
                {/* Instructor & Course Info */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white bg-opacity-5 backdrop-blur border border-white border-opacity-10 transition-all duration-300 hover:bg-opacity-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold">I</span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Instructor</p>
                      <p className="font-semibold text-white text-base">{course.instructor || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white bg-opacity-5 backdrop-blur border border-white border-opacity-10 transition-all duration-300 hover:bg-opacity-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold">D</span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Duration</p>
                      <p className="font-semibold text-white text-base">{course.duration || "Self-paced"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-white bg-opacity-5 backdrop-blur border border-white border-opacity-10 transition-all duration-300 hover:bg-opacity-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                      <span className="text-white font-bold">L</span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Level</p>
                      <p className="font-semibold text-white text-base">Beginner to Advanced</p>
                    </div>
                  </div>
                </div>

                {isEnrolled && (
                  <div className="inline-flex items-center gap-2 bg-green-500 bg-opacity-20 border border-green-400 text-green-200 px-6 py-3 rounded-lg font-semibold backdrop-blur transition-all duration-300 hover:bg-opacity-30 animate-slide-up">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Already Enrolled</span>
                  </div>
                )}
              </div>

              {/* Right Column - Price Card */}
              {!isEnrolled && (
              <div className="rounded-2xl p-8 h-fit backdrop-blur bg-white bg-opacity-10 border border-white border-opacity-20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-opacity-15">
                <p className="text-slate-300 text-sm mb-2 uppercase tracking-wider font-semibold">Investment in Your Future</p>
                <p className="text-5xl font-bold mb-6" style={{ background: 'linear-gradient(to right, #60A5FA, #93C5FD)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>${course.price}</p>
                <button
                  onClick={handleEnroll}
                  className="w-full text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-2xl hover:scale-105 duration-300 flex items-center justify-center gap-2 group"
                  style={{ background: 'linear-gradient(to right, #FF8C00, #FFA500)' }}
                >
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Enroll Now
                </button>
              </div>
            )}
          </div>
        </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About the Course Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-orange-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                About This Course
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6 font-light">
                {course.description}
              </p>
              <p className="text-gray-600 leading-relaxed font-light">
                This comprehensive course is designed to take you from beginner to advanced level, 
                with hands-on projects, real-world examples, and industry best practices. You'll learn 
                from an experienced instructor and get access to all course materials anytime, anywhere.
              </p>
            </div>

            {/* Course Highlights */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg p-8 border border-orange-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-orange-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 hover:translate-y-1">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base">Core Concepts</h3>
                    <p className="text-gray-600 text-sm font-light">Master fundamental principles and best practices</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 hover:translate-y-1">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base">Hands-On Projects</h3>
                    <p className="text-gray-600 text-sm font-light">Build real-world projects to strengthen skills</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 hover:translate-y-1">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base">Professional Certificate</h3>
                    <p className="text-gray-600 text-sm font-light">Earn credentials recognized by industry</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 hover:translate-y-1">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base">Lifetime Access</h3>
                    <p className="text-gray-600 text-sm font-light">Access course materials anytime, anywhere</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Section */}
            {selectedVideo && extractYoutubeId(selectedVideo.youtube_url) ? (
              <div className="space-y-6 animate-slide-up">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl">
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
                  <div className="p-8 bg-white">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-orange-600 font-semibold text-sm mb-2 uppercase tracking-wider">
                          Lesson {selectedVideo.order_no} of {videos.length}
                        </p>
                        <h2 className="text-3xl font-bold text-gray-900">{selectedVideo.title}</h2>
                      </div>
                    </div>

                    {isEnrolled && (
                      <button
                        onClick={() => navigate(`/quiz/${selectedVideo.id}`)}
                        className="text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 duration-300 flex items-center gap-2 group"
                        style={{ background: 'linear-gradient(to right, #FF8C00, #FFA500)' }}
                      >
                        <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Take Quiz & Complete Lesson
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl shadow-md text-center bg-white border border-gray-100 animate-slide-up">
                <p className="text-lg text-gray-600">
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
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-28 transition-all duration-500 hover:shadow-xl animate-slide-up">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-orange-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                Course Lessons ({videos.length})
              </h3>

              {videos.length === 0 ? (
                <p className="text-gray-500 text-center py-4 font-light">No videos yet</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {videos.map((video, index) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className="w-full text-left p-4 rounded-lg transition-all border-l-4 hover:shadow-md group"
                      style={selectedVideo?.id === video.id ? { backgroundColor: '#FFE8D0', borderLeftColor: '#FF8C00' } : { backgroundColor: '#f9fafb', borderLeftColor: '#e5e7eb' }}
                    >
                      <p className="text-sm font-bold group-hover:text-blue-600 transition-colors" style={{ color: selectedVideo?.id === video.id ? '#FF8C00' : '#1f2937' }}>
                        {index + 1}. {video.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">~10 min</p>
                    </button>
                  ))}
                </div>
              )}

              {!isEnrolled && videos.length > 0 && (
                <p className="text-xs mt-4 p-3 bg-blue-50 rounded border border-blue-200 text-center text-gray-600 font-medium">
                  Enroll to access all lessons
                </p>
              )}
            </div>

            {/* Certificate Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 border border-orange-400 p-6 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-slide-up">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Professional Certificate</h4>
                  <p className="text-sm text-blue-100 font-light">Earn Industry Recognition</p>
                </div>
              </div>
              <p className="text-sm text-blue-50 font-light leading-relaxed">
                Complete all lessons and quizzes to earn your professional certificate recognized by leading companies worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
