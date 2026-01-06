import { useEffect, useState } from "react";
import axios from "axios";

export default function InternshipApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyStatus, setReplyStatus] = useState("accepted");

  const token = localStorage.getItem("learnix_token");

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5001/api/internships/applications", { headers: { Authorization: `Bearer ${token}` } });
      setApplications(res.data || []);
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

  if (loading) return <div className="p-6">Loading applications...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Internship Applications</h2>
      {applications.length === 0 ? (
        <div className="text-gray-600">No applications yet.</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
              <div className="flex-1">
                <div className="font-semibold">{app.internship_title} @ {app.internship_company}</div>
                <div className="text-sm text-gray-600">Applicant: {app.user_name || app.user_email}</div>
                <div className="text-sm text-gray-500">Email: {app.user_email}</div>
                <div className="text-sm text-gray-500">Applied: {app.applied_date ? new Date(app.applied_date).toLocaleString() : '-'}</div>
                {app.response_date && <div className="text-sm text-gray-500">Responded: {new Date(app.response_date).toLocaleString()}</div>}

                <div className="mt-2 text-sm">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${app.status === 'accepted' ? 'bg-green-100 text-green-800' : app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {app.status?.toUpperCase()}
                  </span>
                </div>

                {app.resume_url && (
                  <div className="mt-2 text-sm">
                    <a href={app.resume_url} target="_blank" rel="noreferrer" className="text-indigo-600 underline">View Resume</a>
                  </div>
                )}

                {app.cover_letter && (
                  <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    <div className="font-semibold text-sm mb-1">Cover Letter</div>
                    <div className="line-clamp-3">{app.cover_letter}</div>
                    <div className="mt-2">
                      <button onClick={() => openReply(app)} className="text-indigo-600 text-sm font-semibold">View & Reply</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button onClick={() => openReply(app)} className="bg-indigo-600 text-white px-3 py-1 rounded">Reply</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply / Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 overflow-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Application Details</h3>
                <div className="text-sm text-gray-600">{selected.internship_title} • {selected.internship_company}</div>
                <div className="text-sm text-gray-500">Applicant: {selected.user_name || selected.user_email} — {selected.user_email}</div>
                <div className="text-sm text-gray-500">Applied: {selected.applied_date ? new Date(selected.applied_date).toLocaleString() : '-'}</div>
                {selected.response_date && <div className="text-sm text-gray-500">Responded: {new Date(selected.response_date).toLocaleString()}</div>}
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-800">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              {selected.resume_url && (
                <div>
                  <div className="text-sm font-semibold">Resume</div>
                  <a href={selected.resume_url} target="_blank" rel="noreferrer" className="text-indigo-600 underline">Open Resume</a>
                </div>
              )}

              <div>
                <div className="text-sm font-semibold">Cover Letter</div>
                <div className="mt-2 whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-3 rounded">{selected.cover_letter || '—'}</div>
              </div>

              <div>
                <div className="text-sm font-semibold">Admin Note</div>
                <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="w-full border p-2 rounded h-28 mt-1" placeholder="Optional message to applicant" />
              </div>

              <div>
                <div className="text-sm font-semibold">Status</div>
                <select value={replyStatus} onChange={(e) => setReplyStatus(e.target.value)} className="w-full border p-2 rounded mt-1">
                  <option value="accepted">Accept</option>
                  <option value="rejected">Reject</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={submitReply} className="px-4 py-2 bg-indigo-600 text-white rounded">Send Reply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
