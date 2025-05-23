export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
}

export interface Recipe {
    id: string;
    title: string;
    description: string;
    ingredients: Ingredient[];
    instructions: string[];
    cooking_time: number;
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    image_url?: string;
    created_at: string;
    updated_at: string;
    categories: Category[];
    tags: Tag[];
}

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Tag {
    id: string;
    name: string;
}

export interface RecipeFormData {
    title: string;
    description: string;
    ingredients: Ingredient[];
    instructions: string[];
    cooking_time: number;
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    image_url?: string;
    category_ids: string[];
    tag_ids: string[];
} 