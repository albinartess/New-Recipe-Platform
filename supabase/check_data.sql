-- Check if the table exists and has data
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'recipes'
) as table_exists;

-- Count the number of recipes
SELECT COUNT(*) as recipe_count FROM recipes;

-- Show all recipes
SELECT * FROM recipes ORDER BY created_at DESC; 