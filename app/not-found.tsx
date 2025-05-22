export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Страница не найдена</h2>
        <p className="text-gray-600 mb-4">
          Извините, запрашиваемая страница не существует.
        </p>
        <a
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors inline-block"
        >
          Вернуться на главную
        </a>
      </div>
    </div>
  )
} 