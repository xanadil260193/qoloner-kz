'use client'

import { useState } from 'react'

interface KaspiQRModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    title: string
    price: number
    master_phone?: string
    master_name?: string
  }
}

export default function KaspiQRModal({ isOpen, onClose, product }: KaspiQRModalProps) {
  const [copied, setCopied] = useState(false)

  function copyPhone() {
    const phone = product.master_phone || ''
    navigator.clipboard.writeText(phone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyAmount() {
    navigator.clipboard.writeText(product.price.toString())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">💳 Оплата через Kaspi</h2>
              <p className="text-orange-100 text-sm">Переведите деньги мастерице</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-100 text-3xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Содержимое */}
        <div className="p-6">
          {/* Информация о товаре */}
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {product.price.toLocaleString()} ₸
            </div>
            {product.master_name && (
              <p className="text-sm text-gray-600">
                Мастерица: {product.master_name}
              </p>
            )}
          </div>

          {/* Номер телефона - БОЛЬШОЙ */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 mb-6 text-center">
            <p className="text-white text-sm mb-2">Номер для перевода:</p>
            <p className="text-white text-3xl font-bold mb-4 font-mono tracking-wide">
              {product.master_phone}
            </p>
            <button
              onClick={copyPhone}
              className={`${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-orange-500 hover:bg-orange-50'
              } px-6 py-3 rounded-lg font-semibold transition-all w-full shadow-lg`}
            >
              {copied ? '✅ Скопировано!' : '📋 Копировать номер'}
            </button>
          </div>

          {/* Сумма для копирования */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Сумма перевода:</p>
              <p className="text-2xl font-bold text-gray-900">
                {product.price.toLocaleString()} ₸
              </p>
            </div>
            <button
              onClick={copyAmount}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Копировать
            </button>
          </div>

          {/* Инструкция */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-3">📱 Как оплатить:</h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-orange-500 flex-shrink-0">1.</span>
                <span>Нажмите <strong>"Копировать номер"</strong> выше</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-500 flex-shrink-0">2.</span>
                <span>Нажмите кнопку <strong>"Открыть Kaspi"</strong> ниже</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-500 flex-shrink-0">3.</span>
                <span>Переводы → <strong>На карту или телефон</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-500 flex-shrink-0">4.</span>
                <span>Вставьте номер и введите сумму <strong>{product.price.toLocaleString()} ₸</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-orange-500 flex-shrink-0">5.</span>
                <span>В комментарии: <em>"Заказ: {product.title}"</em></span>
              </li>
            </ol>
          </div>

          {/* Кнопка открыть Kaspi */}
          <a
            href="kaspi://app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-3"
          >
            <span className="text-xl">🚀</span>
            <span>Открыть Kaspi</span>
          </a>

          {/* Альтернатива */}
          <p className="text-center text-sm text-gray-500 mb-3">
            Или переведите вручную через приложение Kaspi
          </p>

          {/* Кнопка закрыть */}
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}
