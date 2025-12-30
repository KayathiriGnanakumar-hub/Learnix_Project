import { Routes, Route } from "react-router-dom";

/* =======================
   PUBLIC
======================= */
import PublicLayout from "./Components/public/PublicLayout";
import Hero from "./Components/Hero";
import Courses from "./Components/Courses";
import CourseDetails from "./Components/CourseDetails";
import Contact from "./Components/Contact";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Cart from "./Components/Cart";

/* =======================
   PAYMENT
======================= */
import Payment from "./Components/Payment";
import PaymentSuccess from "./Components/PaymentSuccess";

/* =======================
   STUDENT
======================= */
import StudentLayout from "./Components/students/StudentLayout";
import Dashboard from "./Components/students/Dashboard";

/* =======================
   ADMIN
======================= */
import AdminLayout from "./Components/admin/AdminLayout";
import AdminDashboard from "./Components/admin/AdminDashboard";
import ManageCourses from "./Components/admin/ManageCourses";
import Students from "./Components/admin/Students";

/* =======================
   AUTH
======================= */
import ProtectedRoute from "./Components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES ========== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Hero />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ========== PAYMENT ROUTES ========== */}
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment-success"
        element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />

      {/* ========== STUDENT ROUTES ========== */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      {/* ========== ADMIN ROUTES ========== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="students" element={<Students />} />
      </Route>
    </Routes>
  );
}
