'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../supabase';
import { Suspense } from 'react';

// Основной компонент с логикой
function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const master_id = searchParams.get('master_id');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    'Украшения',
    'Одежда',
    'Декор для дома',
    'Свечи',
    'Керамика',
    'Текстиль',
    'Аксессуары',
    'Другое',
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Валидация
      if (!formData.title || !formData.price || !formData.category) {
        setError('Заполните все обязательные поля');
        setLoading(false);
        return;
      }

      if (!imageFile) {
        setError('Загрузите фото товара');
        setLoading(false);
        return;
      }

      if (!master_id) {
        setError('ID мастерицы не найден');
        setLoading(false);
        return;
      }

      // 1. Загрузка фото в Supabase Storage
      setUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      console.log('📤 Загружаем фото:', fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('❌ Ошибка загрузки фото:', uploadError);
        throw uploadError;
      }

      console.log('✅ Фото загружено:', uploadData);

      // 2. Получение публичного URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;
      console.log('🔗 Публичный URL:', imageUrl);

      setUploading(false);

      // 3. Сохранение товара в БД
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            image_url: imageUrl,
            master_id: parseInt(master_id),
          },
        ])
        .select();

      if (productError) {
        console.error('❌ Ошибка добавления товара:', productError);
        throw productError;
      }

      console.log('✅ Товар добавлен:', productData);

      setSuccess(true);
      setTimeout(() => {
        router.push('/catalog');
      }, 2000);
    } catch (err: any) {
      console.error('❌ Ошибка:', err);
      setError(err.message || 'Произошла ошибка при добавлении товара');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Добавить товар
            </h1>
            <p className="text-gray-600">
              Заполните информацию о вашем изделии
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✅ Товар успешно добавлен! Перенаправление...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Название товара */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название товара *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Например: Серьги из натуральных камней"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Расскажите о вашем изделии..."
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
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="8500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {/* Категория */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Загрузка фото */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фото товара *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-orange-500 transition-colors cursor-pointer">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-64 w-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Удалить фото
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500">
                          <span>Нажмите для загрузки</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP до 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading
                ? 'Загрузка фото...'
                : loading
                ? 'Добавление...'
                : 'ОПУБЛИКОВАТЬ ТОВАР'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Обёрнутый в Suspense компонент (экспорт по умолчанию)
export default function AddProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-gray-600">Загрузка...</div>
    </div>}>
      <AddProductForm />
    </Suspense>
  );
}
