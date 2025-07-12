"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, MapPin, FileText, Copy } from "lucide-react"
import Link from "next/link"

interface Coordinate {
  x: number
  y: number
  zone?: string
}

interface ParsedData {
  cadastralNumber: string
  area: number
  coordinates: Coordinate[]
  format: string
  zone: string
}

export default function CoordinateProcessor() {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const parseXMLFile = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const text = await file.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(text, "text/xml")

      // Check for parsing errors
      const parseError = xmlDoc.querySelector("parsererror")
      if (parseError) {
        throw new Error("Некорректный XML файл")
      }

      // Extract cadastral number
      const cadastralNumber = extractCadastralNumber(xmlDoc)

      // Extract area
      const area = extractArea(xmlDoc)

      // Extract coordinates
      const coordinates = extractCoordinates(xmlDoc)

      // Determine coordinate system
      const zone = determineCoordinateZone(coordinates)

      setParsedData({
        cadastralNumber,
        area,
        coordinates,
        format: "MSK",
        zone,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при обработке файла")
    } finally {
      setLoading(false)
    }
  }

  const extractCadastralNumber = (xmlDoc: Document): string => {
    // Try different possible selectors for cadastral number
    const selectors = ["CadastralNumber", "cadastral_number", "[*|CadastralNumber]", "Parcels Parcel CadastralNumber"]

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
    const selectors = ["Area", "area", "AreaValue", "[*|Area]", "Parcels Parcel Area"]

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

  const extractCoordinates = (xmlDoc: Document): Coordinate[] => {
    const coordinates: Coordinate[] = []

    // Try different coordinate selectors
    const coordinateSelectors = ["Coordinate", "coordinates", "Point", "pos", "X Y", "Ordinate"]

    // Look for coordinate pairs
    const xElements = xmlDoc.querySelectorAll('X, x, Ordinate[name="X"]')
    const yElements = xmlDoc.querySelectorAll('Y, y, Ordinate[name="Y"]')

    if (xElements.length === yElements.length && xElements.length > 0) {
      for (let i = 0; i < xElements.length; i++) {
        const x = Number.parseFloat(xElements[i].textContent || "0")
        const y = Number.parseFloat(yElements[i].textContent || "0")

        if (!isNaN(x) && !isNaN(y)) {
          coordinates.push({ x, y })
        }
      }
    }

    // If no coordinates found, try pos elements (GML format)
    if (coordinates.length === 0) {
      const posElements = xmlDoc.querySelectorAll("pos, gml\\:pos")
      posElements.forEach((pos) => {
        const coords = pos.textContent?.trim().split(/\s+/)
        if (coords && coords.length >= 2) {
          const x = Number.parseFloat(coords[0])
          const y = Number.parseFloat(coords[1])
          if (!isNaN(x) && !isNaN(y)) {
            coordinates.push({ x, y })
          }
        }
      })
    }

    return coordinates
  }

  const determineCoordinateZone = (coordinates: Coordinate[]): string => {
    if (coordinates.length === 0) return "Неизвестно"

    const firstCoord = coordinates[0]

    // Determine zone based on X coordinate (for MSK zones)
    if (firstCoord.x > 7000000) return "МСК-77"
    if (firstCoord.x > 6000000) return "МСК-78"
    if (firstCoord.x > 5000000) return "МСК-79"
    if (firstCoord.x > 4000000) return "МСК-80"

    // Check if it's WGS84 (latitude/longitude)
    if (firstCoord.x >= -180 && firstCoord.x <= 180 && firstCoord.y >= -90 && firstCoord.y <= 90) {
      return "WGS84"
    }

    return "МСК (зона не определена)"
  }

  const convertToWGS84 = (coord: Coordinate, zone: string): Coordinate => {
    // Simplified conversion - in real implementation you'd use proper projection libraries
    // This is a basic approximation for demonstration
    if (zone.includes("WGS84")) return coord

    // Basic MSK to WGS84 conversion (simplified)
    const lat = coord.y / 111000 + 55.7558 // Approximate for Moscow region
    const lon = coord.x / 111000 + 37.6176

    return { x: lon, y: lat }
  }

  const exportToFormat = (format: "json" | "csv" | "kml" | "txt") => {
    if (!parsedData) return

    let content = ""
    const filename = `coordinates_${parsedData.cadastralNumber}.${format}`

    switch (format) {
      case "json":
        content = JSON.stringify(parsedData, null, 2)
        break

      case "csv":
        content = "X,Y,Latitude,Longitude\n"
        parsedData.coordinates.forEach((coord) => {
          const wgs84 = convertToWGS84(coord, parsedData.zone)
          content += `${coord.x},${coord.y},${wgs84.y},${wgs84.x}\n`
        })
        break

      case "kml":
        content = generateKML(parsedData)
        break

      case "txt":
        content = `Кадастровый номер: ${parsedData.cadastralNumber}\n`
        content += `Площадь: ${parsedData.area} кв.м\n`
        content += `Система координат: ${parsedData.zone}\n\n`
        content += "Координаты:\n"
        parsedData.coordinates.forEach((coord, index) => {
          content += `${index + 1}. X: ${coord.x}, Y: ${coord.y}\n`
        })
        break
    }

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateKML = (data: ParsedData): string => {
    const coordinates = data.coordinates
      .map((coord) => {
        const wgs84 = convertToWGS84(coord, data.zone)
        return `${wgs84.x},${wgs84.y},0`
      })
      .join(" ")

    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Участок ${data.cadastralNumber}</name>
    <Placemark>
      <name>Кадастровый участок ${data.cadastralNumber}</name>
      <description>Площадь: ${data.area} кв.м</description>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordinates}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`
  }

  const copyCoordinates = () => {
    if (!parsedData) return

    const text = parsedData.coordinates.map((coord, index) => `${index + 1}. X: ${coord.x}, Y: ${coord.y}`).join("\n")

    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-blue-600">
              <MapPin className="h-8 w-8" />
              кадастровик.рф
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
                <Input id="xml-file" type="file" accept=".xml" onChange={handleFileUpload} className="mt-1" />
              </div>

              {file && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Выбран файл: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              )}

              <Button onClick={parseXMLFile} disabled={!file || loading} className="w-full">
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
          {parsedData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Результаты обработки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-700">Кадастровый номер</h3>
                    <p className="text-lg font-mono">{parsedData.cadastralNumber}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-700">Площадь</h3>
                    <p className="text-lg">{parsedData.area} кв.м</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-700">Система координат</h3>
                    <p className="text-lg">{parsedData.zone}</p>
                  </div>
                </div>

                {/* Coordinates */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Координаты ({parsedData.coordinates.length} точек)</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyCoordinates}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Copy className="h-4 w-4" />
                      Копировать
                    </Button>
                  </div>

                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left">№</th>
                          <th className="px-3 py-2 text-left">X</th>
                          <th className="px-3 py-2 text-left">Y</th>
                          <th className="px-3 py-2 text-left">Широта (WGS84)</th>
                          <th className="px-3 py-2 text-left">Долгота (WGS84)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.coordinates.map((coord, index) => {
                          const wgs84 = convertToWGS84(coord, parsedData.zone)
                          return (
                            <tr key={index} className="border-t">
                              <td className="px-3 py-2">{index + 1}</td>
                              <td className="px-3 py-2 font-mono">{coord.x.toFixed(2)}</td>
                              <td className="px-3 py-2 font-mono">{coord.y.toFixed(2)}</td>
                              <td className="px-3 py-2 font-mono">{wgs84.y.toFixed(6)}</td>
                              <td className="px-3 py-2 font-mono">{wgs84.x.toFixed(6)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Export Options */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Экспорт данных</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => exportToFormat("json")}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      JSON
                    </Button>
                    <Button variant="outline" onClick={() => exportToFormat("csv")} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                    <Button variant="outline" onClick={() => exportToFormat("kml")} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      KML
                    </Button>
                    <Button variant="outline" onClick={() => exportToFormat("txt")} className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      TXT
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card>
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
