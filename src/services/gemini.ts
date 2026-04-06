import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateRecipeWithAI(ingredients: string): Promise<Omit<Recipe, 'id'>> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Crie uma receita deliciosa e criativa usando os seguintes ingredientes principais (você pode adicionar ingredientes básicos de despensa como sal, pimenta, azeite, alho, cebola, água, etc.): ${ingredients}. A receita deve ser em Português do Brasil.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Nome criativo e apetitoso da receita" },
          categoryEmoji: { type: Type.STRING, description: "Apenas um emoji que represente a categoria do prato (ex: 🍝, 🥗, 🍰, 🥩)" },
          prepTime: { type: Type.STRING, description: "Tempo de preparo estimado (ex: '30 min', '1 hora')" },
          difficulty: { type: Type.STRING, description: "Dificuldade: 'Fácil', 'Médio' ou 'Difícil'" },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Lista de ingredientes com quantidades exatas"
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Passo a passo detalhado do modo de preparo"
          }
        },
        required: ["name", "categoryEmoji", "prepTime", "difficulty", "ingredients", "instructions"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Falha ao gerar receita.");
  }

  const data = JSON.parse(response.text);
  
  // Ensure difficulty is one of the allowed values
  let difficulty = data.difficulty;
  if (!['Fácil', 'Médio', 'Difícil'].includes(difficulty)) {
    difficulty = 'Médio';
  }

  return {
    name: data.name,
    categoryEmoji: data.categoryEmoji,
    prepTime: data.prepTime,
    difficulty: difficulty as 'Fácil' | 'Médio' | 'Difícil',
    ingredients: data.ingredients,
    instructions: data.instructions,
  };
}

export async function generateRecipeImage(recipeName: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Uma foto profissional, deliciosa e muito apetitosa de um prato de comida chamado "${recipeName}". Fotografia de culinária, alta qualidade, iluminação de estúdio, foco no prato, cores vibrantes, estilo de revista de gastronomia.`,
        },
      ],
    },
  });

  if (response.candidates && response.candidates.length > 0) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
      }
    }
  }
  
  throw new Error("Não foi possível gerar a imagem.");
}

