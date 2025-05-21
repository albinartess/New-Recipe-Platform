'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Recipe } from '@/types/recipe'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'

export default function EditRecipePage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRecipe = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching recipe:', error)
        return
      }

      setRecipe(data)
      setTitle(data.title)
      setDescription(data.description)
      setImageUrl(data.image_url)
    }

    fetchRecipe()
  }, [params.id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      setImageFile(file)
      setImageUrl(URL.createObjectURL(file)) // Preview the selected image
    }
  }

  const handleImageRemove = async () => {
    setLoading(true)
    const supabase = createClient()

    if (recipe?.image_url) {
      // Extract the file path from the URL
      const urlParts = recipe.image_url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `recipe_images/${fileName}`

      const { error: removeError } = await supabase.storage
        .from('recipe-images')
        .remove([filePath])

      if (removeError) {
        console.error('Error removing image:', removeError)
        setLoading(false)
        return
      }
    }

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ image_url: null })
      .eq('id', params.id)

    if (updateError) {
      console.error('Error updating recipe with null image_url:', updateError)
      setLoading(false)
      return
    }

    setImageFile(null)
    setImageUrl(null)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    let newImageUrl = imageUrl

    if (imageFile) {
      // Upload new image
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `recipe_images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, imageFile)

      if (uploadError) {
        console.error('Error uploading new image:', uploadError)
        setLoading(false)
        return
      }

      const { data } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath)
      newImageUrl = data.publicUrl

      // If there was a previous image, remove it
      if (recipe?.image_url && recipe.image_url !== imageUrl) {
         const oldUrlParts = recipe.image_url.split('/')
         const oldFileName = oldUrlParts[oldUrlParts.length - 1]
         const oldFilePath = `recipe_images/${oldFileName}`
         await supabase.storage.from('recipe-images').remove([oldFilePath])
      }
    }

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ title, description, image_url: newImageUrl })
      .eq('id', params.id)

    if (updateError) {
      console.error('Error updating recipe:', updateError)
      setLoading(false)
      return
    }

    setLoading(false)
    router.push('/recipes')
  }

  if (!recipe) {
    return <div>Загрузка...</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Редактировать Рецепт</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Название
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Описание
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium mb-2">
            Фото Блюда
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {imageUrl && (
            <div className="mt-4 relative">
              <Image src={imageUrl} alt="Recipe Image" width={200} height={200} objectFit="cover" className="rounded-lg"/>
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                disabled={loading}
              >
                X
              </button>
            </div>
          )}
        </div>
        <button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Обновить Рецепт'}
        </button>
      </form>
    </main>
  )
} 