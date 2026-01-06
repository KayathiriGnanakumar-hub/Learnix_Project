import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const animationStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-slide-up {
    animation: slideInUp 0.6s ease-out;
  }
  
  .animate-fade-scale {
    animation: fadeInScale 0.6s ease-out;
  }
  
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
  .stagger-5 { animation-delay: 0.5s; }
  .stagger-6 { animation-delay: 0.6s; }
  .stagger-7 { animation-delay: 0.7s; }
  .stagger-8 { animation-delay: 0.8s; }
`;

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
      <section className="pt-28 pb-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7E5' }}>
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-semibold">Loading courses...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      <section id="courses" className="pt-28 pb-20 min-h-screen" style={{ backgroundColor: '#FAF7E5' }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-scale">
            <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full">
              <span className="text-orange-600 font-semibold text-sm tracking-widest uppercase">Explore Our Programs</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Professional <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Courses</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master in-demand skills with industry-leading instructors and comprehensive curriculum
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-20 animate-fade-scale">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">
                No courses available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col transform hover:scale-105 hover:-translate-y-2 animate-slide-up stagger-${(index % 8) + 1}`}
                >
                  {/* Image Container */}
                  <div className="h-40 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 relative">
                    <img
                      src={
                        course.image
                          ? course.image.startsWith("http")
                            ? course.image
                            : `http://localhost:5001${course.image.startsWith("/") ? "" : "/"}${course.image}`
                          : "/placeholder.jpg"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-orange-600 transition">
                      {course.title}
                    </h3>

                    {course.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zm0 4a1 1 0 11-2 0 1 1 0 012 0zm3-7a1 1 0 11-2 0 1 1 0 012 0zm0 4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">{course.duration}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2h1a1 1 0 100 2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1a1 1 0 100-2h1a2 2 0 012 2v10a4 4 0 01-4 4H8a4 4 0 01-4-4V5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-600 font-medium uppercase tracking-widest">Certificate</span>
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        ₹{course.price}
                      </span>
                    </div>

                    <Link
                      to={`/course/${course.id}`}
                      className="mt-auto w-full text-center px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
