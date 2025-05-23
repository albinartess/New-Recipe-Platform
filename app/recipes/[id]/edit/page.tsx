'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Recipe, RecipeFormData } from '@/types/recipe'
import RecipeForm from '../../new/RecipeForm'

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          categories:recipe_categories(category:categories(*)),
          tags:recipe_tags(tag:tags(*))
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching recipe:', error)
        router.push('/')
        return
      }

      if (data) {
        const formattedRecipe = {
          ...data,
          categories: data.categories.map((c: any) => c.category),
          tags: data.tags.map((t: any) => t.tag),
        }
        setRecipe(formattedRecipe)
      }
      setLoading(false)
    }

    fetchRecipe()
  }, [params.id, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!recipe) {
    return <div>Recipe not found</div>
  }

  const initialData: RecipeFormData = {
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    cooking_time: recipe.cooking_time,
    servings: recipe.servings,
    difficulty: recipe.difficulty,
    image_url: recipe.image_url || '',
    category_ids: recipe.categories.map((c) => c.id),
    tag_ids: recipe.tags.map((t) => t.id),
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Recipe</h1>
      <RecipeForm
        categories={recipe.categories}
        tags={recipe.tags}
        initialData={initialData}
      />
    </main>
  )
} 