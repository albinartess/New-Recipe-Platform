-- Create recipes table
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients JSONB NOT NULL,
    instructions TEXT[] NOT NULL,
    cooking_time INTEGER NOT NULL, -- in minutes
    servings INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Create recipe_categories junction table
CREATE TABLE recipe_categories (
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, category_id)
);

-- Create tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Create recipe_tags junction table
CREATE TABLE recipe_tags (
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, tag_id)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for recipes table
CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial categories
INSERT INTO categories (name, description) VALUES
    ('Breakfast', 'Morning meals and brunch recipes'),
    ('Lunch', 'Midday meal recipes'),
    ('Dinner', 'Evening meal recipes'),
    ('Desserts', 'Sweet treats and desserts'),
    ('Snacks', 'Quick bites and appetizers'),
    ('Vegetarian', 'Meat-free recipes'),
    ('Vegan', 'Plant-based recipes'),
    ('Gluten-Free', 'Recipes without gluten');

-- Insert some initial tags
INSERT INTO tags (name) VALUES
    ('Quick & Easy'),
    ('Healthy'),
    ('Comfort Food'),
    ('Seasonal'),
    ('Budget-Friendly'),
    ('High Protein'),
    ('Low Carb'),
    ('Family-Friendly'); 