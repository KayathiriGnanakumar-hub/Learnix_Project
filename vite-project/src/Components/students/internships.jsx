import { useEffect, useState } from "react";
import axios from "axios";

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("learnix_token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all internships
      const internshipsRes = await axios.get("http://localhost:5001/api/internships");
      setInternships(internshipsRes.data);

      // Fetch eligibility
      if (token) {
        const eligRes = await axios.get(
          "http://localhost:5001/api/internships/check/eligibility",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEligibility(eligRes.data);

        // Fetch user's applications
        const appRes = await axios.get(
          "http://localhost:5001/api/internships/applications/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserApplications(appRes.data);
      }
    } catch (err) {
      console.error("Error fetching internships:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (internshipId) => {
    if (!token) {
      alert("Please login to apply for internships");
      return;
    }

    if (!coverLetter.trim()) {
      alert("Please write a cover letter");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        "http://localhost:5001/api/internships/apply",
        {
          internshipId,
          coverLetter
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Successfully applied!");
      setCoverLetter("");
      setSelectedInternship(null);
      fetchData();
    } catch (err) {
      alert(`❌ ${err.response?.data?.message || "Failed to apply"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:5001/api/internships/applications/${applicationId}/withdraw`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Application withdrawn");
      fetchData();
    } catch (err) {
      alert("❌ Failed to withdraw application");
    }
  };

  const hasApplied = (internshipId) => {
    return userApplications.some(app => app.internship_id === internshipId);
  };

  const getApplicationStatus = (internshipId) => {
    const app = userApplications.find(a => a.internship_id === internshipId);
    return app?.status || null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-300 border-t-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">💼 Internship Opportunities</h1>

      {/* Fast-Track Offer for users who completed >=2 courses */}
      {eligibility?.completedCourses >= 2 && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🚀</div>
              <div>
                <h3 className="text-2xl font-bold">Fast-Track Internship Offer</h3>
                <p className="mt-1 text-orange-100">You've completed {eligibility.completedCourses} courses — claim an exclusive internship fast-track match curated for active learners.</p>
                <div className="mt-4">
                  <button onClick={() => setSelectedInternship('fasttrack')} className="bg-white text-orange-600 font-bold py-2 px-4 rounded">
                    Claim Offer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Status */}
      <div className="mb-8 p-6 rounded-xl border-2 shadow-md">
        {eligibility?.isEligible ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-semibold text-lg">
              ✅ {eligibility.message}
            </p>
            <p className="text-green-600 text-sm mt-2">
              You have completed {eligibility.completedCourses} course(s)
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-700 font-semibold text-lg">
              📚 {eligibility?.message}
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Currently completed: {eligibility?.completedCourses || 0}/{eligibility?.requiredCourses || 2} courses
            </p>
          </div>
        )}
      </div>

      {/* User's Applications */}
      {userApplications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-600">
                <h3 className="font-bold text-lg">{app.title}</h3>
                <p className="text-gray-600 text-sm">{app.company} • {app.location}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    app.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {app.status.toUpperCase()}
                  </span>
                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Internships */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Positions</h2>
      
      {internships.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No internships available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {internships.map((internship) => {
            const applied = hasApplied(internship.id);
            const status = getApplicationStatus(internship.id);

            return (
              <div
                key={internship.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{internship.title}</h3>
                  <p className="text-indigo-100 text-lg font-semibold">{internship.company}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Job Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">📍 Location</p>
                      <p className="font-semibold text-gray-900">{internship.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">💼 Type</p>
                      <p className="font-semibold text-gray-900">{internship.job_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">💰 Stipend</p>
                      <p className="font-semibold text-gray-900">₹{internship.stipend?.toLocaleString() || 'Varies'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">⏱️ Duration</p>
                      <p className="font-semibold text-gray-900">{internship.duration_months} months</p>
                    </div>
                  </div>

                  {/* Description */}
                  {internship.description && (
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm font-semibold mb-2">Description</p>
                      <p className="text-gray-700 line-clamp-3">{internship.description}</p>
                    </div>
                  )}

                  {/* Requirements */}
                  {internship.requirements && (
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm font-semibold mb-2">Requirements</p>
                      <p className="text-gray-700 line-clamp-2">{internship.requirements}</p>
                    </div>
                  )}

                  {/* Deadline */}
                  <p className="text-gray-600 text-sm mb-4">
                    📅 Deadline: {new Date(internship.deadline).toLocaleDateString()}
                  </p>

                  {/* Status & Action */}
                  {applied ? (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                      <p className="text-blue-700 font-semibold">
                        ✓ Already Applied ({status?.toUpperCase()})
                      </p>
                    </div>
                  ) : !eligibility?.isEligible ? (
                    <button disabled className="w-full bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg cursor-not-allowed">
                      Not Eligible Yet
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedInternship(internship.id)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {selectedInternship === 'fasttrack' ? (
              <>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                  <h2 className="text-2xl font-bold">Fast-Track Application</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700">Congratulations! You're eligible for our Fast-Track internship program. To claim this offer, send a short note explaining your interest and we'll connect you to priority recruiters.</p>
                  <label className="block text-gray-700 font-semibold mb-2 mt-4">Message</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none"
                    rows="5"
                    placeholder="Write a short note about your background and interest..."
                  />

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => { setSelectedInternship(null); setCoverLetter(''); }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { alert('Thank you — our team will contact you to arrange the fast-track internship.'); setSelectedInternship(null); setCoverLetter(''); }}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Claim Offer
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
                  <h2 className="text-2xl font-bold">Submit Application</h2>
                </div>

                <div className="p-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-indigo-600 focus:outline-none"
                    rows="5"
                    placeholder="Tell us why you're interested in this internship..."
                  />

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setSelectedInternship(null)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleApply(selectedInternship)}
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
