import React, { useState } from 'react';
import { Recipe } from '../types';
import { X, Sparkles, Loader2, ChefHat, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateRecipeWithAI } from '../services/gemini';

interface AiRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
}

export function AiRecipeModal({ isOpen, onClose, onSave }: AiRecipeModalProps) {
  const [ingredients, setIngredients] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Omit<Recipe, 'id'> | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      setError('Por favor, digite alguns ingredientes.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedRecipe(null);

    try {
      const recipe = await generateRecipeWithAI(ingredients);
      setGeneratedRecipe(recipe);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao gerar a receita. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (generatedRecipe) {
      onSave(generatedRecipe);
      setIngredients('');
      setGeneratedRecipe(null);
      onClose();
    }
  };

  const handleClose = () => {
    setIngredients('');
    setGeneratedRecipe(null);
    setError('');
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
          <div className="flex justify-between items-center p-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Gerar com IA
              </h2>
            </div>
            <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
            {!generatedRecipe ? (
              <div className="space-y-6">
                <div className="text-center space-y-2 mb-8">
                  <h3 className="text-lg font-medium text-gray-800">O que você tem na geladeira?</h3>
                  <p className="text-gray-500 text-sm">Digite os ingredientes que você tem e nosso Chef IA criará uma receita especial para você.</p>
                </div>
                
                <div className="space-y-2">
                  <textarea 
                    rows={4}
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none text-lg"
                    placeholder="Ex: frango, batata, creme de leite, queijo..."
                    disabled={isGenerating}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <div className="flex justify-center pt-4">
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 shadow-md shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Criando mágica...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Gerar Receita
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="text-4xl mb-2">{generatedRecipe.categoryEmoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800">{generatedRecipe.name}</h3>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-orange-500" />
                      <span>{generatedRecipe.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ChefHat size={16} className="text-orange-500" />
                      <span>{generatedRecipe.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-2xl p-5 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Ingredientes:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {generatedRecipe.ingredients.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Modo de Preparo:</h4>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                      {generatedRecipe.instructions.map((inst, idx) => (
                        <li key={idx} className="pl-1">{inst}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {generatedRecipe && (
            <div className="p-6 border-t border-orange-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setGeneratedRecipe(null)}
                className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors"
              >
                Tentar Outra
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 shadow-sm shadow-orange-500/30 transition-all active:scale-95"
              >
                Salvar no Catálogo
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
