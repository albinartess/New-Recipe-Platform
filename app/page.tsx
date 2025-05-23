import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Recipe, Category, Tag } from '@/types/recipe';
import SearchBar from './components/SearchBar';

async function getCategories(): Promise<Category[]> {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories;
}

async function getTags(): Promise<Tag[]> {
  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  return tags;
}

async function getRecipes(searchParams: { [key: string]: string | string[] | undefined }): Promise<Recipe[]> {
  let query = supabase
    .from('recipes')
    .select(`
      *,
      categories:recipe_categories(category:categories(*)),
      tags:recipe_tags(tag:tags(*))
    `);

  // Apply search filters
  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`);
  }

  if (searchParams.difficulty) {
    query = query.eq('difficulty', searchParams.difficulty);
  }

  if (searchParams.categories) {
    const categoryIds = Array.isArray(searchParams.categories)
      ? searchParams.categories
      : searchParams.categories.split(',');
    query = query.contains('categories', categoryIds);
  }

  if (searchParams.tags) {
    const tagIds = Array.isArray(searchParams.tags)
      ? searchParams.tags
      : searchParams.tags.split(',');
    query = query.contains('tags', tagIds);
  }

  const { data: recipes, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  return recipes.map(recipe => ({
    ...recipe,
    categories: recipe.categories.map((c: any) => c.category),
    tags: recipe.tags.map((t: any) => t.tag)
  }));
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [recipes, categories, tags] = await Promise.all([
    getRecipes(searchParams),
    getCategories(),
    getTags(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recipe Collection</h1>
        <Link
          href="/recipes/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add New Recipe
        </Link>
      </div>

      <SearchBar categories={categories} tags={tags} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            {recipe.image_url && (
              <div className="relative h-48 w-full">
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
              <div className="flex flex-wrap gap-2">
                {recipe.categories.map((category) => (
                  <span
                    key={category.id}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>{recipe.cooking_time} mins</span>
                <span>{recipe.servings} servings</span>
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
} 