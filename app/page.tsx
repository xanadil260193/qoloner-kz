import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-50">
      {/* HERO SECTION */}
      <section className="w-full flex-1 flex flex-col justify-center items-center py-20 relative">
        <div className="container max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-950 mb-6 drop-shadow-sm transition-colors duration-200">
            Уникальные изделия ручной работы от мастериц Казахстана
          </h1>
          <p className="text-lg md:text-2xl text-orange-900 mb-12 max-w-2xl">
            Украшения, декор, свечи и многое другое
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              Смотреть каталог
            </Link>
            <Link
              href="/add-product"
              className="rounded-full border-2 border-orange-500 bg-white text-orange-700 hover:bg-orange-50 hover:border-orange-700 px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              Стать мастерицей
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="w-full bg-white py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-orange-900 mb-10 text-center">
            Популярные категории
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard emoji="💎" label="Украшения" />
            <CategoryCard emoji="🏠" label="Декор для дома" />
            <CategoryCard emoji="🕯️" label="Свечи и мыло" />
            <CategoryCard emoji="🍰" label="Выпечка" />
            <CategoryCard emoji="🧵" label="Текстиль" />
            <CategoryCard emoji="🧸" label="Игрушки" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="w-full bg-orange-50 py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-orange-900 mb-10 text-center">
            Как это работает
          </h2>
          <div className="flex flex-col gap-8 md:flex-row md:gap-8 justify-center">
            <StepCard
              number={1}
              icon="1️⃣"
              title="Выберите товар"
              description="Просматривайте каталог уникальных изделий"
            />
            <StepCard
              number={2}
              icon="2️⃣"
              title="Свяжитесь с мастерицей"
              description="Обсудите детали заказа напрямую"
            />
            <StepCard
              number={3}
              icon="3️⃣"
              title="Получите изделие"
              description="Встречайтесь или используйте доставку"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-gray-800 text-white py-12 mt-12">
        <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-2xl md:text-3xl font-bold text-orange-400 tracking-tight">Qoloner</span>
          </div>
          <nav className="flex gap-8 text-lg font-medium">
            <Link href="#" className="hover:text-orange-300 transition-colors duration-200">
              О нас
            </Link>
            <Link href="#" className="hover:text-orange-300 transition-colors duration-200">
              Для мастериц
            </Link>
            <Link href="#" className="hover:text-orange-300 transition-colors duration-200">
              Контакты
            </Link>
          </nav>
          <span className="text-sm text-orange-200 text-center">
            © 2026 Qoloner.kz
          </span>
        </div>
      </footer>
    </div>
  );
}

function CategoryCard({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex flex-col items-center  justify-center bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer p-8 min-h-[150px] transition-all duration-200 transform hover:scale-105 hover:-translate-y-1 text-center">
      <span className="text-5xl mb-3">{emoji}</span>
      <span className="text-xl font-semibold text-orange-900">{label}</span>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: number;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 flex flex-col items-center text-center min-w-[220px] transition-all duration-200 transform hover:scale-105 hover:-translate-y-1">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-100 mb-5 text-3xl font-extrabold text-orange-500 shadow-inner select-none transition-all duration-150">
        {icon}
      </div>
      <div className="font-semibold text-orange-900 text-lg md:text-xl mb-2">{title}</div>
      <div className="text-orange-800 text-base">{description}</div>
    </div>
  );
}
