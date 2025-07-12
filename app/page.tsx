import Image from "next/image"
import Link from "next/link"
import { MapPin, MessageCircle, CheckCircle, Search } from "lucide-react"
import { GeodesicLogo } from "@/components/logo"
import { AdvancedCalculator } from "@/components/advanced-calculator"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto py-4 px-4 flex flex-col md:flex-row justify-between items-center bg-white rounded-b-lg shadow-sm">
        <div className="flex items-center">
          <div className="mr-2">
            <GeodesicLogo className="h-14 w-auto" />
          </div>
          <div className="text-3xl font-bold text-blue-500">
            ГЕО<span className="text-orange-400">Д</span>ЕЗИК
          </div>
        </div>

        <div className="text-yellow-500 font-medium mt-2 md:mt-0 text-center">
          Занимаемся выносом в натуру границ
          <br />
          земельного участка с 2005 года
        </div>

        <div className="mt-4 md:mt-0">
          <div className="flex flex-col items-end">
            <a
              href="https://wa.me/89296727849"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-white bg-green-500 hover:bg-green-600 transition-colors px-3 py-2 rounded-md"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>WhatsApp</span>
            </a>
            <div className="flex items-center mt-2">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>сейчас online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-10"></div>
            <Image
              src="/placeholder.svg?height=800&width=1600"
              alt="Геодезические работы"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="container mx-auto px-4 relative z-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">Вынос границ земельного участка</h1>
            <h2 className="text-2xl md:text-3xl text-blue-700 mb-4">в Москве и Московской области</h2>
            <h3 className="text-xl md:text-2xl mb-6">
              по фиксированной цене от <span className="text-red-600 font-bold text-3xl md:text-4xl">6000₽</span>
            </h3>

            <p className="max-w-2xl mx-auto mb-8">Рассчитайте точную стоимость работ с учетом количества точек.</p>

            <div className="flex justify-center mb-8">
              <AdvancedCalculator />
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-center mb-8">Наши услуги</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Вынос границ земельного участка", link: "/" },
                { name: "Технический план", link: "/tehnicheskiy-plan" },
                { name: "Межевание земельного участка", link: "/mezhevanie-zemelnogo-uchastka" },
                { name: "Топографическая съемка", link: "/topograficheskaya-semka" },
              ].map((service, index) => (
                <Link key={index} href={service.link}>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex flex-col items-center">
                      <CheckCircle className="text-blue-500 h-6 w-6 mb-2" />
                      <h3 className="font-medium text-center">{service.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-center mb-8">Полезные инструменты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Link href="/xml-to-dxf-converter">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-orange-200 hover:border-orange-400">
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange-500 mb-4"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14,2 14,8 20,8" />
                      <path d="M12 18v-6" />
                      <path d="m9 15 3 3 3-3" />
                    </svg>
                    <h3 className="font-bold text-lg text-center mb-2">Конвертер XML в DXF</h3>
                    <p className="text-gray-600 text-sm text-center">
                      Конвертируйте XML-файлы межевых и технических планов в формат DXF для AutoCAD
                    </p>
                    <span className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Открыть конвертер
                    </span>
                  </div>
                </div>
              </Link>

              <Link href="/poisk-uchastka">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 hover:border-blue-400">
                  <div className="flex flex-col items-center">
                    <Search className="text-blue-500 mb-4" size={48} />
                    <h3 className="font-bold text-lg text-center mb-2">Поиск земельного участка</h3>
                    <p className="text-gray-600 text-sm text-center">
                      Найдите информацию о земельном участке по кадастровому номеру через базу данных НСПД
                    </p>
                    <span className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Найти участок
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-blue-900 text-white py-8 italic">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-left">
              <h3 className="text-xl font-bold mb-4">ГЕОДЕЗИК</h3>
              <p>Кадастровые работы в Москве и Московской области с 2005 года</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Контакты</h3>
              <div className="flex items-center justify-center mb-2">
                <MessageCircle className="mr-2 h-5 w-5 text-green-400" />
                <a href="https://wa.me/89296727849" target="_blank" rel="noopener noreferrer">
                  8 (929) 672-78-49 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="mr-2 h-5 w-5" />
                <span>Москва и Московская область</span>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold mb-4">Режим работы</h3>
              <p>Пн-Пт: 9:00 - 19:00</p>
              <p>Сб-Вс: 10:00 - 18:00</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-blue-800 text-center">
            <p>© {new Date().getFullYear()} ГЕОДЕЗИК. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
