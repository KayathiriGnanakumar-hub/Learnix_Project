import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems, clearCart } from "../utils/cartStorage";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const enroll = async () => {
      const token = localStorage.getItem("learnix_token");
      const user = JSON.parse(localStorage.getItem("learnix_user"));
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
            userId: user.id,
          }),
        });
      }

      clearCart();
      navigate("/students");
    };

    enroll();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-indigo-600 to-purple-700">
      <h2 className="text-3xl font-bold text-white">
        Payment Successful 🎉
      </h2>
    </div>
  );
}
