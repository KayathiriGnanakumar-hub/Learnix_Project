import { useEffect, useState } from "react";

const data = [
  {
    title: "Industry Internships",
    desc:
      "Work on real-world projects with guided internships designed to match industry standards and expectations.",
    image: "/internship.jpg",
  },
  {
    title: "Verified Certifications",
    desc:
      "Earn certifications that validate your skills and strengthen your resume with industry recognition.",
    image: "/certification.jpg",
  },
  {
    title: "Placement Opportunities",
    desc:
      "Top-performing learners receive placement assistance and job offers from partner companies.",
    image: "/placement.jpg",
  },
];

export default function WhyLearnix() {
  const [index, setIndex] = useState(0);

  // AUTO SCROLL
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Learn Practice And  Get Hired.
          </h2>

          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
            {data[index].title}
          </h3>

          <p className="text-lg text-gray-600 leading-relaxed">
            {data[index].desc}
          </p>
        </div>

        {/* RIGHT IMAGE SCROLLER */}
        <div className="relative h-[320px] overflow-hidden rounded-2xl shadow-lg">
          {data.map((item, i) => (
            <img
              key={i}
              src={item.image}
              alt={item.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
