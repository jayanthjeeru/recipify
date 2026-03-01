import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, ChefHat, Check, Loader2, Star } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ['user']
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePrivileged = () => {
    const isPrivileged = formData.role.includes('privileged');
    setFormData({
      ...formData,
      role: isPrivileged ? ['user'] : ['user', 'privileged']
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl space-y-8 border border-gray-100">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 bg-primary-50 rounded-3xl mb-4 text-primary-600">
            <ChefHat className="h-12 w-12" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Create your account</h2>
          <p className="text-gray-500 font-medium text-lg">Join our global community of food lovers</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-5 rounded-3xl text-sm font-medium border border-red-100 animate-shake">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-5 rounded-3xl text-sm font-bold border border-green-100 flex items-center space-x-3">
            <Check className="h-6 w-6" />
            <span>Success! Redirecting you to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all text-gray-900 font-medium"
                  placeholder="CoolChef123"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all text-gray-900 font-medium"
                  placeholder="hello@recipify.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="password"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all text-gray-900 font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div
            onClick={togglePrivileged}
            className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
              formData.role.includes('privileged')
                ? 'bg-primary-50 border-primary-500 shadow-xl shadow-primary-50'
                : 'bg-gray-50 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl transition-colors ${
                formData.role.includes('privileged') ? 'bg-primary-600 text-white' : 'bg-white text-gray-400'
              }`}>
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Become a Privileged User</p>
                <p className="text-sm text-gray-500">Allowed to upload and share your own recipes!</p>
              </div>
            </div>
            <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
              formData.role.includes('privileged') ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-200'
            }`}>
              {formData.role.includes('privileged') && <Check className="h-5 w-5 text-white" />}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-primary-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <>
                <span>Create My Account</span>
                <UserPlus className="h-6 w-6" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-bold hover:underline underline-offset-4">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
