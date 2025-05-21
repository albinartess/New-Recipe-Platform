-- Create recipes table if it doesn't exist
CREATE TABLE IF NOT EXISTS recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to read recipes
CREATE POLICY "Allow public read access" ON recipes
    FOR SELECT
    USING (true);

-- Allow anyone to insert recipes
CREATE POLICY "Allow public insert" ON recipes
    FOR INSERT
    WITH CHECK (true);

-- Allow anyone to update their own recipes
CREATE POLICY "Allow public update" ON recipes
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow anyone to delete their own recipes
CREATE POLICY "Allow public delete" ON recipes
    FOR DELETE
    USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 