import { Link } from "react-router-dom";

export default function Hero() {
  return (
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
  );
}
