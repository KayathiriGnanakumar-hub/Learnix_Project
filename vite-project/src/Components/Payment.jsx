import { useNavigate } from "react-router-dom";
import {
  getCartItems,
  removeFromCart
} from "../utils/cartStorage";

export default function Payment() {
  const navigate = useNavigate();
  const cart = getCartItems();

  if (cart.length === 0) {
    return (
      <div className="pt-28 text-center">
        No courses in cart.
      </div>
    );
  }

  return (
    <section className="pt-28 min-h-screen flex justify-center items-center
      bg-gradient-to-br from-indigo-600 to-purple-700">

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">

        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          Payment
        </h2>

        {cart.map(course => (
          <div key={course.id} className="flex gap-4 mb-4 border-b pb-4">
            <img
              src={course.image}
              className="w-20 h-20 rounded object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-purple-700 font-bold">₹{course.price}</p>
              <button
                onClick={() => removeFromCart(course.id)}
                className="text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate("/payment-success")}
          className="w-full py-3 rounded-xl text-white font-semibold
          bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          Pay Now
        </button>

      </div>
    </section>
  );
}
