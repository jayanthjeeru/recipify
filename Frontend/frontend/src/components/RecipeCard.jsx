import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, User, MessageCircle, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const RecipeCard = ({ recipe }) => {
  // Calculate average rating
  const avgRating = recipe.reviews.length > 0 
    ? (recipe.reviews.reduce((sum, r) => sum + r.rating, 0) / recipe.reviews.length).toFixed(1)
    : (4.0 + (recipe.id % 10) / 10).toFixed(1); // Mock rating for visual consistency

  return (
    <Link to={`/recipe/${recipe.id}`} className="group block space-y-3 transition-all duration-300">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
        <img
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop'}
          alt={recipe.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <Star className="h-3 w-3 fill-green-600 text-green-600" />
            <span className="text-xs font-black text-gray-900">{avgRating}</span>
          </span>
          <span className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-gray-900 uppercase tracking-tighter shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            {recipe.prepTime} MINS
          </span>
        </div>

        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-400 hover:text-orange-500 transition-all shadow-sm hover:scale-110 active:scale-90">
          <Heart className={clsx("h-4 w-4", recipe.isFavorite && "fill-orange-500 text-orange-500")} />
        </button>
      </div>

      <div className="px-1 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-black text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1">{recipe.name}</h3>
          <span className="flex-shrink-0 text-sm font-black text-gray-900">₹{recipe.estimatedCost?.toFixed(0)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span className="truncate">{recipe.category || 'Main Course'}</span>
          <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
          <span className="truncate">{recipe.difficulty || 'Medium'}</span>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <User className="h-3 w-3" />
            <span className="truncate max-w-[80px]">{recipe.authorName}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <MessageCircle className="h-3 w-3" />
            <span>{recipe.reviews.length} Reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
