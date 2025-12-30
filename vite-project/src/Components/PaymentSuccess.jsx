import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems, clearCart } from "../utils/cartStorage";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const enrollCourses = async () => {
      const token = localStorage.getItem("learnix_token");
      const user = JSON.parse(localStorage.getItem("learnix_user"));
      const cart = getCartItems();

      if (!token || !user || cart.length === 0) {
        navigate("/students");
        return;
      }

      try {
        for (const course of cart) {
          await fetch("http://localhost:5001/api/enroll", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              courseId: course.id,
              email: user.email,
              name: user.name,
            }),
          });
        }

        clearCart();

        // ✅ DELAY → THEN REDIRECT TO STUDENT PANEL
        setTimeout(() => {
          navigate("/students");
        }, 2000);

      } catch (err) {
        console.error("Enrollment failed:", err);
        navigate("/students");
      }
    };

    enrollCourses();
  }, [navigate]);

  return (
    <section className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-indigo-600 to-purple-700">

      <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-4">
          Payment Successful 🎉
        </h2>

        <p className="text-gray-600">
          You are being redirected to your student panel...
        </p>
      </div>
    </section>
  );
}
