import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems, clearCart } from "../utils/cartStorage";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const saveEnrollments = () => {
      const cartItems = getCartItems();

      const existingEnrollments =
        JSON.parse(localStorage.getItem("enrollments")) || [];

      const newEnrollments = cartItems.map((course) => ({
        ...course,
        progress: 0,
        completed: false,
        enrolledAt: new Date().toISOString(),
      }));

      localStorage.setItem(
        "enrollments",
        JSON.stringify([
          ...existingEnrollments,
          ...newEnrollments,
        ])
      );

      clearCart();
    };

    saveEnrollments();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-10 rounded-2xl shadow text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful 🎉
        </h1>
        <p className="mb-6 text-gray-600">
          You are now enrolled in your courses.
        </p>
        <button
          onClick={() => navigate("/students/courses")}
          className="px-8 py-3 bg-green-600 text-white rounded-lg"
        >
          Go to My Courses
        </button>
      </div>
    </div>
  );
}
