export default function Contact() {
  const smallAnim = `@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}} .fadeInUp{animation:fadeInUp .6s ease-out both}`;
  return (
    <div style={{ backgroundColor: '#FAF7E5' }} className="min-h-[calc(100vh-80px)] py-20 px-4">

      <style>{smallAnim}</style>

      <div className="max-w-6xl mx-auto px-4">

        {/* Header like courses */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full">
            <span className="text-orange-600 font-semibold text-sm tracking-widest uppercase">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Contact <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Have questions about our courses or enrollment? Our support team is ready to help.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 fadeInUp">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* LEFT: image + address (smaller image) */}
            <div className="flex flex-col">
              <div className="w-full max-w-[260px] mx-auto p-4 rounded-xl border border-gray-100 bg-white/60">
                <img
                  src="/contact.jpg"
                  alt="Contact Learnix"
                  className="w-full h-auto rounded-lg object-cover"
                  style={{ maxHeight: 200 }}
                />
              </div>

              <div className="w-full mt-6 pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Contact Details</h3>
                <div className="text-gray-700 text-sm space-y-4">
                  <p className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 11 6 11s6-5.75 6-11c0-3.314-2.686-6-6-6zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                    </svg>
                    <span id="contact-address">E-LearnHub Learning Center, Chennai</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <span id="contact-email">support@elearnhub.com</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.01l-2.21 2.21z" />
                    </svg>
                    <span id="contact-phone">+91 98765 43210</span>
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: form (modernized) */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Send us a message</h2>
              <p className="text-sm text-gray-600 mb-6">Fill out the form and we'll get back to you within 24 hours.</p>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Your Phone Number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-200 outline-none"
                />

                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none">
                  <option>Inquiry Type</option>
                  <option>General</option>
                  <option>Support</option>
                  <option>Partnership</option>
                </select>

                <textarea
                  rows="5"
                  placeholder="Your Message"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-200 outline-none"
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold transition hover:shadow-lg hover:scale-[1.01]"
                >
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
