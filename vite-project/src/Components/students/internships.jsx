import { useEffect, useState } from "react";
import axios from "axios";
import { FaBriefcase, FaBookOpen, FaEdit } from "react-icons/fa";

const DOMAINS = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "AI/Machine Learning",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
  "UI/UX Design",
  "Backend Development",
  "Frontend Development"
];

const animationStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-up {
    animation: slideInUp 0.6s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out;
  }

  .group:hover .group-hover\:scale-105 {
    transform: scale(1.05);
  }
`;

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [domainOfInterest, setDomainOfInterest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

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
      console.error("❌ Error fetching internships:", err);
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

  const getFiltered = () => {
    let result = internships;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        (i.title || '').toLowerCase().includes(q) ||
        (i.company || '').toLowerCase().includes(q) ||
        (i.location || '').toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filterType !== "all") {
      result = result.filter(i => i.job_type === filterType);
    }

    return result;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-300 border-t-orange-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--site-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12 animate-slide-up">
            <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full">
              <span className="text-yellow-700 font-semibold text-sm tracking-widest uppercase flex items-center gap-2"><FaBriefcase /> Opportunities</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Internship <span className="bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">Opportunities</span>
            </h1>
            <p className="text-gray-600 text-lg">Explore exciting internship positions curated for your skills and interests</p>
          </div>

          {/* Domain of Interest Matching */}
          <div className="mb-12 animate-slide-up">
            <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-100 text-white p-8 rounded-2xl shadow-xl border border-yellow-400 overflow-hidden relative">
              <div className="absolute top-0 right-0 text-8xl opacity-10">🎯</div>
              <div className="relative z-10 flex items-start gap-6">
                <div className="text-6xl">🎯</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">Find Internships by Your Domain of Interest</h2>
                  <p className="text-yellow-50 text-lg mb-4">
                    Select your domain of interest and we'll match you with the most relevant internship opportunities tailored to your career goals.
                  </p>
                  {eligibility?.selectedDomain && (
                    <div className="mb-4 bg-white bg-opacity-20 rounded-lg p-3 border border-white border-opacity-30">
                      <p className="text-yellow-100 text-sm font-semibold">Your Selected Domain:</p>
                      <p className="text-white font-bold text-lg mt-1">✨ {eligibility.selectedDomain}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedInternship('domain')}
                    className="inline-flex items-center gap-2 bg-white text-yellow-600 font-bold py-3 px-6 rounded-lg hover:bg-yellow-50 transition-all shadow-lg"
                  >
                    <span>{eligibility?.selectedDomain ? 'Change Domain' : 'Select Your Domain'}</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility Status */}
          <div className="mb-12 animate-slide-up">
            {eligibility?.isEligible ? (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-2xl p-8 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">✅</div>
                  <div className="flex-1">
                    <p className="text-green-700 font-bold text-xl mb-1">{eligibility.message}</p>
                    <p className="text-green-600">You have successfully completed {eligibility.completedCourses} course{eligibility.completedCourses !== 1 ? 's' : ''} and are eligible to apply</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-2xl p-8 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="text-4xl text-orange-500"><FaBookOpen /></div>
                  <div className="flex-1">
                    <p className="text-yellow-700 font-bold text-xl mb-2">{eligibility?.message}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-yellow-600 text-sm mb-2">Progress: {eligibility?.completedCourses || 0} / {eligibility?.requiredCourses || 2} courses</p>
                        <div className="h-3 bg-yellow-200 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${((eligibility?.completedCourses || 0) / (eligibility?.requiredCourses || 2)) * 100}%` }}
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-yellow-600 text-sm mt-3">Complete {(eligibility?.requiredCourses || 2) - (eligibility?.completedCourses || 0)} more course{(eligibility?.requiredCourses || 2) - (eligibility?.completedCourses || 0) !== 1 ? 's' : ''} to become eligible</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* My Applications */}
          {userApplications.length > 0 && (
            <div className="mb-12 animate-slide-up">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>📋 My Applications</span>
                <span className="text-lg bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">{userApplications.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userApplications.map((app) => (
                  <div key={app.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 overflow-hidden group">
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 border-b border-gray-200">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{app.title}</h3>
                      <p className="text-indigo-600 font-semibold">{app.company}</p>
                      <p className="text-gray-600 text-sm mt-1">📍 {app.location}</p>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {app.status === 'accepted' && '✅'}
                          {app.status === 'rejected' && '❌'}
                          {app.status === 'pending' && '⏳'}
                          {app.status.toUpperCase()}
                        </span>
                      </div>

                      {app.status === 'pending' && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          className="w-full px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                        >
                          Withdraw Application
                        </button>
                      )}

                      {app.status === 'accepted' && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <p className="text-green-700 font-semibold">🎉 Great news! Your application was accepted.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-10 animate-slide-up">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search Internships</label>
                  <input
                    placeholder="Search by title, company, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Available Internships */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2 animate-slide-up">
              <span>Available Positions</span>
              <span className="text-lg bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">{getFiltered().length}</span>
            </h2>

            {getFiltered().length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center animate-slide-up">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4m0 0L4 7m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0L12 3m0 0L4 7" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">No internships available</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                {getFiltered().map((internship, idx) => {
                  const applied = hasApplied(internship.id);
                  const status = getApplicationStatus(internship.id);

                  return (
                    <div
                      key={internship.id || idx}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden group"
                    >
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 border-b border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{internship.title}</h3>
                            <p className="text-yellow-700 font-semibold text-lg">{internship.company}</p>
                          </div>
                          {applied && (
                            <div className="text-right">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                status === 'accepted' ? 'bg-green-100 text-green-700' :
                                status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {status === 'accepted' && '✅'}
                                {status === 'rejected' && '❌'}
                                {status === 'pending' && '⏳'}
                                APPLIED
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 space-y-4">
                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-gray-600 text-xs font-semibold uppercase">📍 Location</p>
                            <p className="font-semibold text-gray-900 mt-1">{internship.location}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-gray-600 text-xs font-semibold uppercase flex items-center gap-1"><FaBriefcase /> Type</p>
                            <p className="font-semibold text-gray-900 mt-1">{internship.job_type}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-gray-600 text-xs font-semibold uppercase">📚 Domain</p>
                            <p className="font-semibold text-yellow-700 mt-1">{internship.domain || internship.job_type || 'Technology'}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-gray-600 text-xs font-semibold uppercase">⏱️ Duration</p>
                            <p className="font-semibold text-gray-900 mt-1">{internship.duration_months}M</p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200 col-span-2">
                            <p className="text-gray-600 text-xs font-semibold uppercase">💰 Stipend</p>
                            <p className="font-semibold text-yellow-700 mt-1">₹{internship.stipend?.toLocaleString() || 'TBD'}</p>
                          </div>
                        </div>

                        {/* Description */}
                        {internship.description && (
                          <div>
                            <p className="text-gray-600 text-sm font-semibold mb-2">About this internship</p>
                            <p className="text-gray-700 text-sm line-clamp-3">{internship.description}</p>
                          </div>
                        )}

                        {/* Requirements */}
                        {internship.requirements && (
                          <div>
                            <p className="text-gray-600 text-sm font-semibold mb-2">What we're looking for</p>
                            <p className="text-gray-700 text-sm line-clamp-2">{internship.requirements}</p>
                          </div>
                        )}

                        {/* Deadline */}
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
                          </svg>
                          <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        {applied ? (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg">
                            <p className="text-blue-700 font-semibold text-sm">✓ You have already applied</p>
                          </div>
                        ) : !eligibility?.isEligible ? (
                          <button disabled className="w-full bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-lg cursor-not-allowed">
                            ❌ Not Eligible Yet
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedInternship(internship.id)}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-md"
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
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slide-up">
            {selectedInternship === 'domain' ? (
              <>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-8 text-white">
                  <h2 className="text-3xl font-bold">🎯 Select Your Domain of Interest</h2>
                  <p className="text-yellow-100 mt-2">Choose your career focus area</p>
                </div>

                <div className="p-8">
                  <p className="text-gray-700 mb-6">
                    Select the domain that interests you most. We'll show you internship opportunities that match your selected domain.
                  </p>

                  <label className="block text-gray-900 font-bold text-lg mb-4">Domain of Interest</label>
                  <select
                    value={domainOfInterest}
                    onChange={(e) => setDomainOfInterest(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:border-yellow-500 transition-colors text-gray-700 font-medium"
                  >
                    <option value="">-- Select a Domain --</option>
                    {DOMAINS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>

                  <label className="block text-gray-900 font-bold text-lg mt-6 mb-3">Tell Us About Yourself (Optional)</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:border-yellow-500 transition-colors"
                    rows="4"
                    placeholder="Share your background, experience, or specific interests within this domain..."
                  />

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => {
                        setSelectedInternship(null);
                        setCoverLetter("");
                        setDomainOfInterest("");
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (!token) {
                          alert("Please login to proceed");
                          return;
                        }
                        if (!domainOfInterest.trim()) {
                          alert("Please select a domain");
                          return;
                        }
                        try {
                          const res = await axios.post(
                            "http://localhost:5001/api/internships/select-domain",
                            { domain: domainOfInterest, message: coverLetter },
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          alert("✅ Domain preference saved! View matched internships below.");
                          setSelectedInternship(null);
                          setCoverLetter("");
                          setDomainOfInterest("");
                          fetchData();
                        } catch (err) {
                          alert("❌ " + (err.response?.data?.message || "Failed to save preference"));
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
                  <h2 className="text-3xl font-bold flex items-center gap-2"><FaEdit /> Submit Application</h2>
                  <p className="text-orange-100 mt-2">Complete your internship application</p>
                </div>

                <div className="p-8">
                  <label className="block text-gray-900 font-bold text-lg mb-3">Cover Letter</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-4 focus:outline-none focus:border-orange-500 transition-colors"
                    rows="6"
                    placeholder="Tell us why you're interested in this internship and what you'd like to contribute..."
                  />

                  <p className="text-gray-600 text-sm mt-3">Tip: Make it personal and highlight relevant skills or experiences</p>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setSelectedInternship(null)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleApply(selectedInternship)}
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all"
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
    </>
  );
}
