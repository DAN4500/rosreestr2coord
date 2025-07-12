import Link from "next/link"
import { GeodesicLogo } from "@/components/logo"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import {
  Calculator,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  FileText,
  LandPlot,
  Building,
  Camera,
  ArrowRight,
  Search,
  CheckCircle,
} from "lucide-react"
import { GeodesistIllustration } from "@/components/geodesist-illustration"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-green-50">
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
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Точные геодезические работы
                <br />
                для вашего участка
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Вынос границ, межевание, технические планы и топографическая съемка в Москве и Московской области.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="https://wa.me/79296727849?text=Здравствуйте! Хочу заказать геодезические работы."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Заказать в WhatsApp
                </a>
                <a
                  href="tel:+79296727849"
                  className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Позвонить
                </a>
              </div>
            </div>
            <div className="mt-12">
              <GeodesistIllustration className="max-w-xl mx-auto h-auto" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Наши услуги</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <LandPlot className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle className="mb-2">Вынос границ земельного участка</CardTitle>
                <CardDescription className="mb-4">
                  Точное определение и закрепление границ вашего участка на местности.
                </CardDescription>
                <Link href="/mezhevanie-zemelnogo-uchastka" className="text-blue-600 hover:underline flex items-center">
                  Подробнее <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>

              <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Ruler className="h-12 w-12 text-green-500 mb-4" />
                <CardTitle className="mb-2">Межевание земельного участка</CardTitle>
                <CardDescription className="mb-4">
                  Комплекс работ по установлению, восстановлению и закреплению границ участка.
                </CardDescription>
                <Link href="/mezhevanie-zemelnogo-uchastka" className="text-blue-600 hover:underline flex items-center">
                  Подробнее <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>

              <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Building className="h-12 w-12 text-orange-500 mb-4" />
                <CardTitle className="mb-2">Технический план здания</CardTitle>
                <CardDescription className="mb-4">
                  Документ для постановки объекта на кадастровый учет или внесения изменений.
                </CardDescription>
                <Link href="/tehnicheskiy-plan" className="text-blue-600 hover:underline flex items-center">
                  Подробнее <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>

              <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Camera className="h-12 w-12 text-purple-500 mb-4" />
                <CardTitle className="mb-2">Топографическая съемка</CardTitle>
                <CardDescription className="mb-4">
                  Создание топографических планов для проектирования и строительства.
                </CardDescription>
                <Link href="/topograficheskaya-semka" className="text-blue-600 hover:underline flex items-center">
                  Подробнее <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>

              <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <FileText className="h-12 w-12 text-red-500 mb-4" />
                <CardTitle className="mb-2">Конвертер XML в DXF</CardTitle>
                <CardDescription className="mb-4">
                  Преобразуйте кадастровые выписки из XML в формат DXF для CAD-программ.
                </CardDescription>
                <Link href="/xml-to-dxf-converter" className="text-blue-600 hover:underline flex items-center">
                  Подробнее <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>

              <Card className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Search className="h-12 w-12 text-cyan-500 mb-4" />
                <CardTitle className="mb-2">Поиск и обработка участков</CardTitle>
                <CardDescription className="mb-4">
                  Найдите участок по кадастровому номеру или извлеките данные из XML.
                </CardDescription>
                <Link href="/poisk-uchastka" className="text-blue-600 hover:underline flex items-center">
                  Подробнее <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 md:py-20 bg-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Почему выбирают нас?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-white text-blue-700 rounded-full p-4 mb-4">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Опыт с 2005 года</h3>
                <p className="text-blue-100">Более 15 лет успешной работы в сфере кадастровых и геодезических услуг.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white text-blue-700 rounded-full p-4 mb-4">
                  <MapPin className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Работаем по всей МО</h3>
                <p className="text-blue-100">Выполняем работы в Москве и любом районе Московской области.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white text-blue-700 rounded-full p-4 mb-4">
                  <Calculator className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Прозрачные цены</h3>
                <p className="text-blue-100">
                  Честные и понятные тарифы без скрытых платежей. Рассчитайте стоимость онлайн.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Нужна консультация?</h2>
            <p className="text-lg md:text-xl mb-8">
              Свяжитесь с нами, и мы ответим на все ваши вопросы и поможем с выбором услуги.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/79296727849?text=Здравствуйте! У меня есть вопрос по геодезическим работам."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-100 transition-colors"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Написать в WhatsApp
              </a>
              <a
                href="tel:+79296727849"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-blue-600 transition-colors"
              >
                <Phone className="mr-2 h-5 w-5" />
                Позвонить
              </a>
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
