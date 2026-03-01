import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, ArrowRight, Loader2, ChefHat } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl space-y-8 border border-gray-100">
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 bg-primary-50 rounded-3xl mb-4 text-primary-600">
            <ChefHat className="h-12 w-12" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Welcome back!</h2>
          <p className="text-gray-500 font-medium">Log in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all text-gray-900 font-medium"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-primary-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <>
                <span>Login Now</span>
                <ArrowRight className="h-6 w-6" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 font-bold hover:underline underline-offset-4">Create one for free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
