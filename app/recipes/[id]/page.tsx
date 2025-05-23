import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Recipe } from '@/types/recipe';

async function getRecipe(id: string): Promise<Recipe | null> {
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select(`
      *,
      categories:recipe_categories(category:categories(*)),
      tags:recipe_tags(tag:tags(*))
    `)
    .eq('id', id)
    .single();

  if (error || !recipe) {
    return null;
  }

  return {
    ...recipe,
    categories: recipe.categories.map((c: any) => c.category),
    tags: recipe.tags.map((t: any) => t.tag),
  };
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {recipe.image_url && (
          <div className="relative h-96 w-full mb-8">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{recipe.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Cooking Time:</span> {recipe.cooking_time} minutes
            </div>
            <div>
              <span className="font-medium">Servings:</span> {recipe.servings}
            </div>
            <div>
              <span className="font-medium">Difficulty:</span>{' '}
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {recipe.categories.map((category) => (
              <span
                key={category.id}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {category.name}
              </span>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-gray-600">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                  <span>{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </article>
    </main>
  );
} 