-- Insert test recipes
INSERT INTO recipes (title, description) VALUES
    ('Classic Margherita Pizza', 'A simple and delicious pizza with tomato sauce, mozzarella, and basil'),
    ('Chocolate Chip Cookies', 'Classic homemade cookies with chocolate chips'),
    ('Chicken Stir Fry', 'Quick and healthy stir fry with chicken and vegetables'),
    ('Vegetable Soup', 'Hearty vegetable soup perfect for cold days')
ON CONFLICT (id) DO NOTHING; 