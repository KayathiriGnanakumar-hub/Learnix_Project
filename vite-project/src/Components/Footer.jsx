import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPinterestP,
  FaTiktok,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-gray-200">

      {/* ================= COURSES SECTION ================= */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <h3 className="text-xl font-semibold text-white text-center mb-6">
          Courses
        </h3>

        {/* 5 COLUMNS – 4 COURSES EACH */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-10 gap-y-2 text-sm">
          <ul className="space-y-2">
            <li>React</li>
            <li>Python</li>
            <li>Java</li>
            <li>Angular</li>
          </ul>

          <ul className="space-y-2">
            <li>Data Structures</li>
            <li>DBMS</li>
            <li>Cloud Computing</li>
            <li>Cyber Security</li>
          </ul>

          <ul className="space-y-2">
            <li>DevOps</li>
            <li>UI / UX Design</li>
            <li>Machine Learning</li>
            <li>JavaScript</li>
          </ul>

          <ul className="space-y-2">
            <li>Backend Development</li>
            <li>Mobile App Development</li>
            <li>Software Testing</li>
            <li>jQuery</li>
          </ul>

          <ul className="space-y-2">
            <li>Full Stack Development</li>
            <li>Web Development</li>
            <li>Networking</li>
          </ul>
        </div>
      </div>

      {/* ================= INFO SECTION ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-3">

        {/* LEARNIX */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Learnix
          </h4>
          <p className="text-sm leading-relaxed">
            Learnix is a modern e-learning platform helping students build
            real-world skills through structured courses, internships,
            certifications, and placement guidance.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/courses" className="hover:text-white">Courses</a></li>
            <li><a href="/register" className="hover:text-white">Register</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Contact
          </h4>
          <ul className="space-y-2 text-sm">
            <li>Chennai, India</li>
            <li>support@learnix.com</li>
            <li>+91 98765 43210</li>
          </ul>
        </div>

      </div>

      {/* ================= SOCIAL ICONS ================= */}
      <div className="flex justify-center gap-4 pb-6">
        {[FaInstagram, FaLinkedinIn, FaYoutube, FaPinterestP, FaTiktok].map(
          (Icon, i) => (
            <div
              key={i}
              className="bg-white text-black p-3 rounded-full hover:scale-110 transition cursor-pointer"
            >
              <Icon />
            </div>
          )
        )}
      </div>

      {/* ================= COPYRIGHT (NO LINE) ================= */}
      <div className="py-4 text-center text-sm">
        © 2025 <span className="font-semibold text-white">Learnix</span>. All rights reserved.
      </div>

    </footer>
  );
}
