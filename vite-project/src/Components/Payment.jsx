import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems } from "../utils/cartStorage";

export default function Payment() {
  const navigate = useNavigate();
  const cart = getCartItems();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("learnix_token");
    if (!token) {
      // Redirect to login with return URL
      navigate("/login?redirect=/payment");
    }
  }, [navigate]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4" style={{backgroundColor: 'rgb(250, 247, 229)'}}>
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            No courses selected for payment
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const total = cart.reduce((sum, course) => sum + parseFloat(course.price || 0), 0);

  return (
    <div className="min-h-screen pt-32 pb-12 px-4" style={{backgroundColor: 'rgb(250, 247, 229)'}}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">💳 Checkout</h1>
          <p className="text-lg text-gray-700">Complete your payment to start learning</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border-2 border-orange-200">
          <h2 className="text-2xl font-bold text-orange-700 mb-6">Order Summary</h2>

          {/* Course Items */}
          <div className="space-y-4 mb-8 pb-8 border-b border-orange-200">
            {cart.map((course, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  {course.instructor && (
                    <p className="text-sm text-gray-600">
                      by {course.instructor}
                    </p>
                  )}
                </div>
                <span className="font-bold text-orange-600 text-lg">
                  ${parseFloat(course.price || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 mb-8 border border-orange-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              <span className="text-3xl font-bold text-orange-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Security Badge */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-green-800">
              🔒 Secure Encrypted Payment
            </p>
          </div>

          {/* Pay Button */}
          <button
            onClick={() => {
              navigate("/payment-success");
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl mb-4"
          >
            Pay Now ${total.toFixed(2)}
          </button>

          {/* Back Button */}
          <button
            onClick={() => navigate("/courses")}
            className="w-full bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold py-3 px-6 rounded-lg transition-all border border-orange-300"
          >
            Back to Courses
          </button>

          {/* Disclaimer */}
          <p className="text-xs text-gray-600 text-center mt-4">
            By clicking "Pay Now" you agree to our{" "}
            <a href="#" className="text-orange-600 hover:underline font-semibold">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
