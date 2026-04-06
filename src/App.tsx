import React, { useState, useEffect } from 'react';
import { Recipe } from './types';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { AiRecipeModal } from './components/AiRecipeModal';
import { Search, Plus, Sparkles, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Load recipes from localStorage on mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem('meuChefIaRecipes');
    if (savedRecipes) {
      try {
        setRecipes(JSON.parse(savedRecipes));
      } catch (e) {
        console.error("Failed to parse recipes from local storage", e);
      }
    }
  }, []);

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meuChefIaRecipes', JSON.stringify(recipes));
  }, [recipes]);

  const handleSaveRecipe = (recipeData: Omit<Recipe, 'id'>) => {
    if (editingRecipe) {
      setRecipes(recipes.map(r => 
        r.id === editingRecipe.id 
          ? { ...recipeData, id: r.id } 
          : r
      ));
    } else {
      const newRecipe: Recipe = {
        ...recipeData,
        id: crypto.randomUUID(),
      };
      setRecipes([newRecipe, ...recipes]);
    }
  };

  const handleDeleteRecipe = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
      setRecipes(recipes.filter(r => r.id !== id));
    }
  };

  const openEditModal = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsRecipeModalOpen(true);
  };

  const openAddModal = () => {
    setEditingRecipe(null);
    setIsRecipeModalOpen(true);
  };

  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2.5 rounded-xl text-white shadow-sm shadow-orange-500/30">
              <ChefHat size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Meu Chef IA</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAiModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-orange-50 text-orange-600 font-medium rounded-xl hover:bg-orange-100 transition-colors border border-orange-200"
            >
              <Sparkles size={18} />
              Gerar com IA
            </button>
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 shadow-sm shadow-orange-500/30 transition-all active:scale-95"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nova Receita</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Mobile AI Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar receitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all shadow-sm outline-none"
            />
          </div>
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 px-5 py-3.5 bg-orange-50 text-orange-600 font-medium rounded-2xl hover:bg-orange-100 transition-colors border border-orange-200"
          >
            <Sparkles size={20} />
            Gerar com IA
          </button>
        </div>

        {/* Recipe Grid */}
        {recipes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center px-4"
          >
            <div className="text-7xl mb-6">🍳</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Nenhuma receita ainda</h2>
            <p className="text-gray-500 max-w-md mb-8">
              Sua cozinha está vazia! Adicione uma receita manualmente ou deixe nosso Chef IA criar algo incrível com o que você tem na geladeira.
            </p>
            <button 
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-2 px-8 py-3.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 shadow-md shadow-orange-500/30 transition-all active:scale-95"
            >
              <Sparkles size={20} />
              Criar minha primeira receita
            </button>
          </motion.div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-800">Nenhuma receita encontrada</h3>
            <p className="text-gray-500 mt-2">Tente buscar por outro nome.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onEdit={openEditModal}
                  onDelete={handleDeleteRecipe}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <RecipeModal 
        isOpen={isRecipeModalOpen} 
        onClose={() => setIsRecipeModalOpen(false)} 
        onSave={handleSaveRecipe}
        editingRecipe={editingRecipe}
      />
      
      <AiRecipeModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        onSave={handleSaveRecipe}
      />
    </div>
  );
}
