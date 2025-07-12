import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, FileText, Calculator, Search, Upload, Zap } from "lucide-react"
import Link from "next/link"
import { GeodesistIllustration } from "@/components/geodesist-illustration"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-3xl font-bold text-blue-600">
            <MapPin className="h-8 w-8" />
            кадастровик.рф
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Кадастровые услуги
            <span className="text-blue-600"> онлайн</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Профессиональные геодезические услуги, калькуляторы стоимости и поиск участков. Быстро, удобно, надежно.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/poisk-uchastka">
              <Button size="lg" className="w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Найти участок
              </Button>
            </Link>
            <Link href="/tehnicheskiy-plan">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Calculator className="mr-2 h-5 w-5" />
                Рассчитать стоимость
              </Button>
            </Link>
          </div>

          {/* Illustration */}
          <div className="max-w-2xl mx-auto">
            <GeodesistIllustration />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Наши услуги</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Technical Plan */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Технический план
              </CardTitle>
              <CardDescription>Изготовление технических планов для постановки на кадастровый учет</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  • Жилые дома и постройки
                  <br />• Нежилые здания
                  <br />• Помещения и сооружения
                </div>
                <div className="text-lg font-semibold text-green-600">от 15 000 ₽</div>
                <Link href="/tehnicheskiy-plan">
                  <Button className="w-full">Рассчитать стоимость</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Land Survey */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Топографическая съемка
              </CardTitle>
              <CardDescription>Топосъемка участков для проектирования и строительства</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  • Масштаб 1:500
                  <br />• Высотная привязка
                  <br />• Подземные коммуникации
                </div>
                <div className="text-lg font-semibold text-green-600">от 300 ₽/сотка</div>
                <Link href="/topograficheskaya-semka">
                  <Button className="w-full">Рассчитать стоимость</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Land Surveying */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" />
                Межевание участка
              </CardTitle>
              <CardDescription>Межевание земельных участков и установление границ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  • Установление границ
                  <br />• Межевой план
                  <br />• Согласование с соседями
                </div>
                <div className="text-lg font-semibold text-green-600">от 15 000 ₽</div>
                <Link href="/mezhevanie-zemelnogo-uchastka">
                  <Button className="w-full">Рассчитать стоимость</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Plot Search */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-orange-600" />
                Поиск участков
              </CardTitle>
              <CardDescription>Поиск информации о земельных участках по кадастровому номеру</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  • Кадастровая стоимость
                  <br />• Площадь и координаты
                  <br />• Правообладатель
                </div>
                <div className="text-lg font-semibold text-green-600">Бесплатно</div>
                <Link href="/poisk-uchastka">
                  <Button className="w-full">Найти участок</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* XML to DXF Converter */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-red-600" />
                Конвертер XML в DXF
              </CardTitle>
              <CardDescription>Конвертация XML файлов Росреестра в формат DXF для AutoCAD</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  • Быстрая конвертация
                  <br />• Сохранение координат
                  <br />• Готово для AutoCAD
                </div>
                <div className="text-lg font-semibold text-green-600">Бесплатно</div>
                <Link href="/xml-to-dxf-converter">
                  <Button className="w-full">Конвертировать</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Coordinate Processor */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-indigo-600" />
                Обработка координат
              </CardTitle>
              <CardDescription>Извлечение и конвертация координат из XML файлов Росреестра</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  • Извлечение координат
                  <br />• Конвертация в WGS84
                  <br />• Экспорт в разные форматы
                </div>
                <div className="text-lg font-semibold text-green-600">Бесплатно</div>
                <Link href="/coordinate-processor">
                  <Button className="w-full">Обработать координаты</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Почему выбирают нас</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстро</h3>
              <p className="text-gray-600">Мгновенные расчеты стоимости и быстрое выполнение работ</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Профессионально</h3>
              <p className="text-gray-600">Лицензированные специалисты с многолетним опытом</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Удобно</h3>
              <p className="text-gray-600">Онлайн калькуляторы и инструменты для самостоятельной работы</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Остались вопросы?</h2>
          <p className="text-xl text-gray-600 mb-8">Свяжитесь с нами для консультации по любым кадастровым вопросам</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/+79999999999?text=Здравствуйте! Хочу получить консультацию по кадастровым услугам"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                Написать в WhatsApp
              </Button>
            </a>
            <a href="tel:+79999999999">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Позвонить
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xl font-bold mb-4">
            <MapPin className="h-6 w-6" />
            кадастровик.рф
          </div>
          <p className="text-gray-400">© 2024 Кадастровые услуги. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}
