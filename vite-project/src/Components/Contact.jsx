import contactImg from "../assets/contact.jpg";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <div
      id="contact"
      className="bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900
      px-6 py-12 min-h-screen"
    >
      <div className="max-w-3xl mx-auto pt-16">
        <div className="grid md:grid-cols-2 gap-9 items-stretch">

          {/* LEFT */}
          <div className="bg-white rounded-xl shadow p-5 flex flex-col
            border-2 border-violet-600">
            <img
              src={contactImg}
              alt="Contact E-LearnHub"
              className="w-full max-w-[250px] md:max-w-[260px]
              mx-auto mb-5 rounded-lg shadow
              ring-2 ring-violet-400"
            />

            <div className="border-t pt-4 border-violet-200 pl-12">
              <div className="flex items-start gap-3 mb-4">
                <FaMapMarkerAlt className="text-violet-600 text-sm mt-3" />
                <p className="text-slate-900 text-sm leading-relaxed">
                  <strong>Address</strong><br />
                  E-LearnHub Learning Center, Chennai
                </p>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <FaEnvelope className="text-violet-600 text-sm mt-3" />
                <p className="text-slate-900 text-sm leading-relaxed">
                  <strong>Support Email</strong><br />
                  support@elearnhub.com
                </p>
              </div>

              <div className="flex items-start gap-3">
                <FaPhoneAlt className="text-violet-600 text-sm mt-3" />
                <p className="text-slate-900 text-sm leading-relaxed">
                  <strong>Contact Number</strong><br />
                  +91 98765 43210
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow p-5 flex flex-col
            border-2 border-violet-600">
            <h2 className="text-xl md:text-2xl font-bold text-violet-700 mb-5">
              Contact Form
            </h2>

            <input
              className="w-full border border-violet-300 rounded-lg
              px-3 py-2 mb-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Your Name"
            />

            <input
              className="w-full border border-violet-300 rounded-lg
              px-3 py-2 mb-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Your Email"
            />

            <input
              className="w-full border border-violet-300 rounded-lg
              px-3 py-2 mb-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Your Phone Number"
            />

            <select
              className="w-full border border-violet-300 rounded-lg
              px-3 py-2 mb-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-violet-500
              text-gray-600"
            >
              <option>Inquiry Type</option>
              <option>Course Information</option>
              <option>Enrollment Support</option>
              <option>Technical Support</option>
              <option>General Inquiry</option>
            </select>

            <textarea
              className="w-full border border-violet-300 rounded-lg
              px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Your Message"
              rows="3"
            />

            {/* SEND MESSAGE BUTTON — UNCHANGED */}
            <button
              className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600
              text-white w-full py-2.5 rounded-lg text-sm font-semibold shadow
              hover:opacity-90 transition"
            >
              Send Message
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
