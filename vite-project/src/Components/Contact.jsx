export default function Contact() {
  return (
    <div className="bg-slate-100 min-h-[calc(100vh-80px)] py-20 px-4">

      {/* MAIN CONTAINER */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* LEFT SIDE */}
          <div className="animate-fadeUp">

            {/* IMAGE (REDUCED SIZE) */}
            <img
              src="/contact.jpg"
              alt="Contact Learnix"
              className="w-full max-w-sm rounded-xl shadow-md mb-6"
            />

            {/* ADDRESS DETAILS */}
            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <span className="font-semibold text-gray-900">Address:</span>{" "}
                Chennai, India
              </p>
              <p>
                <span className="font-semibold text-gray-900">Email:</span>{" "}
                support@learnix.com
              </p>
              <p>
                <span className="font-semibold text-gray-900">Phone:</span>{" "}
                +91 98765 43210
              </p>
            </div>
          </div>

          {/* RIGHT SIDE – FORM */}
          <div className="animate-fadeUp animate-delay-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Us
            </h2>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold transition hover:bg-blue-700 hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
