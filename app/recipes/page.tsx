import { createClient } from '@/lib/supabase'
import { Recipe } from '@/types/recipe'

export default async function RecipesPage() {
  const supabase = createClient()
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching recipes:', error)
    return <div>Error loading recipes</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes?.map((recipe: Recipe) => (
          <div key={recipe.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">{recipe.title}</h2>
            <p className="text-gray-600 mb-4">{recipe.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {new Date(recipe.created_at).toLocaleDateString()}
              </span>
              <a
                href={`/recipes/${recipe.id}/edit`}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
} 