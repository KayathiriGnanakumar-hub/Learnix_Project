import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCartItems, setCartItems } from "../utils/cartStorage";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5001/api/courses/${id}`)
      .then(res => res.json())
      .then(setCourse);
  }, [id]);

  const handleEnroll = () => {
    const token = localStorage.getItem("learnix_token");

    if (!token) {
      navigate(`/login?redirect=/course/${id}`);
      return;
    }

    const cart = getCartItems();
    if (!cart.find(c => c.id === course.id)) {
      setCartItems([...cart, course]);
    }

    navigate("/payment");
  };

  if (!course) return <p className="pt-28 text-center">Loading...</p>;

  return (
    <section className="pt-28 pb-20 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        <img
          src={course.image}
          alt={course.title}
          className="w-full h-72 object-cover rounded-xl mb-6"
        />

        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          {course.title}
        </h1>

        <p className="text-gray-600 mb-4">{course.description}</p>

        <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
          <Info label="Instructor" value={course.instructor} />
          <Info label="Duration" value={course.duration} />
          <Info label="Level" value={course.level || "Beginner"} />
          <Info label="Students" value={course.students || 0} />
        </div>

        <p className="text-2xl font-bold text-purple-700 mb-6">
          ₹{course.price}
        </p>

        <button
          onClick={handleEnroll}
          className="w-full py-3 rounded-xl font-semibold
          bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
        >
          Enroll Now
        </button>

      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl p-[2px] bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white rounded-xl p-3 text-center">
        <p className="text-gray-500">{label}</p>
        <p className="font-semibold text-indigo-700">{value}</p>
      </div>
    </div>
  );
}
