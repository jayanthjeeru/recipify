import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import { Search, Loader2, ChefHat, Sparkles, Utensils, Clock, Flame, Users, ArrowRight, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showNoResults, setShowNoResults] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const observer = useRef();

  const lastRecipeElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get('term');
    setSearchTerm(searchParam || '');
    setRecipes([]);
    setPage(0);
    setHasMore(true);
    setShowNoResults(false);
  }, [location.search]);

  useEffect(() => {
    fetchRecipes();
  }, [page, searchTerm]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      let url = searchTerm 
        ? `/api/recipes/search?term=${searchTerm}&page=${page}&size=12`
        : `/api/recipes?page=${page}&size=12`;
      
      const res = await axios.get(url);
      const newRecipes = res.data;
      
      if (newRecipes.length === 0) {
        setHasMore(false);
        if (page === 0) setShowNoResults(true);
      } else {
        setRecipes((prev) => [...prev, ...newRecipes]);
        if (newRecipes.length < 12) setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to fetch recipes', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=300&auto=format&fit=crop' },
    { name: 'Paneer', img: 'https://images.unsplash.com/photo-1567184109171-9699d886919e?q=80&w=300&auto=format&fit=crop' },
    { name: 'Dosa', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=300&auto=format&fit=crop' },
    { name: 'Chole', img: 'https://images.unsplash.com/photo-1596797038530-2c39bb9edc6c?q=80&w=300&auto=format&fit=crop' },
    { name: 'Vada Pav', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=300&auto=format&fit=crop' },
    { name: 'Dal Makhani', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=300&auto=format&fit=crop' },
    { name: 'Desserts', img: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=300&auto=format&fit=crop' },
    { name: 'Snacks', img: 'https://images.unsplash.com/photo-1601050633647-81a35d37c331?q=80&w=300&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean and Modern */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden mb-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl w-full px-6 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
            Delicious <span className="text-orange-500">Indian</span> Flavors
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md">
            The best recipes from your favorite regions, delivered to your kitchen.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20 space-y-12">
        
        {/* Horizontal Categories - Swiggy Style */}
        <section className="space-y-6 overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">What's on your mind?</h2>
          </div>
          <div className="flex overflow-x-auto pb-4 no-scrollbar gap-6 md:gap-10 scroll-smooth">
            {categories.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => { window.history.pushState({}, '', `/?term=${cat.name}`); window.dispatchEvent(new PopStateEvent('popstate')); }}
                className="flex-shrink-0 group flex flex-col items-center space-y-3"
              >
                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-transparent group-hover:border-orange-500 transition-all duration-300 shadow-md">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="font-bold text-gray-700 text-sm md:text-base group-hover:text-orange-500 transition-colors">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Filter Section - Sticky */}
        <section className="sticky top-[72px] z-30 bg-white py-4 border-b border-gray-100 -mx-6 px-6 overflow-x-auto no-scrollbar flex items-center gap-3">
          <button className="flex-shrink-0 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 font-bold text-xs md:text-sm flex items-center gap-2 transition-colors">
            Filter <Utensils className="h-3 w-3" />
          </button>
          <button className="flex-shrink-0 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 font-bold text-xs md:text-sm transition-colors">Sort By</button>
          <button className="flex-shrink-0 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 font-bold text-xs md:text-sm transition-colors">Fast Prep</button>
          <button className="flex-shrink-0 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 font-bold text-xs md:text-sm transition-colors">New Arrival</button>
          <button className="flex-shrink-0 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 font-bold text-xs md:text-sm transition-colors">Ratings 4.0+</button>
          <button className="flex-shrink-0 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 font-bold text-xs md:text-sm transition-colors">Pure Veg</button>
          <button className="flex-shrink-0 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 font-bold text-xs md:text-sm transition-colors">Less than ₹300</button>
        </section>

        {/* Recipe Grid */}
        <div className="space-y-8">
          <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">
            {searchTerm ? `Top results for "${searchTerm}"` : 'Recipes delivered to your home'}
          </h2>

          {showNoResults ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
              <div className="bg-gray-50 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-gray-100">
                <XCircle className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-black text-gray-800">Uhh, it's not there!</h3>
                <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">No results for your search. Try another dish?</p>
                <button 
                  onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
                  className="mt-6 bg-orange-500 text-white px-6 py-2 md:px-8 md:py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100"
                >
                  Clear All
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
              {recipes.map((recipe, index) => (
                <div 
                  key={`${recipe.id}-${index}`}
                  ref={index === recipes.length - 1 ? lastRecipeElementRef : null}
                  className="hover:scale-[0.98] transition-transform duration-300"
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 md:h-10 md:w-10 animate-spin text-orange-500" />
            </div>
          )}

          {!hasMore && recipes.length > 0 && (
            <div className="text-center py-10 border-t border-gray-100">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">You've reached the end of our menu!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
