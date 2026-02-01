"use client";

import Link from "next/link";
import { useState } from "react";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Украшения",
    masterName: "",
    city: "Астана",
    telegram: "",
    phone: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Данные товара:", formData);
    setSubmitted(true);
    
    // Здесь позже будет сохранение в базу данных
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "Украшения",
        masterName: "",
        city: "Астана",
        telegram: "",
        phone: "",
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700">
            Qoloner
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/" className="text-gray-700 hover:text-orange-600">Главная</Link>
            <Link href="/catalog" className="text-gray-700 hover:text-orange-600">Каталог</Link>
            <Link href="/add-product" className="text-orange-600 font-semibold">Для мастериц</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-orange-900 mb-4">Добавить товар</h1>
        <p className="text-lg text-gray-700 mb-8">
          Заполните форму чтобы разместить своё изделие на маркетплейсе
        </p>

        {submitted && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-2xl mb-6">
            ✅ Товар успешно добавлен! Скоро он появится в каталоге.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* Название товара */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Название товара *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Например: Серьги из натуральных камней"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Описание */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Описание *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Расскажите о материалах, размерах, особенностях изделия..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Цена и Категория */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Цена (₸) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="5000"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Категория *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option>Украшения</option>
                <option>Декор для дома</option>
                <option>Свечи и мыло</option>
                <option>Выпечка и сладости</option>
                <option>Текстиль</option>
                <option>Игрушки</option>
              </select>
            </div>
          </div>

          {/* Информация о мастерице */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">О мастерице</h3>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Ваше имя *
              </label>
              <input
                type="text"
                name="masterName"
                value={formData.masterName}
                onChange={handleChange}
                required
                placeholder="Айгуль Серикова"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Город *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option>Астана</option>
                <option>Алматы</option>
                <option>Шымкент</option>
                <option>Караганда</option>
                <option>Актобе</option>
                <option>Тараз</option>
                <option>Павлодар</option>
                <option>Усть-Каменогорск</option>
                <option>Семей</option>
                <option>Атырау</option>
                <option>Костанай</option>
                <option>Кызылорда</option>
                <option>Уральск</option>
                <option>Петропавловск</option>
                <option>Актау</option>
                <option>Темиртау</option>
                <option>Туркестан</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Telegram *
                </label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  required
                  placeholder="@username"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+7 777 123 45 67"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>

          {/* Загрузка фото (пока неактивна) */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Фото товара
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-2">📸 Загрузка фото будет доступна после подключения базы данных</p>
              <p className="text-sm text-gray-400">Пока используются тестовые изображения</p>
            </div>
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg text-lg transition-colors shadow-lg"
          >
            Опубликовать товар
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            * Обязательные поля
          </p>
        </form>
      </div>
    </div>
  );
}
