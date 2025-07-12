"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Script from "next/script"
import {
  ArrowLeft,
  Search,
  MapPin,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  FileText,
  Download,
  Info,
} from "lucide-react"
import { GeodesicLogo } from "@/components/logo"

interface PlotInfo {
  cadastralNumber: string
  area: string
  address: string
  category: string
  usage: string
  coordinates: Array<{ x: number; y: number }>
  owner?: string
  status: string
  objectType?: string
  dateCreated?: string
  dateUpdated?: string
}

interface SearchResponse {
  success: boolean
  source?: string
  isDemo?: boolean
  data?: PlotInfo
  error?: string
  details?: string
}

export default function PoiskUchastka() {
  const [cadastralNumber, setCadastralNumber] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<{
    success: boolean
    message: string
    plotInfo?: PlotInfo
    isDemo?: boolean
    source?: string
  } | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Инициализация карты после загрузки Leaflet
  useEffect(() => {
    if (typeof window !== "undefined" && mapLoaded && mapContainerRef.current && !mapRef.current) {
      // @ts-ignore - L comes from Leaflet loaded via CDN
      const L = window.L

      // Создаем карту
      mapRef.current = L.map(mapContainerRef.current).setView([55.7522, 37.6156], 10)

      // Добавляем базовый слой OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

      // Пробуем добавить кадастровый слой (может не работать из-за CORS)
      try {
        L.tileLayer
          .wms("https://pkk.rosreestr.ru/arcgis/services/PKK6/CadastreSelected/MapServer/WMSServer", {
            layers: "0",
            format: "image/png",
            transparent: true,
            version: "1.1.1",
            attribution: "© Росреестр",
            opacity: 0.7,
          })
          .addTo(mapRef.current)
      } catch (error) {
        console.log("Кадастровый слой недоступен")
      }
    }
  }, [mapLoaded])

  // Отображение участка на карте при получении результатов поиска
  useEffect(() => {
    if (mapRef.current && searchResult?.success && searchResult.plotInfo?.coordinates.length) {
      const L = window.L

      // Очищаем предыдущие слои с участками
      mapRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Polygon || layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer)
        }
      })

      // Преобразуем координаты в формат для Leaflet
      const coords = searchResult.plotInfo.coordinates.map((coord) => [coord.x, coord.y])

      // Создаем полигон участка
      const polygon = L.polygon(coords, {
        color: searchResult.isDemo ? "orange" : "red",
        weight: 3,
        fillColor: searchResult.isDemo ? "orange" : "red",
        fillOpacity: 0.2,
      }).addTo(mapRef.current)

      // Добавляем метку с информацией об участке
      const center = polygon.getBounds().getCenter()
      const popupContent = `
        <div style="min-width: 250px;">
          <h3 style="margin: 0 0 10px 0; color: #1976d2;">
            ${searchResult.isDemo ? "Демо-данные" : "Участок найден"}
          </h3>
          <p style="margin: 5px 0;"><strong>Кадастровый номер:</strong><br>${searchResult.plotInfo.cadastralNumber}</p>
          <p style="margin: 5px 0;"><strong>Площадь:</strong> ${searchResult.plotInfo.area}</p>
          <p style="margin: 5px 0;"><strong>Адрес:</strong><br>${searchResult.plotInfo.address}</p>
          ${searchResult.source ? `<p style="margin: 5px 0; font-size: 12px; color: #666;"><strong>Источник:</strong> ${searchResult.source}</p>` : ""}
        </div>
      `

      L.marker([center.lat, center.lng]).addTo(mapRef.current).bindPopup(popupContent).openPopup()

      // Приближаем карту к участку
      mapRef.current.fitBounds(polygon.getBounds(), { padding: [50, 50] })
    }
  }, [searchResult])

  const validateCadastralNumber = (number: string): boolean => {
    // Проверяем формат кадастрового номера: XX:XX:XXXXXXX:XX
    const cadastralRegex = /^\d{2}:\d{2}:\d{6,7}:\d{1,4}$/
    return cadastralRegex.test(number)
  }

  const handleSearch = async () => {
    if (!cadastralNumber.trim()) {
      setSearchResult({
        success: false,
        message: "Введите кадастровый номер участка",
      })
      return
    }

    if (!validateCadastralNumber(cadastralNumber)) {
      setSearchResult({
        success: false,
        message: "Неверный формат кадастрового номера. Используйте формат: XX:XX:XXXXXXX:XX",
      })
      return
    }

    setIsSearching(true)
    setSearchResult(null)

    try {
      // Обращаемся к нашему серверному API
      const response = await fetch(`/api/search-plot?cadastralNumber=${encodeURIComponent(cadastralNumber)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Ошибка сервера")
      }

      const result: SearchResponse = await response.json()

      if (result.success && result.data) {
        setSearchResult({
          success: true,
          message: result.isDemo
            ? "Участок найден (демонстрационные данные). API Росреестра временно недоступен."
            : `Участок найден через ${result.source}`,
          plotInfo: result.data,
          isDemo: result.isDemo,
          source: result.source,
        })
      } else {
        setSearchResult({
          success: false,
          message: result.error || "Участок не найден в базе данных",
        })
      }
    } catch (error) {
      console.error("Ошибка при поиске участка:", error)
      setSearchResult({
        success: false,
        message: `Ошибка при поиске участка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`,
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const formatCadastralNumber = (value: string) => {
    // Убираем все символы кроме цифр и двоеточий
    const cleaned = value.replace(/[^\d:]/g, "")

    // Автоматически добавляем двоеточия в нужных местах
    let formatted = cleaned
    if (cleaned.length >= 2 && !cleaned.includes(":")) {
      formatted = cleaned.slice(0, 2) + ":" + cleaned.slice(2)
    }
    if (cleaned.length >= 5 && cleaned.split(":").length === 2) {
      const parts = cleaned.split(":")
      formatted = parts[0] + ":" + parts[1].slice(0, 2) + ":" + parts[1].slice(2)
    }

    return formatted
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatCadastralNumber(value)
    setCadastralNumber(formatted)
  }

  const generateCoordinatesFile = (plotInfo: PlotInfo) => {
    const coordinatesText = `Кадастровый номер: ${plotInfo.cadastralNumber}
Адрес: ${plotInfo.address}
Площадь: ${plotInfo.area}
Категория земель: ${plotInfo.category}
Разрешенное использование: ${plotInfo.usage}
Статус: ${plotInfo.status}
${plotInfo.objectType ? `Тип объекта: ${plotInfo.objectType}` : ""}
${plotInfo.dateCreated ? `Дата создания: ${plotInfo.dateCreated}` : ""}

Координаты границ участка:
${plotInfo.coordinates.map((coord, index) => `Точка ${index + 1}: Широта=${coord.x.toFixed(6)}, Долгота=${coord.y.toFixed(6)}`).join("\n")}

Дата выгрузки: ${new Date().toLocaleString("ru-RU")}
Источник: ${searchResult?.source || "Неизвестно"}
${searchResult?.isDemo ? "\nВНИМАНИЕ: Это демонстрационные данные!" : ""}

Примечание: Данные получены через сервис поиска участков.
Для получения официальной выписки обратитесь в МФЦ или на портал Росреестра.`

    const blob = new Blob([coordinatesText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `coordinates_${plotInfo.cadastralNumber.replace(/:/g, "_")}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* Загружаем Leaflet из CDN */}
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        onLoad={() => setMapLoaded(true)}
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

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

        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>

            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4">Поиск земельного участка</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Найдите информацию о земельном участке по кадастровому номеру через API Росреестра
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Search className="text-blue-500 h-6 w-6 mr-2" />
                  Поиск по кадастровому номеру
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cadastral-number" className="block text-base font-medium mb-2">
                      Кадастровый номер участка
                    </label>
                    <div className="flex gap-3">
                      <input
                        id="cadastral-number"
                        type="text"
                        placeholder="50:21:0000000:123"
                        value={cadastralNumber}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={20}
                      />
                      <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className={`px-8 py-2 rounded-md text-white ${
                          isSearching ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        {isSearching ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Поиск...
                          </>
                        ) : (
                          <>
                            <Search className="inline-block mr-2 h-4 w-4" />
                            Найти
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Введите кадастровый номер в формате: XX:XX:XXXXXXX:XX</p>
                  </div>

                  {isSearching && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                        <span className="font-medium text-blue-700">Поиск в базе данных Росреестра...</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">Проверяем несколько источников данных</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Информационное сообщение о работе API */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-700">Информация о работе сервиса:</p>
                    <p className="text-amber-600 mt-1">
                      Сервис пытается получить данные из официальных источников Росреестра. При недоступности API
                      отображаются демонстрационные данные для ознакомления с функциональностью.
                    </p>
                  </div>
                </div>
              </div>

              {/* Карта для отображения участка */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <MapPin className="text-blue-500 h-6 w-6 mr-2" />
                  Карта участка
                </h2>
                <div
                  ref={mapContainerRef}
                  className="w-full h-[400px] rounded-lg border border-gray-300"
                  style={{ background: "#f0f0f0" }}
                >
                  {!mapLoaded && (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600">Загрузка карты...</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Интерактивная карта с отображением найденных участков
                </p>
              </div>

              {searchResult && (
                <div className="mb-8">
                  <div
                    className={`p-6 rounded-lg shadow-md ${
                      searchResult.success
                        ? searchResult.isDemo
                          ? "bg-orange-50 border border-orange-200"
                          : "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-start">
                      {searchResult.success ? (
                        searchResult.isDemo ? (
                          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-orange-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-green-500" />
                        )
                      ) : (
                        <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-red-500" />
                      )}
                      <div className="flex-grow">
                        <p
                          className={`font-medium ${
                            searchResult.success
                              ? searchResult.isDemo
                                ? "text-orange-700"
                                : "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {searchResult.message}
                        </p>

                        {searchResult.success && searchResult.plotInfo && (
                          <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3">Основная информация</h3>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Кадастровый номер:</span>
                                    <br />
                                    <span className="text-blue-600">{searchResult.plotInfo.cadastralNumber}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Площадь:</span>
                                    <br />
                                    <span>{searchResult.plotInfo.area}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Статус:</span>
                                    <br />
                                    <span className={searchResult.isDemo ? "text-orange-600" : "text-green-600"}>
                                      {searchResult.plotInfo.status}
                                    </span>
                                  </div>
                                  {searchResult.plotInfo.objectType && (
                                    <div>
                                      <span className="font-medium">Тип объекта:</span>
                                      <br />
                                      <span>{searchResult.plotInfo.objectType}</span>
                                    </div>
                                  )}
                                  {searchResult.source && (
                                    <div>
                                      <span className="font-medium">Источник данных:</span>
                                      <br />
                                      <span className="text-xs text-gray-500">{searchResult.source}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3">Местоположение и использование</h3>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Адрес:</span>
                                    <br />
                                    <span>{searchResult.plotInfo.address}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Категория земель:</span>
                                    <br />
                                    <span>{searchResult.plotInfo.category}</span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Разрешенное использование:</span>
                                    <br />
                                    <span>{searchResult.plotInfo.usage}</span>
                                  </div>
                                  {searchResult.plotInfo.dateCreated && (
                                    <div>
                                      <span className="font-medium">Дата создания:</span>
                                      <br />
                                      <span>{searchResult.plotInfo.dateCreated}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {searchResult.plotInfo.coordinates.length > 0 && (
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3">Координаты границ</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  {searchResult.plotInfo.coordinates.slice(0, 8).map((coord, index) => (
                                    <div key={index} className="flex justify-between">
                                      <span>Точка {index + 1}:</span>
                                      <span className="font-mono">
                                        {coord.x.toFixed(6)}, {coord.y.toFixed(6)}
                                      </span>
                                    </div>
                                  ))}
                                  {searchResult.plotInfo.coordinates.length > 8 && (
                                    <div className="col-span-2 text-center text-gray-500">
                                      ... и еще {searchResult.plotInfo.coordinates.length - 8} точек
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() => generateCoordinatesFile(searchResult.plotInfo!)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Скачать данные
                              </button>
                              <a
                                href="https://wa.me/79296727849?text=Здравствуйте! Нашел участок в вашем сервисе поиска. Хочу заказать вынос границ."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center"
                              >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Заказать вынос границ
                              </a>
                              <Link
                                href="/xml-to-dxf-converter"
                                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Конвертер XML в DXF
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">О сервисе поиска</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-green-600 mb-2">Источники данных:</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• API Росреестра (pkk.rosreestr.ru)</li>
                        <li>• Публичная кадастровая карта</li>
                        <li>• Альтернативные государственные API</li>
                        <li>• ЕГРН (при доступности)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-blue-600 mb-2">Получаемая информация:</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Площадь и границы участка</li>
                        <li>• Адрес и местоположение</li>
                        <li>• Категория земель</li>
                        <li>• Разрешенное использование</li>
                        <li>• Координаты поворотных точек</li>
                        <li>• Статус кадастрового учета</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-700">Технология поиска:</p>
                          <p className="text-blue-600">
                            Используется серверный API для обхода CORS ограничений и получения актуальных данных
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">Дополнительные услуги</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-orange-600 mb-2">После поиска участка:</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Вынос границ в натуру</li>
                        <li>• Межевание земельного участка</li>
                        <li>• Технический план здания</li>
                        <li>• Топографическая съемка</li>
                        <li>• Получение выписки из ЕГРН</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-700">Важно знать:</p>
                          <p className="text-yellow-600">
                            При недоступности официальных API отображаются демонстрационные данные. Для получения точной
                            информации обратитесь к специалисту.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-500 mb-4">Как найти кадастровый номер</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      1
                    </div>
                    <h3 className="font-semibold mb-2">Документы на участок</h3>
                    <p className="text-sm text-gray-600">
                      Кадастровый номер указан в свидетельстве о праве собственности, договоре купли-продажи или выписке
                      из ЕГРН
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      2
                    </div>
                    <h3 className="font-semibold mb-2">Публичная кадастровая карта</h3>
                    <p className="text-sm text-gray-600">
                      Найдите участок на карте Росреестра по адресу или координатам на сайте pkk.rosreestr.ru
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      3
                    </div>
                    <h3 className="font-semibold mb-2">Обратитесь к нам</h3>
                    <p className="text-sm text-gray-600">
                      Наши специалисты помогут найти кадастровый номер по адресу или координатам
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    </>
  )
}
