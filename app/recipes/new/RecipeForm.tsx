'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { Category, Tag, RecipeFormData, Ingredient } from '@/types/recipe';

interface RecipeFormProps {
  categories: Category[];
  tags: Tag[];
  initialData?: RecipeFormData;
}

export default function RecipeForm({ categories, tags, initialData }: RecipeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RecipeFormData>(
    initialData || {
      title: '',
      description: '',
      ingredients: [{ name: '', amount: 0, unit: '' }],
      instructions: [''],
      cooking_time: 30,
      servings: 4,
      difficulty: 'medium',
      image_url: '',
      category_ids: [],
      tag_ids: [],
    }
  );

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', amount: 0, unit: '' }],
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ''],
    });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            ingredients: formData.ingredients,
            instructions: formData.instructions,
            cooking_time: formData.cooking_time,
            servings: formData.servings,
            difficulty: formData.difficulty,
            image_url: formData.image_url,
          },
        ])
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Insert category relationships
      if (formData.category_ids.length > 0) {
        const { error: categoryError } = await supabase
          .from('recipe_categories')
          .insert(
            formData.category_ids.map((category_id) => ({
              recipe_id: recipe.id,
              category_id,
            }))
          );

        if (categoryError) throw categoryError;
      }

      // Insert tag relationships
      if (formData.tag_ids.length > 0) {
        const { error: tagError } = await supabase
          .from('recipe_tags')
          .insert(
            formData.tag_ids.map((tag_id) => ({
              recipe_id: recipe.id,
              tag_id,
            }))
          );

        if (tagError) throw tagError;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error creating recipe:', error);
      // Handle error (show error message to user)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Ingredients</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Name"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, 'amount', parseFloat(e.target.value))}
              className="w-24 px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Unit"
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              className="w-24 px-3 py-2 border rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="px-3 py-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          + Add Ingredient
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Instructions</label>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={`Step ${index + 1}`}
              value={instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => removeInstruction(index)}
              className="px-3 py-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addInstruction}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          + Add Step
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="cooking_time" className="block text-sm font-medium mb-2">
            Cooking Time (minutes)
          </label>
          <input
            type="number"
            id="cooking_time"
            value={formData.cooking_time}
            onChange={(e) => setFormData({ ...formData, cooking_time: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="servings" className="block text-sm font-medium mb-2">
            Servings
          </label>
          <input
            type="number"
            id="servings"
            value={formData.servings}
            onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="categories" className="block text-sm font-medium mb-2">
          Categories
        </label>
        <select
          id="categories"
          multiple
          value={formData.category_ids}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
            setFormData({ ...formData, category_ids: selectedOptions });
          }}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2">
          Tags
        </label>
        <select
          id="tags"
          multiple
          value={formData.tag_ids}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
            setFormData({ ...formData, tag_ids: selectedOptions });
          }}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image_url" className="block text-sm font-medium mb-2">
          Image URL
        </label>
        <input
          type="url"
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
        }`}
      >
        {loading ? 'Saving...' : 'Create Recipe'}
      </button>
    </form>
  );
} 