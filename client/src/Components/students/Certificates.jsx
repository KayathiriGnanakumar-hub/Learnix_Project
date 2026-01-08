import { useEffect, useState } from "react";
import axios from "axios";
import { FaCertificate, FaCheck, FaCalendar, FaTasks, FaDownload } from 'react-icons/fa';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allEnrollments, setAllEnrollments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("learnix_token");

    axios
      .get("http://localhost:5001/api/enroll/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        console.log("📊 All enrollments:", res.data);
        setAllEnrollments(res.data);
        
        const done = [];

        for (const course of res.data) {
          try {
            console.log(`📚 Course: ${course.title}, Status: ${course.status}, Progress: ${course.progress}`);
            
            // Check if enrollment status is 'completed' and progress is 100
            // (instead of counting videos, use enrollments table status)
            if (course.status === 'completed' && course.progress === 100) {
              console.log(`✅ Course qualified for certificate: ${course.title}`);
              done.push({
                ...course,
                completedAt: course.completed_at 
                  ? new Date(course.completed_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })
                  : new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    }),
                progress: 100
              });
            } else {
              console.log(`❌ Course not eligible: ${course.title} (Status: ${course.status}, Progress: ${course.progress})`);
            }
          } catch (err) {
            console.error("Error checking completion:", err);
          }
        }

        console.log(`🏆 Total eligible for certificates: ${done.length}`);
        setCertificates(done);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching certificates:", err);
        setLoading(false);
      });
  }, []);

  const downloadCertificate = (courseId) => {
    const token = localStorage.getItem("learnix_token");

    if (!token) {
      alert("Please login to download the certificate.");
      return;
    }

    // Decode JWT to get userId
    let userId = 1;
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      userId = decoded.id || decoded.userId || 1;
      console.log("✅ Decoded userId from token:", userId);
      console.log("✅ Full decoded token:", decoded);
    } catch (e) {
      console.warn("⚠️ Could not decode token, using default userId: 1", e);
    }

    // Use axios to request the PDF with Authorization header and download the blob
    (async () => {
      try {
        console.log(`📡 Requesting certificate from: /api/certificates/generate/${userId}/${courseId}`);
        const res = await axios.get(
          `http://localhost:5001/api/certificates/generate/${userId}/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );

        console.log("✅ Certificate downloaded successfully");
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificate_${userId}_${courseId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("❌ Certificate download error:", err);
        console.error("❌ Error status:", err?.response?.status);
        
        let errorMessage = "Failed to download certificate";
        
        // Handle different error response types
        if (err?.response?.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = function() {
            console.error("❌ Error response (HTML):", reader.result);
          };
          reader.readAsText(err?.response?.data);
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.message) {
          errorMessage = err.message;
        }
        
        alert(errorMessage);
      }
    })();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-300 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div style={{ backgroundColor: '#FAF7E5' }} className="flex flex-col items-center justify-center min-h-96 text-center p-8">
        <div className="text-6xl mb-4 text-purple-600"><FaCertificate /></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Certificates Yet</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Complete courses to earn certificates. Keep learning!
        </p>
        
        {/* Debug Info */}
        {allEnrollments.length > 0 && (
            <div className="mt-8 w-full max-w-2xl bg-slate-100 rounded-lg p-4 text-left">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Debug: Your Enrollments</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {allEnrollments.map((course) => (
                <div key={course.enrollment_id || course.id} className="bg-white p-3 rounded border border-slate-200">
                  <p className="font-semibold text-gray-900">{course.title}</p>
                  <p className="text-sm text-gray-600">Status: <span className={course.status === 'completed' ? 'text-green-600 font-bold' : 'text-orange-600'}>{course.status}</span></p>
                  <p className="text-sm text-gray-600">Progress: <span className={course.progress === 100 ? 'text-green-600 font-bold' : 'text-gray-600'}>{course.progress}%</span></p>
                  {course.completed_at && (
                    <p className="text-sm text-gray-600">Completed: {new Date(course.completed_at).toLocaleDateString()}</p>
                  )}
                  {course.status === 'completed' && course.progress === 100 ? (
                    <p className="text-sm mt-2 text-green-600 font-bold"><FaCheck className="inline mr-1" /> Ready for certificate!</p>
                  ) : (
                    <p className="text-sm mt-2 text-red-600">Not eligible yet</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF7E5' }} className="p-6 rounded">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2"><FaCertificate /> My Certificates</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.enrollment_id || cert.id}
            className="bg-gradient-to-r from-orange-400 to-yellow-100 rounded-xl shadow-lg border-2 border-orange-300 overflow-hidden hover:shadow-2xl hover:border-violet-500 transition-all transform hover:scale-105"
          >
            {/* Certificate Icon */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-center hover:from-violet-700 hover:to-purple-700 transition">
              <FaCertificate className="text-5xl mb-2 text-white mx-auto" />
              <p className="text-white font-semibold">Certificate of Achievement</p>
            </div>

            {/* Certificate Details */}
            <div className="p-6">
              {/* Course Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-4">{cert.title}</h3>

              {/* Completion Info */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <FaCheck className="text-lg text-purple-600" />
                  <span className="text-slate-700">
                    <span className="font-semibold">Status:</span> Completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-lg text-purple-600" />
                  <span className="text-slate-700">
                    <span className="font-semibold">Date:</span> {cert.completedAt}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTasks className="text-lg text-purple-600" />
                  <span className="text-slate-700">
                    <span className="font-semibold">Progress:</span> {cert.progress}%
                  </span>
                </div>
              </div>

              {/* Course Info */}
              {cert.description && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {cert.description}
                </p>
              )}

              {/* Download Button */}
              <button
                onClick={() => downloadCertificate(cert.id)}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FaDownload />
                <span>Download Certificate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

