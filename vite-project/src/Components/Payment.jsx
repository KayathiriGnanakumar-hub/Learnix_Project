import { useNavigate } from "react-router-dom";
import { getCartItems } from "../utils/cartStorage";
import { useState } from "react";

export default function Payment() {
  const navigate = useNavigate();
  const cartItems = getCartItems();
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const payNow = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/payment-success");
    }, 1500);
  };

  return (
    <section className="pt-28 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">

        <h1 className="text-3xl font-bold text-indigo-700 mb-6">
          Payment
        </h1>

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border-b py-4"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-24 h-16 object-cover rounded"
            />

            <div className="flex-1">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500">
                {item.duration}
              </p>
            </div>

            <span className="font-semibold text-indigo-600">
              ₹{item.price}
            </span>
          </div>
        ))}

        <div className="flex justify-between font-semibold mt-6">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={payNow}
          disabled={loading}
          className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </section>
  );
}
