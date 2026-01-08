import { Routes, Route } from "react-router-dom";

/* PUBLIC */
import PublicLayout from "./Components/public/PublicLayout";
import Hero from "./Components/Hero";
import Contact from "./Components/Contact";
import Courses from "./Components/Courses";
import CourseDetails from "./Components/CourseDetails";
import Login from "./Components/Login";
import Register from "./Components/Register";

/* PAYMENT */
import Payment from "./Components/Payment";
import PaymentSuccess from "./Components/PaymentSuccess";

/* STUDENT */
import StudentLayout from "./Components/students/StudentLayout";
import Dashboard from "./Components/students/Dashboard";
import MyCourses from "./Components/students/MyCourses";
import Progress from "./Components/students/Progress";
import Quiz from "./Components/students/Quiz";
import Certificates from "./Components/students/Certificates";
import Internships from "./Components/students/internships";
import Profile from "./Components/Profile";

/* ADMIN */
import AdminLayout from "./Components/admin/AdminLayout";
import AdminDashboard from "./Components/admin/AdminDashboard";
import ManageCourses from "./Components/admin/ManageCourses";
import StudentsAdmin from "./Components/admin/Students";
import AdminManagement from "./Components/admin/AdminManagement";
import InternshipApplications from "./Components/admin/InternshipApplications";
import AdminStudentDetail from "./Components/admin/AdminStudentDetail";
import ContactQueries from "./Components/admin/ContactQueries";

/* AUTH */
import ProtectedRoute from "./Components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Hero />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* PAYMENT */}
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

      {/* STUDENT */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="progress" element={<Progress />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="internships" element={<Internships />} />
      </Route>

      {/* PROFILE (protected) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* QUIZ - Protected Route */}
      <Route
        path="/quiz/:videoId"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<StudentsAdmin />} />
        <Route path="students/:id" element={<AdminStudentDetail />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="internships" element={<InternshipApplications />} />
        <Route path="contact-queries" element={<ContactQueries />} />
        <Route path="manage" element={<AdminManagement />} />
      </Route>
    </Routes>
  );
}
