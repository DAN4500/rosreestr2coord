import Link from "next/link"
import { ArrowLeft, MapPin, MessageCircle, CheckCircle, Clock, FileText, Camera } from "lucide-react"
import { GeodesicLogo } from "@/components/logo"
import { GeodesistIllustration } from "@/components/geodesist-illustration"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Топографическая съемка - ГЕОДЕЗИК",
  description:
    "Топографическая съемка участков в Москве и Московской области. Профессиональные геодезические работы с 2005 года.",
}

export default function TopograficheskayaSemka() {
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
              href="https://wa.me/79296727849"
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
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4">Топографическая съемка</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Профессиональная топографическая съемка участков в Москве и Московской области
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-3xl font-bold text-blue-500 mb-6">Что такое топографическая съемка?</h2>
                <p className="text-gray-700 mb-4">
                  Топографическая съемка — это комплекс геодезических работ по определению планового и высотного
                  положения характерных точек местности для создания топографических планов и карт.
                </p>
                <p className="text-gray-700 mb-6">
                  Наши специалисты выполняют топосъемку с использованием современного геодезического оборудования, что
                  гарантирует высокую точность и качество результатов.
                </p>

                <h3 className="text-2xl font-bold text-blue-500 mb-4">Для чего нужна топосъемка:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    Проектирование зданий и сооружений
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    Планировка территории
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    Получение разрешений на строительство
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    Ландшафтное проектирование
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    Инженерные изыскания
                  </li>
                </ul>
              </div>

              <div className="relative">
                <GeodesistIllustration className="w-full h-auto rounded-lg shadow-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="text-blue-500 h-6 w-6 mr-2" />
                    Современное оборудование
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Используем новейшие тахеометры и GPS-приемники для максимальной точности измерений
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="text-blue-500 h-6 w-6 mr-2" />
                    Быстрые сроки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Выполняем топографическую съемку в сжатые сроки без потери качества</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="text-blue-500 h-6 w-6 mr-2" />
                    Полный пакет документов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Предоставляем топографический план в цифровом и печатном виде</p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-10">Стоимость топографической съемки участка</h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="w-64 h-64 rounded-full bg-green-600 flex flex-col items-center justify-center text-white p-4">
                  <div className="text-2xl font-bold mb-1">До 10 соток</div>
                  <div className="text-3xl font-bold mb-4">12 000 ₽</div>
                  <a
                    href="https://wa.me/79296727849?text=Здравствуйте! Хочу заказать топографическую съемку участка до 10 соток за 12 000 ₽"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-green-600 hover:bg-gray-100 px-6 py-2 rounded-full font-medium"
                  >
                    Заказать
                  </a>
                </div>

                <div className="w-64 h-64 rounded-full bg-green-600 flex flex-col items-center justify-center text-white p-4">
                  <div className="text-2xl font-bold mb-1">До 15 соток</div>
                  <div className="text-3xl font-bold mb-4">14 000 ₽</div>
                  <a
                    href="https://wa.me/79296727849?text=Здравствуйте! Хочу заказать топографическую съемку участка до 15 соток за 14 000 ₽"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-green-600 hover:bg-gray-100 px-6 py-2 rounded-full font-medium"
                  >
                    Заказать
                  </a>
                </div>

                <div className="w-64 h-64 rounded-full bg-green-600 flex flex-col items-center justify-center text-white p-4">
                  <div className="text-2xl font-bold mb-1">Более 30 соток</div>
                  <div className="text-3xl font-bold mb-4">Цена договорная</div>
                  <a
                    href="https://wa.me/79296727849?text=Здравствуйте! Хочу заказать топографическую съемку участка более 30 соток. Прошу рассчитать стоимость"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-green-600 hover:bg-gray-100 px-6 py-2 rounded-full font-medium"
                  >
                    Заказать
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-500 mb-6">Готовы заказать топографическую съемку?</h2>
              <p className="text-xl text-gray-600 mb-8">Свяжитесь с нами для консультации и расчета стоимости</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/79296727849"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-white bg-green-500 hover:bg-green-600 transition-colors px-6 py-3 rounded-md text-lg"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Написать в WhatsApp
                </a>
                <a
                  href="mailto:topo500@mail.ru"
                  className="inline-flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 transition-colors px-6 py-3 rounded-md text-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Отправить email
                </a>
              </div>
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
                <a href="https://wa.me/79296727849" target="_blank" rel="noopener noreferrer">
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
