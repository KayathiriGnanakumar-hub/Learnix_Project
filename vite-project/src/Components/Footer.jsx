import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPinterestP,
  FaTiktok,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-gray-200">

      {/* TOP FOOTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Learnix
          </h2>
          <p className="text-sm leading-relaxed">
            Learnix is a modern e-learning platform empowering learners to build
            real-world skills through industry-focused courses and expert-led
            guidance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#home" className="hover:text-white">Home</a></li>
            <li><a href="#courses" className="hover:text-white">Courses</a></li>
            <li><a href="#register" className="hover:text-white">Register</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Popular Courses */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4">
            Popular Courses
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Full Stack Development</li>
            <li>Artificial Intelligence</li>
            <li>Cyber Security</li>
            <li>UI / UX Design</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4">
            Contact
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Chennai, India</li>
            <li>support@learnix.com</li>
            <li>+91 98765 43210</li>
          </ul>
        </div>

      </div>

      {/* APP STORE BUTTONS */}
      <div className="flex justify-center gap-4 pb-8">
        <button className="flex items-center gap-2 border border-white/40 px-4 py-2 rounded-md hover:bg-white/10 transition">
          <FaApple className="text-xl" />
          <span className="text-sm">App Store</span>
        </button>

        <button className="flex items-center gap-2 border border-white/40 px-4 py-2 rounded-md hover:bg-white/10 transition">
          <FaGooglePlay className="text-lg" />
          <span className="text-sm">Google Play</span>
        </button>
      </div>

      {/* SOCIAL ICONS */}
      <div className="flex justify-center gap-4 pb-6">
        <a className="bg-white text-black p-3 rounded-full hover:scale-110 transition">
          <FaInstagram />
        </a>
        <a className="bg-white text-black p-3 rounded-full hover:scale-110 transition">
          <FaLinkedinIn />
        </a>
        <a className="bg-white text-black p-3 rounded-full hover:scale-110 transition">
          <FaYoutube />
        </a>
        <a className="bg-white text-black p-3 rounded-full hover:scale-110 transition">
          <FaPinterestP />
        </a>
        <a className="bg-white text-black p-3 rounded-full hover:scale-110 transition">
          <FaTiktok />
        </a>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/20 py-5 text-center text-base sm:text-lg px-4">

        © 2025 <span className="font-semibold text-white">Learnix</span>.  
        All rights reserved.
      </div>
    </footer>
  );
}
