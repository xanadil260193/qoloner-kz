'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

interface Product {
  id: number
  title: string
  price: number
  image_url: string
  category: string
  master_id: number
}

const categories = ["Все", "Украшения", "Декор", "Свечи", "Выпечка", "Текстиль", "Игрушки"]
const cities = ["Все города", "Астана", "Алматы", "Шымкент", "Караганда"]

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-64">
        <img 
          src={product.image_url} 
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
          {product.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
        <p className="text-2xl font-bold text-orange-500 mb-3">
          {product.price.toLocaleString()} ₸
        </p>
        <Link 
          href={`/catalog/${product.id}`}
          className="block w-full bg-orange-500 text-white text-center py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Заказать
        </Link>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("Все")
  const [selectedCity, setSelectedCity] = useState("Все города")
  const [priceRange, setPriceRange] = useState([0, 50000])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log('🟢 Начинаем запрос к Supabase...')
        console.log('🟢 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('🟢 Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')

        // УПРОЩЁННЫЙ ЗАПРОС БЕЗ JOIN
        const { data, error } = await supabase
          .from('products')
          .select('*')

        console.log('🟢 Ответ от Supabase:', { data, error })

        if (error) {
          console.error('❌ Ошибка от Supabase:', error)
          throw error
        }

        console.log('✅ Данные получены:', data?.length, 'товаров')
        setProducts(data || [])
      } catch (err) {
        console.error('🔴 ПОЛНАЯ ОШИБКА:', err)
        console.error('🔴 Тип ошибки:', typeof err)
        console.error('🔴 JSON ошибки:', JSON.stringify(err, null, 2))
        console.error('🔴 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.error('🔴 Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'ЕСТЬ' : 'НЕТ')
        
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
          console.error('❌ SUPABASE_URL НЕ ЗАГРУЖЕН!')
        }
        if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.error('❌ SUPABASE_ANON_KEY НЕ ЗАГРУЖЕН!')
        }
        
        setError(`Не удалось загрузить товары. Ошибка: ${JSON.stringify(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === "Все" || product.category === selectedCategory
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    return categoryMatch && priceMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-orange-500">
              Qoloner
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-orange-500">Главная</Link>
              <Link href="/catalog" className="text-orange-500 font-semibold">Каталог</Link>
              <Link href="/add-product" className="text-gray-600 hover:text-orange-500">Для мастериц</Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Каталог товаров</h1>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-bold text-lg mb-4">Фильтры</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Категория</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded ${
                        selectedCategory === category 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Город</h3>
                <div className="space-y-2">
                  {cities.map(city => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`w-full text-left px-4 py-2 rounded ${
                        selectedCity === city 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Цена</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    До {priceRange[1].toLocaleString()} ₸
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <p className="text-gray-600 mb-4">
              Найдено товаров: {filteredProducts.length}
            </p>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">
                  Товары не найдены. Попробуйте изменить фильтры.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
