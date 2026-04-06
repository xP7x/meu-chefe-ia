export interface Recipe {
  id: string;
  name: string;
  categoryEmoji: string;
  imageUrl?: string;
  prepTime: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  ingredients: string[];
  instructions: string[];
}
