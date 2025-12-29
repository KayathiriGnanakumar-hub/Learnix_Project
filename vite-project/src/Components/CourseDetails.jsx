import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCartItems, setCartItems } from "../utils/cartStorage";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const courses =
      JSON.parse(localStorage.getItem("courses")) || [];
    const found = courses.find((c) => c.id === id);
    setCourse(found || null);
  }, [id]);

  const addToCart = () => {
    const cart = getCartItems();
    if (cart.some((item) => item.id === course.id)) {
      alert("Course already in cart");
      return;
    }
    setCartItems([...cart, course]);
    navigate("/cart");
  };

  if (!course) return <p className="pt-28 text-center">Course not found</p>;

  return (
    <section className="pt-28 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />

        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          {course.title}
        </h1>

        {course.duration && (
          <p className="text-gray-600 mb-2">
            Duration: {course.duration}
          </p>
        )}

        <p className="text-xl font-semibold text-purple-700 mb-4">
          ₹{course.price}
        </p>

        {course.description && (
          <p className="mt-4">{course.description}</p>
        )}

        <button
          onClick={addToCart}
          className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add to Cart
        </button>
      </div>
    </section>
  );
}
