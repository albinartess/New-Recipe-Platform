# Recipe Platform

A modern web application for sharing and discovering recipes. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- Create, view, and manage recipes
- Categorize recipes with tags and categories
- Search and filter recipes
- Responsive design for all devices
- Modern and intuitive user interface

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (coming soon)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/recipe-platform.git
   cd recipe-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Recipes Table
- `id`: UUID (Primary Key)
- `title`: VARCHAR(255)
- `description`: TEXT
- `ingredients`: JSONB
- `instructions`: TEXT[]
- `cooking_time`: INTEGER
- `servings`: INTEGER
- `difficulty`: VARCHAR(20)
- `image_url`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Categories Table
- `id`: UUID (Primary Key)
- `name`: VARCHAR(100)
- `description`: TEXT

### Tags Table
- `id`: UUID (Primary Key)
- `name`: VARCHAR(50)

### Junction Tables
- `recipe_categories`: Links recipes to categories
- `recipe_tags`: Links recipes to tags

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [TypeScript](https://www.typescriptlang.org/)
