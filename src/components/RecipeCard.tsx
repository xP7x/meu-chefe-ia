import React, { useState } from 'react';
import { Recipe } from '../types';
import { Clock, ChefHat, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-orange-100 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden group bg-orange-50 flex items-center justify-center">
        {recipe.imageUrl ? (
          <img 
            src={recipe.imageUrl} 
            alt={recipe.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="text-7xl transition-transform duration-500 group-hover:scale-110">
            {recipe.categoryEmoji}
          </div>
        )}
        {recipe.imageUrl && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xl shadow-sm">
            {recipe.categoryEmoji}
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-orange-600 hover:bg-orange-50 hover:text-orange-700 shadow-sm transition-colors"
            title="Editar"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 shadow-sm transition-colors"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">{recipe.name}</h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-orange-500" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat size={16} className="text-orange-500" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-auto flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
        >
          {expanded ? 'Ocultar Detalhes' : 'Ver Receita'}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-orange-100 mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Ingredientes:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>

                <h4 className="font-medium text-gray-800 mb-2">Modo de Preparo:</h4>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                  {recipe.instructions.map((inst, idx) => (
                    <li key={idx} className="pl-1">{inst}</li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
