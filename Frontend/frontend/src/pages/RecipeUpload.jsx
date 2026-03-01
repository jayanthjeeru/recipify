import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Image as ImageIcon, ChefHat, Save, PlusCircle, ArrowLeft, Loader2, Sparkles, DollarSign } from 'lucide-react';

const RecipeUpload = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    prepTime: 30,
    difficulty: 'Medium',
    category: 'Dinner',
    servings: 2,
    ingredients: [{ name: '', quantity: '', cost: 0 }],
    instructions: [''],
    estimatedCost: 0,
    suggestions: ['']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '', cost: 0 }]
    });
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = field === 'cost' ? parseFloat(value) || 0 : value;
    
    // Auto-calculate total cost
    const totalCost = newIngredients.reduce((sum, item) => sum + (item.cost || 0), 0);
    
    setFormData({ ...formData, ingredients: newIngredients, estimatedCost: totalCost });
  };

  const handleAddSuggestion = () => {
    setFormData({ ...formData, suggestions: [...formData.suggestions, ''] });
  };

  const handleRemoveSuggestion = (index) => {
    const newSuggestions = formData.suggestions.filter((_, i) => i !== index);
    setFormData({ ...formData, suggestions: newSuggestions });
  };

  const handleSuggestionChange = (index, value) => {
    const newSuggestions = [...formData.suggestions];
    newSuggestions[index] = value;
    setFormData({ ...formData, suggestions: newSuggestions });
  };

  const handleAddInstruction = () => {
    setFormData({ ...formData, instructions: [...formData.instructions, ''] });
  };

  const handleRemoveInstruction = (index) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions });
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/recipes', formData);
      navigate('/');
    } catch (err) {
      console.error('Failed to upload recipe', err);
      setError(err.response?.data?.message || 'Failed to upload recipe. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-12">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition group font-bold">
          <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
          <span>Go Back</span>
        </button>
        <div className="text-right">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Upload Your Recipe</h1>
          <p className="text-gray-500 font-medium">Share your culinary masterpiece with the world</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 animate-in fade-in slide-in-from-top-4 font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Basic Info & Image */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl space-y-8 border border-gray-100">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Recipe Name</label>
                <input
                  type="text"
                  className="w-full px-8 py-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all text-xl font-bold text-gray-900 placeholder-gray-300"
                  placeholder="e.g. Grandma's Secret Spicy Pasta"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  className="w-full px-8 py-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all text-gray-900 font-medium placeholder-gray-300 min-h-[150px]"
                  placeholder="Tell us the story behind this recipe and how it tastes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Cover Image URL</label>
                <div className="relative group">
                  <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                  <input
                    type="url"
                    className="w-full pl-16 pr-8 py-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all text-gray-900 font-medium placeholder-gray-300"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    required
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-4 rounded-3xl overflow-hidden aspect-video border-4 border-gray-100 shadow-inner">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Prep Time (Min)</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all text-gray-900 font-bold"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Difficulty</label>
                  <select
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all text-gray-900 font-bold appearance-none"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Category</label>
                  <select
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all text-gray-900 font-bold appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>Dessert</option>
                    <option>Snack</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Servings</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all text-gray-900 font-bold"
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-2xl space-y-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 flex items-center space-x-3">
                <ChefHat className="h-8 w-8 text-primary-600" />
                <span>Ingredients</span>
              </h2>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="bg-primary-50 text-primary-600 px-6 py-3 rounded-2xl hover:bg-primary-100 transition font-bold flex items-center space-x-2"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Add More</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-gray-50 p-6 rounded-3xl animate-in fade-in slide-in-from-left-4">
                  <div className="flex-grow min-w-[200px]">
                    <input
                      type="text"
                      className="w-full bg-white px-5 py-3 rounded-2xl border-2 border-transparent focus:border-primary-500 transition-all text-gray-900 font-bold"
                      placeholder="Ingredient name"
                      value={ing.name}
                      onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="text"
                      className="w-full bg-white px-5 py-3 rounded-2xl border-2 border-transparent focus:border-primary-500 transition-all text-gray-900 font-bold text-center"
                      placeholder="Qty"
                      value={ing.quantity}
                      onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-32 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input
                      type="number"
                      step="1"
                      className="w-full bg-white pl-8 pr-4 py-3 rounded-2xl border-2 border-transparent focus:border-primary-500 transition-all text-gray-900 font-bold"
                      placeholder="Cost"
                      value={ing.cost}
                      onChange={(e) => handleIngredientChange(idx, 'cost', e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition"
                    disabled={formData.ingredients.length === 1}
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl space-y-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 flex items-center space-x-3">
                <ChefHat className="h-8 w-8 text-primary-600" />
                <span>Instructions</span>
              </h2>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="bg-primary-50 text-primary-600 px-6 py-3 rounded-2xl hover:bg-primary-100 transition font-bold flex items-center space-x-2"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.instructions.map((inst, idx) => (
                <div key={idx} className="flex items-start space-x-4 bg-gray-50 p-6 rounded-3xl animate-in fade-in slide-in-from-left-4">
                  <div className="h-10 w-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-black flex-shrink-0 mt-1">
                    {idx + 1}
                  </div>
                  <textarea
                    className="flex-grow bg-white px-5 py-3 rounded-2xl border-2 border-transparent focus:border-primary-500 transition-all text-gray-900 font-medium min-h-[80px]"
                    placeholder="Describe this step..."
                    value={inst}
                    onChange={(e) => handleInstructionChange(idx, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition"
                    disabled={formData.instructions.length === 1}
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Cost Summary & Suggestions */}
        <div className="space-y-10">
          <div className="bg-primary-600 text-white rounded-[3rem] p-10 shadow-2xl shadow-primary-200 sticky top-32 space-y-8">
            <h2 className="text-2xl font-black flex items-center space-x-3">
              <span className="text-2xl">₹</span>
              <span>Cost Summary</span>
            </h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center text-primary-100 font-medium">
                <span>Total Ingredients</span>
                <span className="text-white font-bold">{formData.ingredients.length}</span>
              </div>
              <div className="flex justify-between items-end border-t border-white/20 pt-6">
                <span className="text-primary-100 font-medium">Estimated Cost</span>
                <div className="text-right">
                  <span className="text-4xl font-black block">₹{formData.estimatedCost.toFixed(0)}</span>
                  <span className="text-xs text-primary-200">Auto-calculated</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6">
              <h2 className="text-2xl font-black flex items-center space-x-3 border-t border-white/20 pt-6">
                <Sparkles className="h-8 w-8" />
                <span>Cooking Tips</span>
              </h2>
              <div className="space-y-3">
                {formData.suggestions.map((sug, idx) => (
                  <div key={idx} className="flex items-center space-x-2 group">
                    <input
                      type="text"
                      className="flex-grow bg-white/10 px-4 py-3 rounded-xl border border-white/20 focus:bg-white/20 focus:border-white transition-all text-white font-medium placeholder-white/40"
                      placeholder="Add a pro tip..."
                      value={sug}
                      onChange={(e) => handleSuggestionChange(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSuggestion(idx)}
                      className="p-2 text-white/40 hover:text-white transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSuggestion}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-white/30 text-white/60 font-bold hover:border-white hover:text-white transition flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Tip</span>
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-white text-primary-600 py-6 rounded-3xl font-black text-xl hover:bg-primary-50 hover:scale-[1.05] active:scale-[0.95] transition-all shadow-2xl flex items-center justify-center space-x-3 mt-10"
            >
              {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : (
                <>
                  <Save className="h-8 w-8" />
                  <span>Publish Recipe</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecipeUpload;
