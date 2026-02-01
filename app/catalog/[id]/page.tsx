'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import KaspiQRModal from '../../components/KaspiQRModal'

interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  image_url: string
  master_id: number
  masters?: {
    name: string
    city: string
    telegram: string
    phone: string
  }
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  async function fetchProduct() {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          masters (
            name,
            city,
            telegram,
            phone
          )
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error

      setProduct(data)
    } catch (err) {
      console.error('Ошибка загрузки товара:', err)
      setError('Не удалось загрузить товар')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка товара...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Товар не найден'}</p>
          <Link 
            href="/catalog"
            className="text-orange-500 hover:text-orange-600 underline"
          >
            ← Вернуться в каталог
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Навигация */}
        <div className="mb-6">
          <Link 
            href="/catalog"
            className="text-orange-500 hover:text-orange-600 flex items-center gap-2"
          >
            <span>←</span> Вернуться в каталог
          </Link>
        </div>

        {/* Карточка товара */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Фото товара */}
            <div className="relative">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Нет фото
                  </div>
                )}
              </div>
              
              {/* Бейдж категории */}
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                {product.category}
              </div>
            </div>

            {/* Информация о товаре */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              <div className="text-4xl font-bold text-orange-500 mb-6">
                {product.price.toLocaleString()} ₸
              </div>

              {/* Описание */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Описание</h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'Описание отсутствует'}
                </p>
              </div>

              {/* Информация о мастерице */}
              {product.masters && (
                <div className="bg-orange-50 rounded-xl p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    О мастерице
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <p className="text-sm text-gray-600">Имя</p>
                        <p className="font-medium text-gray-900">{product.masters.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-sm text-gray-600">Город</p>
                        <p className="font-medium text-gray-900">{product.masters.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✈️</span>
                      <div>
                        <p className="text-sm text-gray-600">Telegram</p>
                        <a 
                          href={`https://t.me/${product.masters.telegram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          {product.masters.telegram}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📞</span>
                      <div>
                        <p className="text-sm text-gray-600">Телефон</p>
                        <a 
                          href={`tel:${product.masters.phone}`}
                          className="font-medium text-gray-900 hover:text-orange-500"
                        >
                          {product.masters.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Кнопки действий */}
              <div className="space-y-3 mt-auto">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  💳 Оплатить через Kaspi
                </button>

                <a
                  href={`https://t.me/${product.masters?.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  ✈️ Написать в Telegram
                </a>

                <a
                  href={`tel:${product.masters?.phone}`}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  📞 Позвонить
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Условия доставки и оплаты
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Оплата через Kaspi QR</li>
            <li>✅ Доставка по Казахстану</li>
            <li>✅ Возможен самовывоз из {product.masters?.city}</li>
            <li>✅ Связь с мастерицей через Telegram или телефон</li>
          </ul>
        </div>
      </div>

      {/* Модальное окно Kaspi QR */}
      <KaspiQRModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          master_phone: product.masters?.phone,
          master_name: product.masters?.name
        }}
      />
    </div>
  )
}
