import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems, clearCart } from "../utils/cartStorage";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const user = JSON.parse(localStorage.getItem("learnix_user"));
      const token = localStorage.getItem("learnix_token");
      const cart = getCartItems();

      for (const course of cart) {
        await fetch("http://localhost:5001/api/enroll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseId: course.id,
            user_name: user.name,
            user_email: user.email,
          }),
        });
      }

      clearCart();
      navigate("/students");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center
      bg-gradient-to-br from-indigo-700 to-purple-700 text-white">
      <h2 className="text-3xl font-bold mb-3">
        Payment Successful 🎉
      </h2>
      <p className="text-lg">Enrolling your courses...</p>
    </div>
  );
}
