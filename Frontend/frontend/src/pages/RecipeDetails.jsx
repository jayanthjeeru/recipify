import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Clock, User, MessageCircle, ArrowLeft, Loader2, Sparkles, ChefHat, CheckCircle2, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ comment: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error('Failed to fetch recipe', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(`/api/recipes/${id}/favorite`);
      setRecipe({ ...recipe, isFavorite: !recipe.isFavorite });
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  const toggleLike = async () => {
    try {
      await axios.post(`/api/recipes/${id}/like`);
      setRecipe({ ...recipe, likesCount: recipe.likesCount + 1 });
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`/api/recipes/${id}/reviews`, reviewForm);
      // Refresh recipe to show new review
      const res = await axios.get(`/api/recipes/${id}`);
      setRecipe(res.data);
      setReviewForm({ comment: '', rating: 5 });
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary-500" />
        <p className="text-xl font-medium">Preparing your delicious recipe view...</p>
      </div>
    );
  }

  if (!recipe) return <div className="text-center py-20 text-gray-500 font-bold text-2xl">Recipe not found!</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition group font-bold">
        <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
        <span>Go Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image and Actions */}
        <div className="space-y-8">
          <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl group">
            <img
              src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop'}
              alt={recipe.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <button
              onClick={toggleFavorite}
              className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm p-4 rounded-3xl text-gray-400 hover:text-primary-600 transition shadow-xl group/btn active:scale-90"
            >
              <Heart className={`h-8 w-8 ${recipe.isFavorite ? 'fill-primary-500 text-primary-500' : ''} transition-all duration-300 group-hover/btn:scale-110`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-8 bg-white rounded-[3rem] border border-gray-100 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-3xl bg-primary-50 flex items-center justify-center text-primary-600 font-black text-2xl uppercase">
                {recipe.authorName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Recipe by</p>
                <p className="text-xl font-black text-gray-900">{recipe.authorName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Created on</p>
              <p className="text-xl font-black text-gray-900">{new Date(recipe.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Info and Content */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-gray-900 leading-tight tracking-tight">{recipe.name}</h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">{recipe.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-primary-600 p-6 rounded-[2rem] text-white shadow-xl shadow-primary-100 flex flex-col items-center justify-center space-y-1 text-center">
              <span className="text-xl font-black">₹</span>
              <p className="text-2xl font-black">{recipe.estimatedCost.toFixed(0)}</p>
              <p className="text-[10px] font-bold text-primary-200 uppercase tracking-widest">Total Cost</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-[2rem] text-white shadow-xl flex flex-col items-center justify-center space-y-1 text-center">
              <Clock className="h-6 w-6 text-gray-400" />
              <p className="text-2xl font-black">{recipe.prepTime}m</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prep Time</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] text-gray-900 shadow-xl border border-gray-100 flex flex-col items-center justify-center space-y-1 text-center">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <p className="text-2xl font-black">{recipe.difficulty}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Difficulty</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] text-gray-900 shadow-xl border border-gray-100 flex flex-col items-center justify-center space-y-1 text-center">
              <ChefHat className="h-6 w-6 text-primary-600" />
              <p className="text-2xl font-black">{recipe.servings}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Servings</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900 flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-primary-600" />
              <span>What You'll Need</span>
            </h2>
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-4">
              {recipe.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 group">
                  <div className="flex items-center space-x-4">
                    <div className="h-3 w-3 rounded-full bg-primary-500 group-hover:scale-125 transition-transform" />
                    <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{ing.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-gray-900">{ing.quantity}</span>
                    <p className="text-sm text-gray-400 font-medium">₹{ing.cost.toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900 flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <span>Preparation Steps</span>
            </h2>
            <div className="space-y-6">
              {recipe.instructions.map((inst, idx) => (
                <div key={idx} className="flex items-start space-x-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl group hover:border-primary-200 transition-all">
                  <div className="h-14 w-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-primary-100 flex-shrink-0 group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <p className="text-xl text-gray-700 font-medium leading-relaxed pt-2">{inst}</p>
                </div>
              ))}
            </div>
          </div>

          {recipe.suggestions.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900 flex items-center space-x-3">
                <Sparkles className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                <span>Chef's Tips</span>
              </h2>
              <div className="bg-yellow-50 rounded-[3rem] p-10 border border-yellow-100 shadow-xl space-y-4">
                {recipe.suggestions.map((sug, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <CheckCircle2 className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                    <p className="text-lg text-gray-700 font-medium">{sug}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <section className="space-y-8 pt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-black text-gray-900 flex items-center space-x-4">
            <MessageCircle className="h-10 w-10 text-primary-600" />
            <span>User Reviews ({recipe.reviews.length})</span>
          </h2>
          <button
            onClick={toggleLike}
            className="flex items-center space-x-2 bg-pink-50 text-pink-600 px-6 py-3 rounded-2xl font-black hover:bg-pink-100 transition shadow-sm group"
          >
            <Heart className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span>{recipe.likesCount} Likes</span>
          </button>
        </div>

        {user && (
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl space-y-6">
            <h3 className="text-2xl font-black text-gray-900">Write a Review</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-bold text-gray-700">Rating:</span>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                      className={`p-2 rounded-xl transition-all ${
                        reviewForm.rating >= num ? 'text-primary-600 bg-primary-50' : 'text-gray-300 bg-gray-50'
                      }`}
                    >
                      <Heart className={`h-6 w-6 ${reviewForm.rating >= num ? 'fill-primary-600' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all text-gray-900 font-medium placeholder-gray-300 min-h-[100px]"
                placeholder="Share your experience with this recipe..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-primary-700 transition shadow-lg shadow-primary-100 flex items-center space-x-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Post Review</span>}
              </button>
            </form>
          </div>
        )}

        {recipe.reviews.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-200 text-gray-400 font-bold text-xl">
            No reviews yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recipe.reviews.map(review => (
              <div key={review.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase">
                      {review.username.charAt(0)}
                    </div>
                    <span className="font-black text-gray-900">{review.username}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-primary-500 text-primary-500' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 font-medium text-lg leading-relaxed">"{review.comment}"</p>
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RecipeDetails;
