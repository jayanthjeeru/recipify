import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../context/AuthContext';
import { User, Heart, ChefHat, LogOut, Settings, Plus, Loader2, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wishlist');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [favsRes, myRes] = await Promise.all([
          axios.get('/api/recipes'), // In a real app, this would be filtered
          axios.get('/api/recipes') // In a real app, this would be filtered
        ]);
        
        // Simulating filtering for demo purposes
        setFavorites(favsRes.data.filter(r => r.isFavorite));
        setMyRecipes(myRes.data.filter(r => r.authorName === user.username));
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary-500" />
        <p className="text-xl font-medium">Loading your profile...</p>
      </div>
    );
  }

  const isPrivileged = user?.roles.includes('ROLE_PRIVILEGED_USER') || user?.roles.includes('ROLE_ADMIN');

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      {/* Header */}
      <div className="relative bg-white rounded-[4rem] p-12 shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0 opacity-50 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="h-40 w-40 rounded-[3rem] bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-black text-6xl shadow-2xl shadow-primary-200">
            {user.username.charAt(0).toUpperCase()}
          </div>
          {isPrivileged && (
            <div className="absolute -bottom-4 -right-4 bg-yellow-400 p-3 rounded-2xl shadow-xl ring-8 ring-white">
              <Star className="h-8 w-8 text-white fill-white" />
            </div>
          )}
        </div>

        <div className="relative z-10 flex-grow text-center md:text-left space-y-4">
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">{user.username}</h1>
            <p className="text-xl text-gray-500 font-medium">{user.email}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {user.roles.map(role => (
              <span key={role} className="bg-primary-50 text-primary-600 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-primary-100 shadow-sm">
                {role.replace('ROLE_', '')}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col space-y-4 w-full md:w-auto">
          <button onClick={() => { logout(); navigate('/'); }} className="bg-gray-900 text-white px-8 py-4 rounded-3xl font-black hover:bg-black transition-all shadow-xl flex items-center justify-center space-x-2 active:scale-95">
            <LogOut className="h-6 w-6" />
            <span>Logout</span>
          </button>
          {isPrivileged && (
            <button onClick={() => navigate('/upload')} className="bg-primary-600 text-white px-8 py-4 rounded-3xl font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 flex items-center justify-center space-x-2 active:scale-95">
              <Plus className="h-6 w-6" />
              <span>Create Recipe</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50 flex items-center space-x-6 group">
          <div className="p-5 rounded-3xl bg-pink-50 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
            <Heart className="h-10 w-10" />
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900">{favorites.length}</p>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Wishlist Items</p>
          </div>
        </div>
        {isPrivileged && (
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50 flex items-center space-x-6 group">
            <div className="p-5 rounded-3xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
              <ChefHat className="h-10 w-10" />
            </div>
            <div>
              <p className="text-4xl font-black text-gray-900">{myRecipes.length}</p>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">My Recipes</p>
            </div>
          </div>
        )}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50 flex items-center space-x-6 group">
          <div className="p-5 rounded-3xl bg-yellow-50 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
            <Sparkles className="h-10 w-10" />
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900">Expert</p>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Chef Level</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-10 pb-20">
        <div className="flex items-center space-x-12 border-b-2 border-gray-100">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-6 text-2xl font-black transition-all relative ${
              activeTab === 'wishlist' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            My Wishlist
            {activeTab === 'wishlist' && <div className="absolute bottom-[-2px] left-0 w-full h-1.5 bg-primary-600 rounded-full"></div>}
          </button>
          {isPrivileged && (
            <button
              onClick={() => setActiveTab('my-recipes')}
              className={`pb-6 text-2xl font-black transition-all relative ${
                activeTab === 'my-recipes' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              My Uploads
              {activeTab === 'my-recipes' && <div className="absolute bottom-[-2px] left-0 w-full h-1.5 bg-primary-600 rounded-full"></div>}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeTab === 'wishlist' ? (
            favorites.length === 0 ? (
              <div className="col-span-full py-20 text-center space-y-4 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <Heart className="h-16 w-16 text-gray-200 mx-auto" />
                <p className="text-2xl font-bold text-gray-400">Your wishlist is empty</p>
                <button onClick={() => navigate('/')} className="text-primary-600 font-black hover:underline">Explore Recipes</button>
              </div>
            ) : (
              favorites.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)
            )
          ) : (
            myRecipes.length === 0 ? (
              <div className="col-span-full py-20 text-center space-y-4 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <ChefHat className="h-16 w-16 text-gray-200 mx-auto" />
                <p className="text-2xl font-bold text-gray-400">You haven't uploaded any recipes yet</p>
                <button onClick={() => navigate('/upload')} className="text-primary-600 font-black hover:underline">Share Your First Recipe</button>
              </div>
            ) : (
              myRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
