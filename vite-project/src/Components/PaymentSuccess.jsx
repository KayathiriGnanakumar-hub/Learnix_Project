import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems, clearCart } from "../utils/cartStorage";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(true);
  const [error, setError] = useState("");
  const didEnrollRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode (dev) or accidental remounts
    if (didEnrollRef.current) return;
    didEnrollRef.current = true;
    const enroll = async () => {
      const token = localStorage.getItem("learnix_token");
      // Quick client-side expiry check
      if (token) {
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp && payload.exp < Date.now() / 1000) {
              console.warn("⚠️ Token expired (client-side)");
              localStorage.removeItem("learnix_token");
              setError("Session expired. Redirecting to login...");
              setEnrolling(false);
              setTimeout(() => navigate("/login"), 1400);
              return;
            }
          }
        } catch (e) {
          console.warn("Could not decode token for expiry check", e);
        }
      }
      const cart = getCartItems();

      if (!token) {
        setError("Not authenticated");
        setEnrolling(false);
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (cart.length === 0) {
        setError("No courses in cart");
        setEnrolling(false);
        setTimeout(() => navigate("/courses"), 2000);
        return;
      }

      try {
        // Enroll in each course with completion flag (marks as finished for instant certificate eligibility)
        for (const course of cart) {
          console.log(`📝 Enrolling in course ${course.id}:`, course.title);
          const res = await fetch("http://localhost:5001/api/enroll", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              courseId: parseInt(course.id) || course.id,
              // Don't mark as complete on enroll; progress should start at 0
              complete: false
            }),
          });

          console.log(`✅ Enrollment response for course ${course.id}:`, res.status);

          // Handle unauthorized explicitly to surface expired/invalid tokens
          if (res.status === 401) {
            const errorData = await res.json().catch(() => ({}));
            console.error(`❌ Enrollment unauthorized for ${course.title}:`, errorData);
            localStorage.removeItem("learnix_token");
            setError("Session expired or unauthorized. Redirecting to login...");
            setEnrolling(false);
            setTimeout(() => navigate("/login"), 1400);
            return;
          }

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error(`❌ Enrollment error for ${course.title}:`, errorData);
            throw new Error(errorData.message || `Failed to enroll in ${course.title}`);
          }

          const data = await res.json();
          console.log(`✅ Enrolled in ${course.title}:`, data);
        }

        clearCart();
        setEnrolling(false);

        // Redirect after 2 seconds to show success message
        setTimeout(() => {
          navigate("/students/my-courses");
        }, 2000);
      } catch (err) {
        console.error("Enrollment error:", err);
        const msg = (err && err.message) || "Enrollment failed. Please try again.";
        // If token expired server-side or invalid token, guide user to login
        if (msg.toLowerCase().includes("token") || msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("unauthorized")) {
          localStorage.removeItem("learnix_token");
          setError("Session expired. Redirecting to login...");
          setEnrolling(false);
          setTimeout(() => navigate("/login"), 1400);
          return;
        }

        setError(msg);
        setEnrolling(false);
      }
    };

    enroll();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {enrolling ? (
          <>
            <div className="mb-6">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-300 border-t-green-600"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
            <p className="text-gray-600">
              Your payment is being processed and courses are being enrolled...
            </p>
          </>
        ) : error ? (
          <>
            <div className="mb-6 text-5xl">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Enrollment Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-block text-6xl animate-pulse">✅</div>
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              You have been successfully enrolled in the courses.
            </p>
            <p className="text-sm text-gray-500">Redirecting to your courses...</p>
          </>
        )}
      </div>
    </div>
  );
}
