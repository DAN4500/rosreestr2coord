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
  Upload,
  Copy,
} from "lucide-react"
import { GeodesicLogo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

interface CoordinatePoint {
  x: number
  y: number
  wgs84_lat?: number
  wgs84_lon?: number
}

interface XmlParsedData {
  cadastralNumber: string
  area: number
  coordinates: CoordinatePoint[]
  coordinateSystem: string
  zone?: string
}

export default function PoiskUchastka() {
  // State for Cadastral Number Search
  const [cadastralNumber, setCadastralNumber] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<{
    success: boolean
    message: string
    plotInfo?: PlotInfo
    isDemo?: boolean
    source?: string
  } | null>(null)

  // State for XML Processing
  const [xmlFile, setXmlFile] = useState<File | null>(null)
  const [xmlParsedData, setXmlParsedData] = useState<XmlParsedData | null>(null)
  const [isProcessingXml, setIsProcessingXml] = useState(false)
  const [xmlError, setXmlError] = useState<string | null>(null)
  const xmlFileInputRef = useRef<HTMLInputElement>(null)

  // State for Map
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window !== "undefined" && mapLoaded && mapContainerRef.current && !mapRef.current) {
      // @ts-ignore - L comes from Leaflet loaded via CDN
      const L = window.L

      mapRef.current = L.map(mapContainerRef.current).setView([55.7522, 37.6156], 10)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

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

  // Display plot on map when searchResult or xmlParsedData changes
  useEffect(() => {
    if (mapRef.current) {
      const L = window.L

      mapRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Polygon || layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer)
        }
      })

      let coordsToDisplay: Array<{ x: number; y: number }> = []
      let plotInfoForMap: PlotInfo | null = null
      let isDemoData = false
      let sourceInfo = ""

      if (searchResult?.success && searchResult.plotInfo?.coordinates.length) {
        coordsToDisplay = searchResult.plotInfo.coordinates
        plotInfoForMap = searchResult.plotInfo
        isDemoData = searchResult.isDemo || false
        sourceInfo = searchResult.source || ""
      } else if (xmlParsedData?.coordinates.length) {
        // Use WGS84 coordinates from XML parsing for map display
        coordsToDisplay = xmlParsedData.coordinates.map((c) => ({
          x: c.wgs84_lat || c.x,
          y: c.wgs84_lon || c.y,
        }))
        plotInfoForMap = {
          cadastralNumber: xmlParsedData.cadastralNumber,
          area: `${xmlParsedData.area} м²`,
          address: "Из XML файла",
          category: "Из XML файла",
          usage: "Из XML файла",
          coordinates: coordsToDisplay,
          status: "Из XML файла",
          objectType: "Земельный участок",
        }
        isDemoData = false // XML parsing is not demo data
        sourceInfo = "XML файл"
      }

      if (coordsToDisplay.length && plotInfoForMap) {
        // For XML data, ensure coordinates are in [lat, lon] format for Leaflet
        const leafletCoords = coordsToDisplay.map((coord) => [coord.x, coord.y])

        const polygon = L.polygon(leafletCoords, {
          color: isDemoData ? "orange" : "red",
          weight: 3,
          fillColor: isDemoData ? "orange" : "red",
          fillOpacity: 0.2,
        }).addTo(mapRef.current)

        const center = polygon.getBounds().getCenter()
        const popupContent = `
          <div style="min-width: 250px;">
            <h3 style="margin: 0 0 10px 0; color: #1976d2;">
              ${isDemoData ? "Демо-данные" : "Участок найден"}
            </h3>
            <p style="margin: 5px 0;"><strong>Кадастровый номер:</strong><br>${plotInfoForMap.cadastralNumber}</p>
            <p style="margin: 5px 0;"><strong>Площадь:</strong> ${plotInfoForMap.area}</p>
            <p style="margin: 5px 0;"><strong>Адрес:</strong><br>${plotInfoForMap.address}</p>
            ${sourceInfo ? `<p style="margin: 5px 0; font-size: 12px; color: #666;"><strong>Источник:</strong> ${sourceInfo}</p>` : ""}
          </div>
        `

        L.marker([center.lat, center.lng]).addTo(mapRef.current).bindPopup(popupContent).openPopup()

        mapRef.current.fitBounds(polygon.getBounds(), { padding: [50, 50] })
      }
    }
  }, [searchResult, xmlParsedData])

  // --- Cadastral Number Search Functions ---
  const validateCadastralNumber = (number: string): boolean => {
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
    setXmlParsedData(null) // Clear XML results when searching by number

    try {
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
    const cleaned = value.replace(/[^\d:]/g, "")
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

  // --- XML Processing Functions ---
  const handleXmlFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setXmlFile(selectedFile)
      setXmlError(null)
      setXmlParsedData(null)
      setSearchResult(null) // Clear cadastral search results when processing XML
    }
  }

  const processXmlFile = async () => {
    if (!xmlFile) return

    setIsProcessingXml(true)
    setXmlError(null)

    try {
      const text = await xmlFile.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(text, "text/xml")

      const parserError = xmlDoc.querySelector("parsererror")
      if (parserError) {
        throw new Error("Ошибка парсинга XML файла. Убедитесь, что это корректный XML.")
      }

      const cadastralNumber = extractCadastralNumberFromXml(xmlDoc)
      const area = extractAreaFromXml(xmlDoc)
      const coordinates = extractCoordinatesFromXml(xmlDoc)
      const coordinateSystem = determineCoordinateSystem(coordinates)
      const convertedCoordinates = convertToWGS84(coordinates, coordinateSystem)

      const data: XmlParsedData = {
        cadastralNumber,
        area,
        coordinates: convertedCoordinates,
        coordinateSystem,
        zone: coordinateSystem.includes("МСК") ? coordinateSystem : undefined,
      }

      setXmlParsedData(data)
    } catch (err) {
      setXmlError(err instanceof Error ? err.message : "Ошибка обработки файла")
    } finally {
      setIsProcessingXml(false)
    }
  }

  const extractCadastralNumberFromXml = (xmlDoc: Document): string => {
    const selectors = ["CadastralNumber", "cadastralNumber", "[*|CadastralNumber]", "cadastral_number"]
    for (const selector of selectors) {
      const element = xmlDoc.querySelector(selector)
      if (element?.textContent) return element.textContent.trim()
    }
    return "Не найден"
  }

  const extractAreaFromXml = (xmlDoc: Document): number => {
    const selectors = ["Area", "area", "AreaValue", "[*|Area]"]
    for (const selector of selectors) {
      const element = xmlDoc.querySelector(selector)
      if (element?.textContent) {
        const area = Number.parseFloat(element.textContent.trim())
        if (!isNaN(area)) return area
      }
    }
    return 0
  }

  const extractCoordinatesFromXml = (xmlDoc: Document): CoordinatePoint[] => {
    const coordinates: CoordinatePoint[] = []
    const coordinateSelectors = ["gml\\:coordinates", "coordinates", "gml\\:pos", "pos", "Coordinate"]

    for (const selector of coordinateSelectors) {
      const elements = xmlDoc.querySelectorAll(selector)
      for (const element of elements) {
        const text = element.textContent?.trim()
        if (text) {
          const coords = parseCoordinateString(text)
          coordinates.push(...coords)
        }
      }
      if (coordinates.length > 0) break
    }

    if (coordinates.length === 0) {
      const xElements = xmlDoc.querySelectorAll("X, x")
      const yElements = xmlDoc.querySelectorAll("Y, y")
      for (let i = 0; i < Math.min(xElements.length, yElements.length); i++) {
        const x = Number.parseFloat(xElements[i].textContent || "0")
        const y = Number.parseFloat(yElements[i].textContent || "0")
        if (!isNaN(x) && !isNaN(y)) coordinates.push({ x, y })
      }
    }
    return coordinates
  }

  const parseCoordinateString = (coordString: string): CoordinatePoint[] => {
    const coordinates: CoordinatePoint[] = []
    const cleanString = coordString.replace(/\s+/g, " ").trim()

    if (cleanString.includes(",")) {
      const pairs = cleanString.split(/\s+/)
      for (const pair of pairs) {
        const [xStr, yStr] = pair.split(",")
        const x = Number.parseFloat(xStr)
        const y = Number.parseFloat(yStr)
        if (!isNaN(x) && !isNaN(y)) coordinates.push({ x, y })
      }
    } else {
      const numbers = cleanString
        .split(/\s+/)
        .map(Number.parseFloat)
        .filter((n) => !isNaN(n))
      for (let i = 0; i < numbers.length - 1; i += 2) {
        coordinates.push({ x: numbers[i], y: numbers[i + 1] })
      }
    }
    return coordinates
  }

  const determineCoordinateSystem = (coordinates: CoordinatePoint[]): string => {
    if (coordinates.length === 0) return "Неизвестно"
    const firstPoint = coordinates[0]

    if (firstPoint.x >= -180 && firstPoint.x <= 180 && firstPoint.y >= -90 && firstPoint.y <= 90) return "WGS84"
    if (firstPoint.x > 200000 && firstPoint.x < 800000) {
      if (firstPoint.y > 2000000 && firstPoint.y < 3000000) return "МСК-77 (зона 1)"
      if (firstPoint.y > 6000000 && firstPoint.y < 7000000) return "МСК-77 (зона 2)"
    }
    if (firstPoint.x > 100000) return "МСК (зона не определена)"
    return "Локальная система"
  }

  const convertToWGS84 = (coordinates: CoordinatePoint[], system: string): CoordinatePoint[] => {
    // NOTE: This is a simplified approximation for demonstration.
    // For precise geodetic transformations, a dedicated projection library (e.g., proj4js)
    // and accurate transformation parameters for each MSK zone are required.
    return coordinates.map((coord) => {
      let lat: number, lon: number

      if (system === "WGS84") {
        lat = coord.y
        lon = coord.x
      } else if (system.includes("МСК-77")) {
        // Approximate conversion for MSK-77 (Moscow region)
        // These values are highly generalized and may not be accurate for all points
        const baseLat = 55.7558
        const baseLon = 37.6176
        const metersPerDegreeLat = 111320 // Approx meters per degree latitude
        const metersPerDegreeLon = 65000 // Approx meters per degree longitude at Moscow latitude

        // Assuming a false origin for MSK-77
        const falseOriginX = 400000 // Example false easting
        const falseOriginY = 2000000 // Example false northing

        lat = baseLat + (coord.y - falseOriginY) / metersPerDegreeLat
        lon = baseLon + (coord.x - falseOriginX) / metersPerDegreeLon
      } else {
        // Fallback for unknown or local systems, might not be accurate
        lat = coord.y / 111000
        lon = coord.x / 65000
      }

      return {
        ...coord,
        wgs84_lat: lat,
        wgs84_lon: lon,
      }
    })
  }

  const exportXmlDataToJSON = () => {
    if (!xmlParsedData) return
    const dataStr = JSON.stringify(xmlParsedData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `coordinates_${xmlParsedData.cadastralNumber || "unknown"}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportXmlDataToCSV = () => {
    if (!xmlParsedData) return
    const headers = ["№", "X (исходная)", "Y (исходная)", "Широта (WGS84)", "Долгота (WGS84)"]
    const rows = xmlParsedData.coordinates.map((coord, index) => [
      index + 1,
      coord.x.toFixed(3),
      coord.y.toFixed(3),
      coord.wgs84_lat?.toFixed(8) || "",
      coord.wgs84_lon?.toFixed(8) || "",
    ])
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const dataBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `coordinates_${xmlParsedData.cadastralNumber || "unknown"}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportXmlDataToKML = () => {
    if (!xmlParsedData) return
    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Участок ${xmlParsedData.cadastralNumber}</name>
    <Placemark>
      <name>Границы участка</name>
      <description>Кадастровый номер: ${xmlParsedData.cadastralNumber}
Площадь: ${xmlParsedData.area} кв.м
Система координат: ${xmlParsedData.coordinateSystem}</description>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
${xmlParsedData.coordinates
  .map((coord) => `${coord.wgs84_lon?.toFixed(8) || coord.x},${coord.wgs84_lat?.toFixed(8) || coord.y},0`)
  .join("\n")}
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`
    const dataBlob = new Blob([kmlContent], { type: "application/vnd.google-earth.kml+xml" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `coordinates_${xmlParsedData.cadastralNumber || "unknown"}.kml`
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyXmlCoordinates = async () => {
    if (!xmlParsedData) return
    const coordText = xmlParsedData.coordinates
      .map(
        (coord, index) =>
          `${index + 1}. X: ${coord.x.toFixed(3)}, Y: ${coord.y.toFixed(3)} (WGS84: ${coord.wgs84_lat?.toFixed(8)}, ${coord.wgs84_lon?.toFixed(8)})`,
      )
      .join("\n")
    try {
      await navigator.clipboard.writeText(coordText)
      alert("Координаты скопированы в буфер обмена!")
    } catch (err) {
      console.error("Failed to copy coordinates:", err)
      alert("Не удалось скопировать координаты.")
    }
  }

  return (
    <>
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxTlZBo="
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
              <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4">Поиск и обработка участков</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Найдите информацию по кадастровому номеру или извлеките данные из XML файла
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Cadastral Number Search Section */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Search className="text-blue-500 h-6 w-6 mr-2" />
                  Поиск по кадастровому номеру
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cadastral-number" className="block text-base font-medium mb-2">
                      Кадастровый номер участка
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="cadastral-number"
                        type="text"
                        placeholder="50:21:0000000:123"
                        value={cadastralNumber}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={20}
                      />
                      <Button
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
                      </Button>
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

              {/* XML Processing Section */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Обработка XML файла
                  </CardTitle>
                  <CardDescription>Загрузите XML файл для извлечения кадастровых данных и координат</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="xml-file">Выберите XML файл</Label>
                      <Input
                        id="xml-file"
                        type="file"
                        accept=".xml"
                        onChange={handleXmlFileSelect}
                        ref={xmlFileInputRef}
                        className="mt-1"
                      />
                    </div>

                    {xmlFile && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>
                          {xmlFile.name} ({(xmlFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    )}

                    <Button onClick={processXmlFile} disabled={!xmlFile || isProcessingXml} className="w-full">
                      {isProcessingXml ? "Обработка..." : "Обработать XML файл"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Error Display for XML */}
              {xmlError && (
                <Card className="mb-8 border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Ошибка обработки XML:</span>
                    </div>
                    <p className="text-red-600 mt-1">{xmlError}</p>
                  </CardContent>
                </Card>
              )}

              {/* Information about API/XML processing */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-700">Информация о работе сервиса:</p>
                    <p className="text-amber-600 mt-1">
                      Поиск по кадастровому номеру использует официальные API Росреестра. При их недоступности
                      отображаются демонстрационные данные. Обработка XML файлов происходит локально в браузере.
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Section */}
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

              {/* Search Results Display */}
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
                              <Button
                                onClick={() => generateCoordinatesFile(searchResult.plotInfo!)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Скачать данные
                              </Button>
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

              {/* XML Processing Results Display */}
              {xmlParsedData && (
                <div className="space-y-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Информация об участке из XML
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Кадастровый номер</Label>
                          <p className="text-lg font-mono">{xmlParsedData.cadastralNumber}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Площадь</Label>
                          <p className="text-lg">{xmlParsedData.area.toLocaleString()} кв.м</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Система координат</Label>
                          <p className="text-lg">{xmlParsedData.coordinateSystem}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Координаты точек ({xmlParsedData.coordinates.length} точек)</CardTitle>
                      <CardDescription>Исходные координаты и их преобразование в WGS84</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">№</th>
                              <th className="text-left p-2">X (исходная)</th>
                              <th className="text-left p-2">Y (исходная)</th>
                              <th className="text-left p-2">Широта (WGS84)</th>
                              <th className="text-left p-2">Долгота (WGS84)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {xmlParsedData.coordinates.map((coord, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2 font-mono">{coord.x.toFixed(3)}</td>
                                <td className="p-2 font-mono">{coord.y.toFixed(3)}</td>
                                <td className="p-2 font-mono">{coord.wgs84_lat?.toFixed(8) || "N/A"}</td>
                                <td className="p-2 font-mono">{coord.wgs84_lon?.toFixed(8) || "N/A"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Экспорт данных XML
                      </CardTitle>
                      <CardDescription>Сохраните извлеченные координаты в удобном для вас формате</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button onClick={exportXmlDataToJSON} variant="outline" className="w-full bg-transparent">
                          <Download className="mr-2 h-4 w-4" />
                          JSON
                        </Button>
                        <Button onClick={exportXmlDataToCSV} variant="outline" className="w-full bg-transparent">
                          <Download className="mr-2 h-4 w-4" />
                          CSV
                        </Button>
                        <Button onClick={exportXmlDataToKML} variant="outline" className="w-full bg-transparent">
                          <Download className="mr-2 h-4 w-4" />
                          KML
                        </Button>
                        <Button onClick={copyXmlCoordinates} variant="outline" className="w-full bg-transparent">
                          <Copy className="mr-2 h-4 w-4" />
                          Копировать
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
