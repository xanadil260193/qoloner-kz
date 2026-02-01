'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AddProduct() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const masterId = searchParams.get('master_id')

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: null as File | null
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const categories = [
    'Одежда',
    'Аксессуары',
    'Украшения',
    'Сумки',
    'Игрушки',
    'Декор',
    'Посуда',
    'Другое'
  ]

  useEffect(() => {
    if (!masterId) {
      setError('Не указан ID мастерицы')
    }
  }, [masterId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      
      // Превью
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      
      // Генерируем уникальное имя файла
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      console.log('📤 Загружаем фото:', filePath)

      // Загружаем в Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('❌ Ошибка загрузки:', uploadError)
        throw uploadError
      }

      console.log('✅ Фото загружено:', data)

      // Получаем публичный URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      console.log('🔗 Публичный URL:', urlData.publicUrl)

      return urlData.publicUrl

    } catch (err: any) {
      console.error('❌ Ошибка загрузки изображения:', err)
      setError(`Не удалось загрузить фото: ${err.message}`)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Валидация
    if (!formData.title.trim()) {
      setError('Введите название товара')
      setLoading(false)
      return
    }

    if (!formData.description.trim()) {
      setError('Введите описание')
      setLoading(false)
      return
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError('Укажите корректную цену')
      setLoading(false)
      return
    }

    if (!formData.category) {
      setError('Выберите категорию')
      setLoading(false)
      return
    }

    if (!formData.image) {
      setError('Загрузите фото товара')
      setLoading(false)
      return
    }

    try {
      // 1. Загружаем фото
      const imageUrl = await uploadImage(formData.image)
      if (!imageUrl) {
        setLoading(false)
        return
      }

      // 2. Создаём товар
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            price: Number(formData.price),
            category: formData.category,
            image_url: imageUrl,
            master_id: Number(masterId)
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError

      console.log('✅ Товар добавлен:', data)

      setSuccess(true)

      // Переходим в каталог через 2 секунды
      setTimeout(() => {
        router.push('/catalog')
      }, 2000)

    } catch (err: any) {
      console.error('❌ Ошибка добавления товара:', err)
      setError(err.message || 'Не удалось добавить товар')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Товар успешно добавлен!
          </h2>
          <p className="text-gray-600 mb-4">
            Ваш товар появится в каталоге
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Шапка */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-4xl">🧵</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Добавить товар
          </h1>
          <p className="text-gray-600">
            Заполните информацию о вашем изделии
          </p>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Название */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название товара *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Например: Серьги из натуральных камней"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Опишите ваше изделие: материалы, размеры, особенности..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Цена */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена (тенге) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="8500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Категория */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Фото */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фото товара *
              </label>
              
              {imagePreview ? (
                <div className="mb-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, image: null })
                      setImagePreview(null)
                    }}
                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                  >
                    Удалить фото
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="text-5xl mb-3">📸</span>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Нажмите для загрузки</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WebP (макс. 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Ошибка */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Кнопка */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Загрузка фото...' : loading ? 'Добавление...' : 'Опубликовать товар'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
