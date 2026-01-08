import { useState, useEffect } from 'react';

export default function ContactQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [reply, setReply] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Fetch all queries
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/contact/queries', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch queries');
      }

      const data = await response.json();
      setQueries(data);
    } catch (err) {
      console.error('Error fetching queries:', err);
      alert('Failed to load contact queries');
    } finally {
      setLoading(false);
    }
  };

  // Get filtered queries
  const getFilteredQueries = () => {
    if (filter === 'all') return queries;
    return queries.filter(q => q.status === filter);
  };

  // Handle reply submission
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      setReplyLoading(true);
      const response = await fetch(`http://localhost:5001/api/contact/queries/${selectedQuery.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ reply })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reply');
      }

      alert('Reply sent successfully!');
      setReply('');
      setSelectedQuery(null);
      fetchQueries();
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Error: ' + err.message);
    } finally {
      setReplyLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (queryId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/contact/queries/${queryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      fetchQueries();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status');
    }
  };

  // Handle delete
  const handleDelete = async (queryId) => {
    if (!window.confirm('Are you sure you want to delete this query?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/contact/queries/${queryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete query');
      }

      alert('Query deleted successfully');
      setSelectedQuery(null);
      fetchQueries();
    } catch (err) {
      console.error('Error deleting query:', err);
      alert('Error deleting query');
    }
  };

  const filteredQueries = getFilteredQueries();
  const pendingCount = queries.filter(q => q.status === 'pending').length;
  const respondedCount = queries.filter(q => q.status === 'responded').length;
  const closedCount = queries.filter(q => q.status === 'closed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Queries</h1>
          <p className="text-gray-600 mt-1">Manage user inquiries and send replies</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{pendingCount}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Responded</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{respondedCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Closed</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{closedCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Queries
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'pending'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('responded')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'responded'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Responded
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'closed'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Closed
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queries List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Queries ({filteredQueries.length})</h2>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500">Loading queries...</div>
              ) : filteredQueries.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No queries found</div>
              ) : (
                filteredQueries.map(query => (
                  <div
                    key={query.id}
                    onClick={() => setSelectedQuery(query)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedQuery?.id === query.id ? 'bg-orange-50 border-l-4 border-orange-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{query.subject}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        query.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        query.status === 'responded' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {query.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{query.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(query.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Query Detail & Reply */}
        <div className="lg:col-span-2">
          {selectedQuery ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedQuery.subject}</h2>
                    <p className="text-gray-600 mt-1">From: {selectedQuery.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedQuery.status}
                      onChange={(e) => {
                        handleStatusUpdate(selectedQuery.id, e.target.value);
                        setSelectedQuery({ ...selectedQuery, status: e.target.value });
                      }}
                      className={`text-sm font-semibold px-3 py-2 rounded-lg outline-none ${
                        selectedQuery.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        selectedQuery.status === 'responded' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this query?')) {
                          handleDelete(selectedQuery.id);
                        }
                      }}
                      className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">{selectedQuery.name}</p>
                  </div>
                    <div>
                      {/* Phone field removed from contact form */}
                  </div>
                  <div>
                    <p className="text-gray-600">Submitted</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedQuery.created_at).toLocaleDateString()} {new Date(selectedQuery.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  {selectedQuery.reply_date && (
                    <div>
                      <p className="text-gray-600">Replied</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(selectedQuery.reply_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Original Message */}
              <div className="p-6 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-3">User's Message</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedQuery.message}</p>
              </div>

              {/* Admin Reply */}
              {selectedQuery.reply && (
                <div className="p-6 border-b bg-green-50">
                  <h3 className="font-semibold text-gray-900 mb-3 text-green-900">Your Reply</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedQuery.reply}</p>
                  <p className="text-xs text-gray-600 mt-3">
                    Sent: {new Date(selectedQuery.reply_date).toLocaleDateString()} {new Date(selectedQuery.reply_date).toLocaleTimeString()}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              {!selectedQuery.reply && (
                <form onSubmit={handleReplySubmit} className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Send Reply</h3>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={replyLoading}
                    className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
                  >
                    {replyLoading ? 'Sending...' : 'Send Reply'}
                  </button>
                </form>
              )}

              {selectedQuery.reply && (
                <div className="p-6 bg-blue-50 border-t">
                  <p className="text-blue-900">✓ This query has already been replied to.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              <p className="text-gray-500 text-lg">Select a query to view details and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
