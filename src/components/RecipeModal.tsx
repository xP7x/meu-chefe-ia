import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  editingRecipe?: Recipe | null;
}

export function RecipeModal({ isOpen, onClose, onSave, editingRecipe }: RecipeModalProps) {
  const [name, setName] = useState('');
  const [categoryEmoji, setCategoryEmoji] = useState('🍲');
  const [imageUrl, setImageUrl] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Médio' | 'Difícil'>('Médio');
  const [ingredientsText, setIngredientsText] = useState('');
  const [instructionsText, setInstructionsText] = useState('');

  useEffect(() => {
    if (editingRecipe) {
      setName(editingRecipe.name);
      setCategoryEmoji(editingRecipe.categoryEmoji);
      setImageUrl(editingRecipe.imageUrl || '');
      setPrepTime(editingRecipe.prepTime);
      setDifficulty(editingRecipe.difficulty);
      setIngredientsText(editingRecipe.ingredients.join('\n'));
      setInstructionsText(editingRecipe.instructions.join('\n'));
    } else {
      setName('');
      setCategoryEmoji('🍲');
      setImageUrl('');
      setPrepTime('');
      setDifficulty('Médio');
      setIngredientsText('');
      setInstructionsText('');
    }
  }, [editingRecipe, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      categoryEmoji,
      imageUrl: imageUrl.trim() !== '' ? imageUrl.trim() : undefined,
      prepTime,
      difficulty,
      ingredients: ingredientsText.split('\n').filter(i => i.trim() !== ''),
      instructions: instructionsText.split('\n').filter(i => i.trim() !== ''),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center p-6 border-b border-orange-100">
            <h2 className="text-2xl font-semibold text-gray-800">
              {editingRecipe ? 'Editar Receita' : 'Nova Receita'}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
            <form id="recipe-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nome da Receita</label>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    placeholder="Ex: Bolo de Cenoura da Vó"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Emoji</label>
                  <input 
                    required
                    type="text" 
                    value={categoryEmoji}
                    onChange={(e) => setCategoryEmoji(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-center text-xl"
                    placeholder="🍰"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tempo de Preparo</label>
                  <input 
                    required
                    type="text" 
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    placeholder="Ex: 45 min"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Dificuldade</label>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Médio">Médio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
              </div>

              {editingRecipe && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">URL da Foto da Receita (Opcional)</label>
                  <input 
                    type="url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Ingredientes (um por linha)</label>
                <textarea 
                  required
                  rows={4}
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                  placeholder="3 cenouras médias&#10;4 ovos&#10;2 xícaras de açúcar"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Modo de Preparo (um passo por linha)</label>
                <textarea 
                  required
                  rows={5}
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                  placeholder="Bata as cenouras, os ovos e o óleo no liquidificador.&#10;Em uma tigela, misture o açúcar e a farinha.&#10;Junte as duas misturas e adicione o fermento."
                />
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-orange-100 bg-gray-50 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              form="recipe-form"
              className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 shadow-sm shadow-orange-500/30 transition-all active:scale-95"
            >
              Salvar Receita
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
