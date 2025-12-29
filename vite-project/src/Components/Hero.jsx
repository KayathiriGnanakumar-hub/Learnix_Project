export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d)",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/70" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
        
        {/* UPDATED HEADING */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Slow & Steady <span className="text-indigo-300">Leads to Success</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-200 mb-10">
          A modern e-learning platform offering industry-ready courses,
          expert mentors, and hands-on projects to shape your future.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
          <a
            href="#courses"
            className="px-8 py-4 rounded-xl bg-white text-indigo-700 font-semibold shadow-lg hover:bg-gray-100 transition"
          >
            Explore Courses
          </a>

          <a
            href="#register"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold shadow-lg hover:opacity-90 transition"
          >
            Get Started
          </a>
        </div>

        {/* Stats Section */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-indigo-300">50+</h3>
            <p className="text-gray-200">Professional Courses</p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-indigo-300">10K+</h3>
            <p className="text-gray-200">Active Learners</p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-indigo-300">100%</h3>
            <p className="text-gray-200">Career Focused</p>
          </div>
        </div>
      </div>
    </section>
  );
}
