import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaChartBar } from "react-icons/fa";

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
`;

export default function InternshipApplications() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyStatus, setReplyStatus] = useState("accepted");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const token = localStorage.getItem("learnix_token");

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5001/api/internships/applications", { headers: { Authorization: `Bearer ${token}` } });
      setApplications(res.data || []);
      setFilteredApplications(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // Filter and sort applications
  useEffect(() => {
    let result = [...applications];

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(app =>
        (app.user_name || '').toLowerCase().includes(q) ||
        (app.user_email || '').toLowerCase().includes(q) ||
        (app.internship_title || '').toLowerCase().includes(q) ||
        (app.internship_company || '').toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter(app => app.status === filterStatus);
    }

    // Sort
    if (sortBy === "date") {
      result.sort((a, b) => new Date(b.applied_date) - new Date(a.applied_date));
    } else if (sortBy === "company") {
      result.sort((a, b) => (a.internship_company || '').localeCompare(b.internship_company || ''));
    }

    setFilteredApplications(result);
  }, [applications, searchQuery, filterStatus, sortBy]);

  const openReply = (app) => {
    setSelected(app);
    setReplyMessage(app.admin_message || "");
    setReplyStatus(app.status === 'pending' ? 'accepted' : app.status);
  };

  const submitReply = async () => {
    if (!selected) return;
    try {
      await axios.put(
        `http://localhost:5001/api/internships/applications/${selected.id}/reply`,
        { status: replyStatus, admin_message: replyMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Reply sent');
      setSelected(null);
      fetchApps();
    } catch (err) {
      console.error(err);
      alert('Failed to send reply');
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--site-bg)' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      <div style={{ backgroundColor: 'var(--site-bg)' }} className="min-h-screen p-8">
        {/* Header */}
        <div className="mb-10 animate-slide-up">
          <div className="inline-block mb-4 px-4 py-2 bg-orange-100 rounded-full">
            <span className="text-orange-600 font-semibold text-sm tracking-widest uppercase">📋 Applications</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Internship <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Applications</span>
          </h1>
          <p className="text-gray-600 text-lg">Manage and respond to internship applications from candidates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{applications.length}</p>
              </div>
              <div className="text-4xl">📄</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {applications.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Accepted</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {applications.filter(a => a.status === 'accepted').length}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {applications.filter(a => a.status === 'rejected').length}
                </p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Applications</label>
              <input
                placeholder="Search by candidate or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="date">Recent First</option>
                <option value="company">Company Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center animate-slide-up">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No applications found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {filteredApplications.map((app) => {
              const statusColor = app.status === 'accepted' ? 'green' : app.status === 'rejected' ? 'red' : 'yellow';
              const statusIcon = app.status === 'accepted' ? '✅' : app.status === 'rejected' ? '❌' : '⏳';

              return (
                <div key={app.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden group">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{app.internship_title}</h3>
                        <p className="text-orange-600 font-semibold">{app.internship_company}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        <span className="text-lg">{statusIcon}</span>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        {(app.user_name || app.user_email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{app.user_name || 'Unknown'}</p>
                        <p className="text-gray-600 text-sm">{app.user_email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Applied</p>
                        <p className="text-gray-900 font-semibold mt-1">
                          {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : '—'}
                        </p>
                      </div>
                      {app.response_date && (
                        <div>
                          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Responded</p>
                          <p className="text-gray-900 font-semibold mt-1">
                            {new Date(app.response_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Cover Letter Preview */}
                    {app.cover_letter && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-700 text-sm line-clamp-2">{app.cover_letter}</p>
                      </div>
                    )}

                    {/* Resume */}
                    {app.resume_url && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.5 13a3 3 0 01-.369-5.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                        </svg>
                        <a href={app.resume_url} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:text-blue-700">
                          Download Resume
                        </a>
                      </div>
                    )}

                    {/* Admin Message Preview */}
                    {app.admin_message && (
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <p className="text-xs font-semibold text-orange-700 uppercase mb-2">Admin Reply</p>
                        <p className="text-gray-700 text-sm">{app.admin_message}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={() => openReply(app)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                    >
                      {app.status === 'pending' ? <><FaEdit className="inline mr-1" /> Review & Reply</> : <><FaEdit className="inline mr-1" /> Edit Reply</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reply Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slide-up">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selected.internship_title}</h2>
                    <p className="text-orange-100 mt-1">{selected.internship_company}</p>
                    <p className="text-orange-100 text-sm mt-2">Applicant: {selected.user_name || selected.user_email}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-white hover:bg-orange-700 p-2 rounded-lg transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Applicant Info */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">📌 Applicant Information</h3>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-600 text-sm">Name</p>
                      <p className="font-semibold text-gray-900">{selected.user_name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Email</p>
                      <p className="font-semibold text-gray-900 break-all">{selected.user_email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Applied Date</p>
                      <p className="font-semibold text-gray-900">
                        {selected.applied_date ? new Date(selected.applied_date).toLocaleString() : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Response Date</p>
                      <p className="font-semibold text-gray-900">
                        {selected.response_date ? new Date(selected.response_date).toLocaleString() : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resume */}
                {selected.resume_url && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">📄 Resume</h3>
                    <a href={selected.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.5 13a3 3 0 01-.369-5.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                      </svg>
                      Download Resume
                    </a>
                  </div>
                )}

                {/* Cover Letter */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">💬 Cover Letter</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="whitespace-pre-wrap text-gray-700">{selected.cover_letter || '—'}</p>
                  </div>
                </div>

                {/* Admin Reply */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">✍️ Admin Reply</h3>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 transition-colors h-32"
                    placeholder="Write your response to the applicant..."
                  />
                </div>

                {/* Status */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><FaChartBar /> Application Status</h3>
                  <select
                    value={replyStatus}
                    onChange={(e) => setReplyStatus(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="accepted">✅ Accept</option>
                    <option value="rejected">❌ Reject</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 border-t border-gray-200 p-6 flex gap-3 justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReply}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
