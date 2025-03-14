export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">
        Binary Classifier Library
      </h1>
      <p className="text-lg mb-8">
        Welcome to the documentation and playground for the Binary Classifier library.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <a 
          href="/docs" 
          className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-bold mb-2">
            📚 Documentation
          </h2>
          <p className="text-gray-600">Comprehensive guide and API reference</p>
        </a>

        <a 
          href="/playground" 
          className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-bold mb-2">
            🎮 Playground
          </h2>
          <p className="text-gray-600">Interactive model testing environment</p>
        </a>
      </div>
    </div>
  )
}