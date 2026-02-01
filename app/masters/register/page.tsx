'use client'

import { useState } from 'react'
import { supabase } from '@/app/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MasterRegister() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    telegram: '',
    phone: ''
  })

  const cities = [
    'Астана', 'Алматы', 'Шымкент', 'Караганда', 'Актобе', 'Тараз',
    'Павлодар', 'Усть-Каменогорск', 'Семей', 'Атырау', 'Костанай',
    'Кызылорда', 'Уральск', 'Петропавловск', 'Актау', 'Темиртау', 'Туркестан'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Валидация
    if (!formData.name.trim()) {
      setError('Введите ваше имя')
      setLoading(false)
      return
    }

    if (!formData.city) {
      setError('Выберите город')
      setLoading(false)
      return
    }

    if (!formData.telegram.startsWith('@')) {
      setError('Telegram должен начинаться с @')
      setLoading(false)
      return
    }

    const phoneDigits = formData.phone.replace(/\D/g, '')
    if (phoneDigits.length < 11) {
      setError('Введите корректный номер телефона')
      setLoading(false)
      return
    }

    try {
      // Проверяем, существует ли мастерица с таким Telegram
      const { data: existingMaster } = await supabase
        .from('masters')
        .select('id')
        .eq('telegram', formData.telegram)
        .single()

      if (existingMaster) {
        setError('Мастерица с таким Telegram уже зарегистрирована')
        setLoading(false)
        return
      }

      // Создаём мастерицу
      const { data, error: insertError } = await supabase
        .from('masters')
        .insert([
          {
            name: formData.name,
            city: formData.city,
            telegram: formData.telegram,
            phone: formData.phone
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError

      console.log('✅ Мастерица зарегистрирована:', data)

      setSuccess(true)

      // Переходим на страницу добавления товара через 2 секунды
      setTimeout(() => {
        router.push(`/masters/add-product?master_id=${data.id}`)
      }, 2000)

    } catch (err: any) {
      console.error('❌ Ошибка регистрации:', err)
      setError(err.message || 'Не удалось зарегистрироваться')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Регистрация успешна!
          </h2>
          <p className="text-gray-600 mb-4">
            Сейчас вы будете перенаправлены на страницу добавления товара
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
            Регистрация мастерицы
          </h1>
          <p className="text-gray-600">
            Зарегистрируйтесь, чтобы начать продавать свои изделия
          </p>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Имя */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ваше имя *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Айгуль Серикова"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Город */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Город *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Выберите город</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Telegram */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telegram *
              </label>
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                placeholder="@ваш_telegram"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Через Telegram покупатели смогут связаться с вами
              </p>
            </div>

            {/* Телефон */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон (для Kaspi переводов) *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 777 123-45-67"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                На этот номер покупатели будут переводить деньги через Kaspi
              </p>
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
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          {/* Уже зарегистрированы */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Уже зарегистрированы?{' '}
              <Link href="/masters/login" className="text-orange-500 hover:text-orange-600 font-medium">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
