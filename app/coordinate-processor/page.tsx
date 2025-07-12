"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, MapPin, Copy, CheckCircle } from "lucide-react"
import Link from "next/link"

interface CoordinatePoint {
  x: number
  y: number
  wgs84_lat?: number
  wgs84_lon?: number
}

interface PlotData {
  cadastralNumber: string
  area: number
  coordinates: CoordinatePoint[]
  coordinateSystem: string
  zone?: string
}

export default function CoordinateProcessor() {
  const [file, setFile] = useState<File | null>(null)
  const [plotData, setPlotData] = useState<PlotData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setPlotData(null)
    }
  }

  const processXMLFile = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const text = await file.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(text, "text/xml")

      // Check for parsing errors
      const parserError = xmlDoc.querySelector("parsererror")
      if (parserError) {
        throw new Error("Ошибка парсинга XML файла. Убедитесь, что это корректный XML.")
      }

      // Extract cadastral number
      const cadastralNumber = extractCadastralNumber(xmlDoc)

      // Extract area
      const area = extractArea(xmlDoc)

      // Extract coordinates
      const coordinates = extractCoordinates(xmlDoc)

      // Determine coordinate system
      const coordinateSystem = determineCoordinateSystem(coordinates)

      // Convert to WGS84 if needed
      const convertedCoordinates = convertToWGS84(coordinates, coordinateSystem)

      const data: PlotData = {
        cadastralNumber,
        area,
        coordinates: convertedCoordinates,
        coordinateSystem,
        zone: coordinateSystem.includes("МСК") ? coordinateSystem : undefined,
      }

      setPlotData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обработки файла")
    } finally {
      setLoading(false)
    }
  }

  const extractCadastralNumber = (xmlDoc: Document): string => {
    // Try different possible selectors for cadastral number
    const selectors = ["CadastralNumber", "cadastralNumber", "[*|CadastralNumber]", "cadastral_number"]

    for (const selector of selectors) {
      const element = xmlDoc.querySelector(selector)
      if (element?.textContent) {
        return element.textContent.trim()
      }
    }

    return "Не найден"
  }

  const extractArea = (xmlDoc: Document): number => {
    // Try different possible selectors for area
    const selectors = ["Area", "area", "AreaValue", "[*|Area]"]

    for (const selector of selectors) {
      const element = xmlDoc.querySelector(selector)
      if (element?.textContent) {
        const area = Number.parseFloat(element.textContent.trim())
        if (!isNaN(area)) {
          return area
        }
      }
    }

    return 0
  }

  const extractCoordinates = (xmlDoc: Document): CoordinatePoint[] => {
    const coordinates: CoordinatePoint[] = []

    // Try different coordinate extraction methods
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

    // If no coordinates found, try alternative methods
    if (coordinates.length === 0) {
      // Try extracting from X, Y elements
      const xElements = xmlDoc.querySelectorAll("X, x")
      const yElements = xmlDoc.querySelectorAll("Y, y")

      for (let i = 0; i < Math.min(xElements.length, yElements.length); i++) {
        const x = Number.parseFloat(xElements[i].textContent || "0")
        const y = Number.parseFloat(yElements[i].textContent || "0")

        if (!isNaN(x) && !isNaN(y)) {
          coordinates.push({ x, y })
        }
      }
    }

    return coordinates
  }

  const parseCoordinateString = (coordString: string): CoordinatePoint[] => {
    const coordinates: CoordinatePoint[] = []

    // Handle different coordinate formats
    const cleanString = coordString.replace(/\s+/g, " ").trim()

    // Try comma-separated pairs
    if (cleanString.includes(",")) {
      const pairs = cleanString.split(/\s+/)
      for (const pair of pairs) {
        const [xStr, yStr] = pair.split(",")
        const x = Number.parseFloat(xStr)
        const y = Number.parseFloat(yStr)

        if (!isNaN(x) && !isNaN(y)) {
          coordinates.push({ x, y })
        }
      }
    } else {
      // Try space-separated coordinates
      const numbers = cleanString
        .split(/\s+/)
        .map(Number.parseFloat)
        .filter((n) => !isNaN(n))

      for (let i = 0; i < numbers.length - 1; i += 2) {
        coordinates.push({
          x: numbers[i],
          y: numbers[i + 1],
        })
      }
    }

    return coordinates
  }

  const determineCoordinateSystem = (coordinates: CoordinatePoint[]): string => {
    if (coordinates.length === 0) return "Неизвестно"

    const firstPoint = coordinates[0]

    // Check if coordinates are in geographic format (lat/lon)
    if (firstPoint.x >= -180 && firstPoint.x <= 180 && firstPoint.y >= -90 && firstPoint.y <= 90) {
      return "WGS84"
    }

    // Check for Moscow coordinate systems based on coordinate ranges
    if (firstPoint.x > 200000 && firstPoint.x < 800000) {
      if (firstPoint.y > 2000000 && firstPoint.y < 3000000) {
        return "МСК-77 (зона 1)"
      } else if (firstPoint.y > 6000000 && firstPoint.y < 7000000) {
        return "МСК-77 (зона 2)"
      }
    }

    // Default assumption for large coordinates
    if (firstPoint.x > 100000) {
      return "МСК (зона не определена)"
    }

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

  const exportToJSON = () => {
    if (!plotData) return

    const dataStr = JSON.stringify(plotData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `coordinates_${plotData.cadastralNumber || "unknown"}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  const exportToCSV = () => {
    if (!plotData) return

    const headers = ["№", "X (исходная)", "Y (исходная)", "Широта (WGS84)", "Долгота (WGS84)"]
    const rows = plotData.coordinates.map((coord, index) => [
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
    link.download = `coordinates_${plotData.cadastralNumber || "unknown"}.csv`
    link.click()

    URL.revokeObjectURL(url)
  }

  const exportToKML = () => {
    if (!plotData) return

    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Участок ${plotData.cadastralNumber}</name>
    <Placemark>
      <name>Границы участка</name>
      <description>Кадастровый номер: ${plotData.cadastralNumber}
Площадь: ${plotData.area} кв.м
Система координат: ${plotData.coordinateSystem}</description>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
${plotData.coordinates
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
    link.download = `coordinates_${plotData.cadastralNumber || "unknown"}.kml`
    link.click()

    URL.revokeObjectURL(url)
  }

  const copyCoordinates = async () => {
    if (!plotData) return

    const coordText = plotData.coordinates
      .map(
        (coord, index) =>
          `${index + 1}. X: ${coord.x.toFixed(3)}, Y: ${coord.y.toFixed(3)} (WGS84: ${coord.wgs84_lat?.toFixed(8)}, ${coord.wgs84_lon?.toFixed(8)})`,
      )
      .join("\n")

    try {
      await navigator.clipboard.writeText(coordText)
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy coordinates:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-blue-600">
              <MapPin className="h-8 w-8" />
              ГЕОДЕЗИК
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Обработка координат из XML</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Извлечение и конвертация координат из XML файлов Росреестра
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Загрузка XML файла
              </CardTitle>
              <CardDescription>Выберите XML файл с данными участка из Росреестра</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="xml-file">XML файл</Label>
                <Input id="xml-file" type="file" accept=".xml" onChange={handleFileSelect} className="mt-1" />
              </div>

              {file && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Выбран файл: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              )}

              <Button onClick={processXMLFile} disabled={!file || loading} className="w-full">
                {loading ? "Обработка..." : "Обработать файл"}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {plotData && (
            <div className="space-y-6">
              {/* Plot Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Информация об участке
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Кадастровый номер</Label>
                      <p className="text-lg font-mono">{plotData.cadastralNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Площадь</Label>
                      <p className="text-lg">{plotData.area.toLocaleString()} кв.м</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Система координат</Label>
                      <p className="text-lg">{plotData.coordinateSystem}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coordinates Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Координаты точек ({plotData.coordinates.length} точек)</CardTitle>
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
                        {plotData.coordinates.map((coord, index) => (
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

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Экспорт данных
                  </CardTitle>
                  <CardDescription>Сохраните координаты в удобном для вас формате</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button onClick={exportToJSON} variant="outline" className="w-full bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      JSON
                    </Button>
                    <Button onClick={exportToCSV} variant="outline" className="w-full bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      CSV
                    </Button>
                    <Button onClick={exportToKML} variant="outline" className="w-full bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      KML
                    </Button>
                    <Button onClick={copyCoordinates} variant="outline" className="w-full bg-transparent">
                      <Copy className="mr-2 h-4 w-4" />
                      Копировать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Поддерживаемые форматы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Входные форматы:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• XML файлы Росреестра</li>
                    <li>• GML файлы</li>
                    <li>• Кадастровые выписки в XML</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Выходные форматы:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• JSON - структурированные данные</li>
                    <li>• CSV - таблица координат</li>
                    <li>• KML - для Google Earth</li>
                    <li>• TXT - текстовый формат</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
