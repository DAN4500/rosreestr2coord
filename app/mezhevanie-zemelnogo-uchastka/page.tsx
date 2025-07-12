import Link from "next/link"
import { ArrowLeft, MapPin, MessageCircle, CheckCircle, Clock, FileText, Map, AlertTriangle } from "lucide-react"
import { GeodesicLogo } from "@/components/logo"
import { LandSurveyIllustration } from "@/components/land-survey-illustration"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Межевание земельного участка - ГЕОДЕЗИК",
  description:
    "Профессиональное межевание земельных участков в Москве и Московской области. Установление границ, оформление документов, постановка на кадастровый учет.",
}

export default function MezhevanieZemelnogoUchastka() {
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
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4">Межевание земельного участка</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Профессиональное установление и закрепление границ земельного участка с внесением данных в ЕГРН
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-3xl font-bold text-blue-500 mb-6">Что такое межевание?</h2>
                <p className="text-gray-700 mb-4">
                  Межевание земельного участка — это комплекс работ по установлению и закреплению границ земельного
                  участка, определению его площади и местоположения. Результатом межевания является межевой план,
                  необходимый для постановки участка на кадастровый учет и регистрации права собственности.
                </p>
                <p className="text-gray-700 mb-6">
                  Наши кадастровые инженеры имеют многолетний опыт проведения межевания участков любой сложности в
                  Москве и Московской области.
                </p>

                <h3 className="text-2xl font-bold text-blue-500 mb-4">Для чего нужно межевание:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    Оформление права собственности на земельный участок
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    Купля-продажа, дарение или наследование участка
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    Разрешение споров с соседями о границах
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    Раздел или объединение земельных участков
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    Получение разрешения на строительство
                  </li>
                </ul>
              </div>

              <div className="relative">
                <LandSurveyIllustration className="w-full h-auto rounded-lg shadow-lg" />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">Этапы межевания земельного участка</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                      1
                    </div>
                    <h3 className="text-xl font-bold">Подготовительный этап</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="text-green-500 h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      Сбор и анализ документов
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-green-500 h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      Получение выписки из ЕГРН
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-green-500 h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      Согласование даты выезда инженера
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                      2
                    </div>
                    <h3 className="text-xl font-bold">Полевые работы</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="text-green-500 h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      Выезд кадастрового инженера
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-green-500 h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      Определение координат границ
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-green-500 h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      Согласование границ с соседями
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                      3
                    </div>
                    <h3 className="text-xl font-bold">Оформление документов</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="text-green-500 h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      Подготовка межевого плана
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-green-500 h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      Подача документов в Росреестр
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-green-500 h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      Получение выписки с новыми границами
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Map className="text-blue-500 h-6 w-6 mr-2" />
                    Точное определение границ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Используем современное геодезическое оборудование для точного определения координат границ участка
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="text-blue-500 h-6 w-6 mr-2" />
                    Оперативное выполнение
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Выполняем межевание в кратчайшие сроки — от 10 рабочих дней</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="text-blue-500 h-6 w-6 mr-2" />
                    Юридическая поддержка
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Оказываем полное юридическое сопровождение при согласовании границ и регистрации в Росреестре
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-10">Стоимость межевания земельного участка</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md text-center border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-blue-500 mb-2">Стандартный участок</h3>
                  <p className="text-3xl font-bold text-red-600 mb-4">от 10 000₽</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• До 10 соток</li>
                    <li>• Простая конфигурация</li>
                    <li>• Срок: 10-14 дней</li>
                  </ul>
                  <a
                    href="https://wa.me/79296727849?text=Здравствуйте! Хочу заказать межевание стандартного участка (до 10 соток) от 10 000₽"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors inline-block text-center"
                  >
                    Заказать
                  </a>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md text-center border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-600 mb-2">Сложный участок</h3>
                  <p className="text-3xl font-bold text-red-600 mb-4">от 15 000₽</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• До 20 соток</li>
                    <li>• Сложная конфигурация</li>
                    <li>• Срок: 14-20 дней</li>
                  </ul>
                  <a
                    href="https://wa.me/79296727849?text=Здравствуйте! Хочу заказать межевание сложного участка (до 20 соток) от 15 000₽"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors inline-block text-center"
                  >
                    Заказать
                  </a>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md text-center border-2 border-orange-200">
                  <h3 className="text-xl font-bold text-orange-600 mb-2">Большой участок</h3>
                  <p className="text-3xl font-bold text-red-600 mb-4">от 20 000₽</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Свыше 20 соток</li>
                    <li>• Любая конфигурация</li>
                    <li>• Срок: от 20 дней</li>
                  </ul>
                  <a
                    href="https://wa.me/79296727849?text=Здравствуйте! Хочу заказать межевание большого участка (свыше 20 соток) от 20 000₽"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors inline-block text-center"
                  >
                    Заказать
                  </a>
                </div>
              </div>
              <p className="text-center text-gray-600 mt-6">
                * Стоимость может изменяться в зависимости от сложности работ и удаленности участка
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-md mb-12">
              <div className="flex">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-yellow-700 mb-2">Важно знать!</h3>
                  <p className="text-gray-700">
                    С 1 января 2018 года вступил в силу закон, запрещающий распоряжаться земельными участками, границы
                    которых не установлены в соответствии с законодательством. Это значит, что без межевания вы не
                    сможете продать, подарить или передать по наследству свой земельный участок.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-500 mb-6">Готовы заказать межевание?</h2>
              <p className="text-xl text-gray-600 mb-8">Свяжитесь с нами для консультации и расчета стоимости</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/89296727849"
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
