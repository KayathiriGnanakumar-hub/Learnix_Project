import { useNavigate } from "react-router-dom";
import { getCartItems, removeFromCart } from "../utils/cartStorage";
import { useState } from "react";

export default function Payment() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCartItems());

  const handleRemove = (id) => {
    removeFromCart(id);
    setCart(getCartItems());
  };

  const handlePayment = () => {
    navigate("/payment-success");
  };

  if (cart.length === 0) {
    return <div className="pt-28 text-center">No courses selected</div>;
  }

  return (
    <section className="pt-28 min-h-screen flex justify-center items-center
      bg-gradient-to-br from-indigo-700 to-purple-700">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-700 text-center mb-6">
          Payment
        </h2>

        {cart.map((course) => (
          <div
            key={course.id}
            className="flex items-center gap-4 mb-4 border-b pb-3"
          >
            <img
              src={course.image}
              alt={course.title}
              className="h-16 w-24 rounded object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold">{course.title}</p>
              <p className="text-purple-700 font-bold">₹{course.price}</p>
            </div>

            <button
              onClick={() => handleRemove(course.id)}
              className="text-red-600 text-sm font-semibold hover:underline"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={handlePayment}
          className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Pay Now
        </button>
      </div>
    </section>
  );
}
