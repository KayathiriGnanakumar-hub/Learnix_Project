import { useState, useEffect } from 'react';
import { User, Lock, Mail, Trash2, Plus, AlertCircle } from 'lucide-react';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if current user is the permanent admin
    const token = localStorage.getItem('learnix_token');
    const user = localStorage.getItem('learnix_user');
    
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      setIsAdmin(userData.email === 'admin@learnix.com');
    }

    if (isAdmin) {
      fetchAdmins();
    }
  }, [isAdmin]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('learnix_token');
      const response = await fetch('http://localhost:5001/api/admin/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('learnix_token');

      const response = await fetch('http://localhost:5001/api/admin/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Admin "${formData.name}" created successfully!`);
        setFormData({ name: '', email: '', password: '' });
        setErrors({});
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchAdmins();
      } else {
        setErrors({ form: data.message || 'Failed to create admin' });
      }
    } catch (err) {
      setErrors({ form: 'Error creating admin: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId, adminEmail) => {
    if (adminEmail === 'admin@learnix.com') {
      alert('Cannot delete the permanent admin account');
      return;
    }

    if (confirm(`Are you sure you want to delete admin "${adminEmail}"?`)) {
      try {
        const token = localStorage.getItem('learnix_token');
        const response = await fetch(`http://localhost:5001/api/admin/${adminId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setSuccessMessage('Admin deleted successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
          fetchAdmins();
        }
      } catch (err) {
        console.error('Error deleting admin:', err);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--site-bg)' }}>
        <div className="pt-28 pb-8 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center border border-slate-200">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-600">Only the permanent admin can manage admin accounts.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--site-bg)' }}>
      <div className="pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              Admin <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Management</span>
            </h1>
            <p className="text-slate-600 text-lg">Manage administrator accounts and grant access to team members</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 sticky top-32">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Plus className="w-6 h-6 text-orange-500" />
                  Create Admin
                </h2>

                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium text-sm">{successMessage}</p>
                  </div>
                )}

                {errors.form && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium text-sm">{errors.form}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      <User className="w-4 h-4 inline mr-2 text-orange-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:border-orange-500 ${
                        errors.name ? 'border-red-300' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      <Mail className="w-4 h-4 inline mr-2 text-orange-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:border-orange-500 ${
                        errors.email ? 'border-red-300' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      placeholder="admin@example.com"
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      <Lock className="w-4 h-4 inline mr-2 text-orange-500" />
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:border-orange-500 ${
                        errors.password ? 'border-red-300' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? 'Creating...' : 'Create Admin Account'}
                  </button>
                </form>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-xs font-medium">
                    <strong>Note:</strong> New admins will have full access to the admin panel once created. Use strong passwords.
                  </p>
                </div>
              </div>
            </div>

            {/* Admins List Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                  <h2 className="text-2xl font-bold text-white">Administrator Accounts</h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading admins...</p>
                    </div>
                  ) : admins.length === 0 ? (
                    <div className="text-center py-12">
                      <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600">No admin accounts created yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {admins.map((admin) => (
                        <div
                          key={admin.id}
                          className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-900">{admin.name}</h3>
                                  {admin.email === 'admin@learnix.com' && (
                                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full mt-1">
                                      Permanent Admin
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-orange-500" />
                                {admin.email}
                              </p>
                            </div>
                            {admin.email !== 'admin@learnix.com' && (
                              <button
                                onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-all text-red-600 hover:text-red-700"
                                title="Delete admin"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div className="flex gap-2 mt-3">
                            <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                              ✓ Active
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Card */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <p className="text-slate-600 text-sm font-medium mb-2">Total Admins</p>
                  <p className="text-3xl font-bold text-orange-600">{admins.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                  <p className="text-slate-600 text-sm font-medium mb-2">Active</p>
                  <p className="text-3xl font-bold text-green-600">{admins.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
