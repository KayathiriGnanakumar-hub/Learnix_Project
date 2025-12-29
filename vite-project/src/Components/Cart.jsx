import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  getCartItems,
  setCartItems,
} from "../utils/cartStorage";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItemsState] = useState(getCartItems());

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(
      (item) => item.id !== id
    );
    setCartItems(updatedCart);
    setCartItemsState(updatedCart);
  };

  const proceedToPayment = () => {
    navigate("/payment");
  };

  return (
    <section className="pt-28 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <p className="text-xl font-semibold mb-2">
              Your cart is empty 🛒
            </p>
            <p className="text-gray-600">
              Add courses to continue.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6">

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-14 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="font-semibold text-indigo-600">
                    ₹{item.price}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-8">
              <button
                onClick={proceedToPayment}
                className="px-10 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
              >
                Proceed to Payment
              </button>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
