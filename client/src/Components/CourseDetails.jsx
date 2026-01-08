import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCartItems, setCartItems } from "../utils/cartStorage";
import {
  BookOpen,
  Clock,
  BarChart3,
  Users,
  Star,
  CheckCircle,
  Play,
  Award,
  User,
  MessageSquare,
} from "lucide-react";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [watchedVideos, setWatchedVideos] = useState({});
  const [loadIframe, setLoadIframe] = useState(false);
  const playerRef = useRef(null);

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
  const handleVideoCompleteCallback = useCallback((videoId) => {
    setWatchedVideos(prev => ({ ...prev, [videoId]: true }));
  }, []);
  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/videos/course/${id}`
      );
      const data = await res.json();
      console.log("Videos fetched:", data);
      console.log("First video:", data[0]);
      console.log("YouTube URL:", data[0]?.youtube_url);
      setVideos(data);
      if (data.length > 0) {
        setSelectedVideo(data[0]);
      }
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

      if (!res.ok) {
        console.error("Failed to check enrollment:", res.status);
        setIsEnrolled(false);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setIsEnrolled(data.some((c) => String(c.id) === String(id)));
      } else {
        setIsEnrolled(false);
      }
    } catch (err) {
      console.error("Error checking enrollment:", err);
      setIsEnrolled(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
    fetchVideos();
    checkEnrollment();
  }, [fetchCourse, fetchVideos, checkEnrollment]);



  useEffect(() => {
    if (!loadIframe || !selectedVideo) return;

    const videoId = extractYoutubeId(selectedVideo.youtube_url);

    const onPlayerReady = () => {
      // Player is ready
    };

    const onPlayerStateChange = (event) => {
      // YT PlayerState.ENDED === 0 or window.YT.PlayerState.ENDED
      if (window.YT && event.data === window.YT?.PlayerState?.ENDED) {
        handleVideoCompleteCallback(selectedVideo.id);
      }
    };

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      try {
        playerRef.current = new window.YT.Player(`yt-player-${selectedVideo.id}`, {
          videoId,
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      } catch (e) {
        console.error('YT player create error', e);
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = createPlayer;
      document.body.appendChild(tag);
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // Error destroying player
        }
      }
      playerRef.current = null;
    };
  }, [loadIframe, selectedVideo, handleVideoCompleteCallback]);

  useEffect(() => {
    // reset iframe load when switching videos
    setLoadIframe(false);
  }, [selectedVideo]);

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
    
    console.log("extractYoutubeId input:", url);
    console.log("extractYoutubeId output:", videoId);
    
    return videoId;
  };

  if (loading) return <div className="pt-28 text-center text-lg">Loading...</div>;
  if (!course) return <div className="pt-28 text-center text-red-600">Course not found</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--site-bg)' }}>
      {/* Hero Section - Coursera Style */}
      <div className="pt-28 pb-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-slate-900">4.8 (2,345 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-slate-900">128K students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-slate-900">Beginner level</span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center gap-3 py-4 border-t border-slate-200">
                <div className="w-12 h-12 bg-linear-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Instructor</p>
                  <p className="font-semibold text-slate-900">{course.instructor || "Expert Instructor"}</p>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Price Card (Sticky) */}
            <div className="lg:sticky lg:top-28 h-fit">
              {isEnrolled ? (
                <div className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="font-bold text-green-700">Already Enrolled</span>
                  </div>
                  <p className="text-sm text-green-700">Start learning now!</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl shadow-md p-6">
                  <div className="mb-6">
                    <p className="text-slate-600 text-sm mb-2">Price</p>
                    <p className="text-4xl font-bold text-slate-900">₹{course.price}</p>
                  </div>
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg mb-3"
                  >
                    Enroll Now
                  </button>
                  <button className="w-full border border-slate-300 text-slate-900 font-semibold py-2 px-6 rounded-xl hover:bg-orange-50 transition-all">
                    Add to Wishlist
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white border-b border-slate-200 sticky top-28 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            {["overview", "curriculum", "reviews", "instructor"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tab Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Video Player Section */}
                {selectedVideo && selectedVideo.youtube_url ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                    <div className="bg-black aspect-video relative group flex items-center justify-center">
                      {!loadIframe ? (
                        <div className="w-full h-full relative cursor-pointer" onClick={() => setLoadIframe(true)}>
                          <img
                            src={`https://img.youtube.com/vi/${extractYoutubeId(selectedVideo.youtube_url)}/hqdefault.jpg`}
                            alt={selectedVideo.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white bg-opacity-90 p-3 rounded-full">
                              <Play className="w-6 h-6 text-orange-500" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div id={`yt-player-${selectedVideo.id}`} style={{ width: '100%', height: '100%' }} />
                      )}
                    </div>

                    {/* Video Details */}
                    <div className="p-8">
                      <div className="mb-6">
                        <p className="text-sm text-orange-500 font-semibold mb-2 flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Lesson {selectedVideo.order_no} of {videos.length}
                        </p>
                        <h2 className="text-3xl font-bold text-slate-900">{selectedVideo.title}</h2>
                      </div>

                      {/* Quiz Button - Only show if video completed or not enrolled */}
                      {isEnrolled && (
                        <div>
                          <button
                            onClick={() => navigate(`/quiz/${selectedVideo.id}?courseId=${id}`)}
                            disabled={!watchedVideos[selectedVideo.id]}
                            className={`inline-flex items-center gap-2 font-bold py-3 px-6 rounded-xl transition-all ${
                              watchedVideos[selectedVideo.id]
                                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg cursor-pointer"
                                : "bg-slate-200 text-slate-500 cursor-not-allowed"
                            }`}
                          >
                            <MessageSquare className="w-5 h-5" />
                            {watchedVideos[selectedVideo.id] ? "Take Quiz Now" : "Watch Video to Take Quiz"}
                          </button>
                          {!watchedVideos[selectedVideo.id] && (
                            <p className="text-sm text-slate-600 mt-3 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Watch the video completely to unlock the quiz
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-12 rounded-xl shadow-md text-center border border-slate-200">
                    <p className="text-lg text-slate-600">
                      {videos.length === 0
                        ? "No videos available yet"
                        : "Unable to load video"}
                    </p>
                  </div>
                )}

                {/* Course Highlights */}
                <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-orange-500" />
                    What You'll Learn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Core Concepts</h4>
                        <p className="text-slate-600 text-sm">Master fundamental principles and best practices</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-teal-600 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Hands-On Projects</h4>
                        <p className="text-slate-600 text-sm">Build real-world projects to strengthen skills</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-teal-600 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Professional Certificate</h4>
                        <p className="text-slate-600 text-sm">Earn credentials recognized by industry</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-teal-600 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Lifetime Access</h4>
                        <p className="text-slate-600 text-sm">Access course materials anytime, anywhere</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Course */}
                <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-orange-500" />
                    About This Course
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    {course.description}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    This comprehensive course is designed to take you from beginner to advanced level, 
                    with hands-on projects, real-world examples, and industry best practices. You'll learn 
                    from an experienced instructor and get access to all course materials anytime, anywhere.
                  </p>
                </div>
              </div>
            )}

            {/* CURRICULUM TAB */}
            {activeTab === "curriculum" && (
              <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-orange-500" />
                  Course Curriculum
                </h3>
                <div className="space-y-3">
                  {videos.length === 0 ? (
                    <p className="text-slate-600">No curriculum available yet</p>
                  ) : (
                    videos.map((video, index) => (
                      <div
                        key={video.id}
                        className="flex items-center gap-3 p-4 hover:bg-slate-50 rounded-lg transition-all cursor-pointer border border-slate-200"
                      >
                        <Play className="w-5 h-5 text-orange-500" />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{index + 1}. {video.title}</p>
                          <p className="text-sm text-slate-600">~10 minutes</p>
                        </div>
                        {watchedVideos[video.id] && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                  Student Reviews
                </h3>
                <div className="space-y-6">
                  <div className="pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        JD
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">John Doe</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-700">Excellent course! Very well structured and easy to follow.</p>
                  </div>

                  <div className="pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        SM
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Sarah Miller</p>
                        <div className="flex items-center gap-1">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-700">Great content! Learned a lot. Would appreciate more projects.</p>
                  </div>
                </div>
              </div>
            )}

            {/* INSTRUCTOR TAB */}
            {activeTab === "instructor" && (
              <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-orange-500" />
                  About Instructor
                </h3>
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-linear-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                      {course.instructor || "Expert Instructor"}
                    </h4>
                    <p className="text-orange-500 font-semibold mb-4">Professional Instructor</p>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      With over 10 years of experience in the field, our instructor brings real-world 
                      knowledge and practical insights to every lesson. Passionate about teaching and 
                      dedicated to student success.
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-orange-500" />
                        <span>10+ Years Experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        <span>50K+ Students Taught</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Course Structure */}
          <div className="space-y-6">
            {/* Course Structure Card - Simplified */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-orange-500 p-4">
                <h3 className="text-lg font-bold text-white">Course Content</h3>
              </div>

              <div className="p-4">
                <p className="text-sm text-slate-600 mb-4">{videos.length} Lessons</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {videos.length === 0 ? (
                    <p className="text-slate-500 text-center py-4 text-sm">No lessons yet</p>
                  ) : (
                    videos.map((video, index) => (
                      <button
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className={`w-full text-left p-2 rounded text-sm transition-all ${
                          selectedVideo?.id === video.id
                            ? "bg-orange-100 text-orange-900 font-semibold"
                            : "bg-slate-50 text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        {index + 1}. {video.title}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Certificate Card - Simplified */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-orange-900">Certificate included</p>
              <p className="text-xs text-orange-700 mt-1">Complete all lessons to earn it</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
