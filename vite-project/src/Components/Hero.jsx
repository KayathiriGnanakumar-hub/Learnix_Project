import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const animationStyles = `
  @keyframes slideInFromBottom {
    from {
      opacity: 0;
      transform: translateY(60px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-60px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(60px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
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
  
  .animate-slide-in-bottom {
    animation: slideInFromBottom 0.8s ease-out forwards;
  }
  
  .animate-slide-in-left {
    animation: slideInFromLeft 0.8s ease-out forwards;
  }
  
  .animate-slide-in-right {
    animation: slideInFromRight 0.8s ease-out forwards;
  }
  
  .animate-fade-scale {
    animation: fadeInScale 0.8s ease-out forwards;
  }
  
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
`;

export default function Hero() {
  // Simple carousel component used by multiple sections
  function Carousel({ images = [], height = 280, interval = 3000 }) {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
      if (!images || images.length === 0) return;
      const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
      return () => clearInterval(t);
    }, [images, interval]);

    return (
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ height }}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="carousel"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      {/* Original Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center"
      >
        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d)",
          }}
        />

        {/* BLACK OVERLAY */}
        <div className="absolute inset-0 bg-black/70" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white mt-20">
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            Build Your Career With{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Real-World Skills
            </span>
          </h1>

          {/* QUOTE (DOWNWARDS & STYLISH) */}
          <p className="mt-6 text-xl sm:text-2xl italic text-gray-300">
             Slow & Steady Leads to Long-Term Success
          </p>

          <p className="max-w-2xl mx-auto text-lg text-gray-300 mt-8 mb-12">
            Learn industry-ready skills through structured courses, real projects,
            internships, and career guidance designed for long-term success.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/courses"
              className="px-8 py-4 rounded-xl bg-white text-gray-900 font-semibold shadow-lg hover:bg-gray-100 transition"
            >
              Explore Courses
            </Link>

            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold shadow-lg hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Placement Assistance Section (carousel + content) */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Carousel images={["/resume.png", "/interviewprep.png", "/companyconnect.png"]} height={360} />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-orange-600 mb-4">Placement Assistance</h2>
              <p className="text-lg text-gray-600 mb-6">Get placed in top companies with our dedicated placement support.</p>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">Resume Building</h3>
                  <p className="text-sm text-gray-600 mt-2">Expert guidance to craft a compelling resume that gets noticed by recruiters.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">Interview Preparation</h3>
                  <p className="text-sm text-gray-600 mt-2">Mock interviews, technical and HR prep to help you perform confidently.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">Company Connect</h3>
                  <p className="text-sm text-gray-600 mt-2">Access our network of partner companies for internships and job placements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internships Section (carousel + content) */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Carousel images={["/internship.jpg", "/remoteintern.png", "/onsite-internships.png"]} height={360} />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-orange-600 mb-4">Internship Programs</h2>
              <p className="text-lg text-gray-600 mb-6">Gain real-world experience with industry-leading companies.</p>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">Remote Internships</h3>
                  <p className="text-sm text-gray-600 mt-2">Flexible remote internship opportunities with hands-on projects.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">On-site Internships</h3>
                  <p className="text-sm text-gray-600 mt-2">Office-based internships in major tech hubs across the country.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">Internship + Certification</h3>
                  <p className="text-sm text-gray-600 mt-2">Earn recognized certificates while completing your internship.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section (carousel + content) */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Carousel images={["/professionalcertification.png", "/certification.png"]} height={360} />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-orange-600 mb-4">Professional Certifications</h2>
              <p className="text-lg text-gray-600 mb-6">Boost your career with industry-recognized certifications.</p>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">Industry-Recognized Certificates</h3>
                  <p className="text-sm text-gray-600 mt-2">Earn certificates designed with industry experts to validate your skills.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">International Recognition</h3>
                  <p className="text-sm text-gray-600 mt-2">Certificates recognized globally to enhance your career prospects.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">Career Advancement</h3>
                  <p className="text-sm text-gray-600 mt-2">Accelerate your career growth with credible certifications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Features Section (carousel + content) */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Carousel images={["/community.png", "/mentorship.png", "/careeradvancement.png"]} height={360} />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-orange-600 mb-4">More Features</h2>
              <p className="text-lg text-gray-600 mb-6">Everything you need to succeed in your tech career.</p>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">Expert Mentorship</h3>
                  <p className="text-sm text-gray-600 mt-2">Learn from industry experts and experienced professionals.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">24/7 Support</h3>
                  <p className="text-sm text-gray-600 mt-2">Get instant help whenever you need it.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg">Community</h3>
                  <p className="text-sm text-gray-600 mt-2">Connect with thousands of learners and professionals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
