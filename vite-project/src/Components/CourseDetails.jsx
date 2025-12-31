import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCartItems, setCartItems } from "../utils/cartStorage";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH COURSE
  ========================= */
  useEffect(() => {
    fetch(`http://localhost:5001/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  /* =========================
     ENROLL FLOW
  ========================= */
  const handleEnroll = () => {
    const token = localStorage.getItem("learnix_token");

    // ❌ NOT LOGGED IN → LOGIN FIRST
    if (!token) {
      navigate(`/login?redirect=/course/${id}`);
      return;
    }

    // ✅ LOGGED IN → ADD TO CART → PAYMENT
    const cart = getCartItems();
    if (!cart.find((c) => c.id === course.id)) {
      setCartItems([...cart, course]);
    }

    navigate("/payment");
  };

  if (loading) {
    return <div className="pt-28 text-center">Loading...</div>;
  }

  if (!course) {
    return <div className="pt-28 text-center text-red-500">Course not found</div>;
  }

  return (
    <section className="pt-28 pb-20 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-indigo-200 p-8">

          <img
            src={course.image}
            alt={course.title}
            className="w-full h-72 object-cover rounded-xl mb-6"
          />

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-extrabold text-indigo-700">
              {course.title}
            </h1>
            <span className="text-yellow-500 font-semibold">
              ⭐ {course.rating || 4.5}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-sm">
            <Info label="Instructor" value={course.instructor} />
            <Info label="Duration" value={course.duration} />
            <Info label="Level" value={course.level || "Beginner"} />
            <Info label="Students" value={course.students || 0} />
          </div>

          <p className="text-2xl font-bold text-purple-700 mb-4">
            ₹{course.price}
          </p>

          <p className="text-gray-700 mb-6">{course.description}</p>

          <button
            onClick={handleEnroll}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Enroll Now
          </button>

        </div>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  if (!value && value !== 0) return null;

  return (
    <div className="rounded-xl p-[2px] bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white rounded-xl p-3 text-center">
        <p className="text-gray-500">{label}</p>
        <p className="font-semibold text-indigo-700">{value}</p>
      </div>
    </div>
  );
}


