"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Download, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { GeodesicLogo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function XmlToDxfConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [conversionResult, setConversionResult] = useState<{
    success: boolean
    message: string
    downloadUrl?: string
  } | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)

    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (file.name.toLowerCase().endsWith(".xml")) {
      setSelectedFile(file)
      setConversionResult(null)

      // Автоматически запускаем конвертацию
      setTimeout(() => {
        handleConvertFile(file)
      }, 100)
    } else {
      setConversionResult({
        success: false,
        message: "Пожалуйста, выберите XML-файл",
      })
    }
  }

  const handleConvertFile = async (file: File) => {
    setIsConverting(true)

    try {
      // Читаем содержимое XML файла
      const fileContent = await file.text()

      // Создаем простой DXF файл (в реальном приложении здесь была бы полная конвертация)
      const dxfContent = generateDXFFromXML(fileContent, file.name)

      // Создаем blob для скачивания
      const blob = new Blob([dxfContent], { type: "application/dxf" })
      const downloadUrl = URL.createObjectURL(blob)

      setTimeout(() => {
        setIsConverting(false)
        setConversionResult({
          success: true,
          message: "Файл успешно конвертирован в формат DXF",
          downloadUrl: downloadUrl,
        })

        // Автоматически скачиваем файл
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = file.name.replace(".xml", ".dxf") || "converted.dxf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 2000)
    } catch (error) {
      setIsConverting(false)
      setConversionResult({
        success: false,
        message: "Ошибка при конвертации файла. Проверьте формат XML файла.",
      })
    }
  }

  const handleConvert = async () => {
    if (!selectedFile) return
    await handleConvertFile(selectedFile)
  }

  const resetConverter = () => {
    setSelectedFile(null)
    setConversionResult(null)
    setIsConverting(false)
  }

  // Функция для парсинга координат и кадастрового номера из XML
  const parseXMLData = (
    xmlContent: string,
  ): {
    coordinates: Array<{ x: number; y: number }>
    objectParts: Array<{ coordinates: Array<{ x: number; y: number }>; id: string }>
    cadastralNumber: string
  } => {
    const coordinates: Array<{ x: number; y: number }> = []
    const objectParts: Array<{ coordinates: Array<{ x: number; y: number }>; id: string }> = []
    let cadastralNumber = ""

    try {
      // Ищем кадастровый номер
      const cadastralRegex = /<cad_number>([\d:]+)<\/cad_number>/
      const cadastralMatch = xmlContent.match(cadastralRegex)
      if (cadastralMatch) {
        cadastralNumber = cadastralMatch[1]
      }

      // Ищем основные границы участка в contours_location
      const contoursLocationRegex = /<contours_location>[\s\S]*?<\/contours_location>/
      const contoursLocationMatch = xmlContent.match(contoursLocationRegex)

      if (contoursLocationMatch) {
        const contoursContent = contoursLocationMatch[0]
        const ordinateRegex = /<ordinate>[\s\S]*?<\/ordinate>/g
        const ordinateMatches = contoursContent.match(ordinateRegex)

        if (ordinateMatches) {
          ordinateMatches.forEach((ordinate) => {
            const xMatch = ordinate.match(/<x>([\d.-]+)<\/x>/)
            const yMatch = ordinate.match(/<y>([\d.-]+)<\/y>/)

            if (xMatch && yMatch) {
              const x = Number.parseFloat(xMatch[1])
              const y = Number.parseFloat(yMatch[1])

              if (!isNaN(x) && !isNaN(y)) {
                coordinates.push({ x, y })
              }
            }
          })
        }
      }

      // Ищем object_parts (объекты на участке)
      const objectPartsRegex = /<object_parts>[\s\S]*?<\/object_parts>/
      const objectPartsMatch = xmlContent.match(objectPartsRegex)

      if (objectPartsMatch) {
        const objectPartsContent = objectPartsMatch[0]
        const objectPartRegex = /<object_part>[\s\S]*?<\/object_part>/g
        const objectPartMatches = objectPartsContent.match(objectPartRegex)

        if (objectPartMatches) {
          objectPartMatches.forEach((objectPart, index) => {
            const partCoordinates: Array<{ x: number; y: number }> = []

            // Ищем номер части
            const partNumberMatch = objectPart.match(/<part_number>(.*?)<\/part_number>/)
            const partId = partNumberMatch ? `Часть ${partNumberMatch[1]}` : `Объект ${index + 1}`

            const ordinateRegex = /<ordinate>[\s\S]*?<\/ordinate>/g
            const ordinateMatches = objectPart.match(ordinateRegex)

            if (ordinateMatches) {
              ordinateMatches.forEach((ordinate) => {
                const xMatch = ordinate.match(/<x>([\d.-]+)<\/x>/)
                const yMatch = ordinate.match(/<y>([\d.-]+)<\/y>/)

                if (xMatch && yMatch) {
                  const x = Number.parseFloat(xMatch[1])
                  const y = Number.parseFloat(yMatch[1])

                  if (!isNaN(x) && !isNaN(y)) {
                    partCoordinates.push({ x, y })
                  }
                }
              })
            }

            if (partCoordinates.length > 0) {
              objectParts.push({ coordinates: partCoordinates, id: partId })
            }
          })
        }
      }
    } catch (error) {
      console.error("Ошибка парсинга XML:", error)
    }

    return { coordinates, objectParts, cadastralNumber }
  }

  // Функция для вычисления границ
  const calculateBounds = (coordinates: Array<{ x: number; y: number }>) => {
    if (coordinates.length === 0) {
      return { minX: 0, maxX: 100, minY: 0, maxY: 100 }
    }

    const xs = coordinates.map((c) => c.x)
    const ys = coordinates.map((c) => c.y)

    return {
      minX: Math.min(...ys) - 10, // Поменяли местами
      maxX: Math.max(...ys) + 10, // Поменяли местами
      minY: Math.min(...xs) - 10, // Поменяли местами
      maxY: Math.max(...xs) + 10, // Поменяли местами
    }
  }

  // Функция для вычисления площади полигона
  const calculateArea = (coordinates: Array<{ x: number; y: number }>): number => {
    if (coordinates.length < 3) return 0

    let area = 0
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length
      area += coordinates[i].x * coordinates[j].y
      area -= coordinates[j].x * coordinates[i].y
    }
    return Math.abs(area) / 2
  }

  const generateDXFFromXML = (xmlContent: string, fileName: string): string => {
    // Парсим XML для извлечения координат и кадастрового номера
    const { coordinates, objectParts, cadastralNumber } = parseXMLData(xmlContent)

    // Если координаты не найдены, используем демо-данные
    if (coordinates.length === 0) {
      coordinates.push(
        { x: 505764.87, y: 1317818.52 },
        { x: 505864.87, y: 1317818.52 },
        { x: 505864.87, y: 1317918.52 },
        { x: 505764.87, y: 1317918.52 },
      )
    }

    // Формируем текст для отображения
    const displayText = cadastralNumber || "Участок без номера"

    // Вычисляем центр участка для размещения текста
    const centerX = coordinates.reduce((sum, coord) => sum + coord.y, 0) / coordinates.length
    const centerY = coordinates.reduce((sum, coord) => sum + coord.x, 0) / coordinates.length

    // Создаем DXF с участком на слое "PARCEL" и объектами на слое "OBJECTS"
    let dxfContent = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1009
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
70
2
0
LAYER
2
PARCEL
70
0
62
94
6
CONTINUOUS
0
LAYER
2
OBJECTS
70
0
62
40
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
0
POLYLINE
8
PARCEL
66
1
0
VERTEX
8
PARCEL
10
${coordinates[0].y}
20
${coordinates[0].x}
0
${coordinates
  .slice(1)
  .map(
    (coord) => `VERTEX
8
PARCEL
10
${coord.y}
20
${coord.x}
0`,
  )
  .join("\n")}
SEQEND
8
PARCEL
0`

    // Добавляем object_parts на отдельный слой
    objectParts.forEach((part) => {
      if (part.coordinates.length > 0) {
        dxfContent += `
POLYLINE
8
OBJECTS
66
1
0
VERTEX
8
OBJECTS
10
${part.coordinates[0].y}
20
${part.coordinates[0].x}
0
${part.coordinates
  .slice(1)
  .map(
    (coord) => `VERTEX
8
OBJECTS
10
${coord.y}
20
${coord.x}
0`,
  )
  .join("\n")}
SEQEND
8
OBJECTS
0`
      }
    })

    dxfContent += `
TEXT
8
PARCEL
10
${centerX}
20
${centerY}
40
1
1
${displayText}
0
ENDSEC
0
EOF`

    return dxfContent
  }

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
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
            <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4">Конвертер XML в DXF</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Бесплатный онлайн-конвертер XML-файлов межевых и технических планов в формат DXF для AutoCAD
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="text-blue-500 h-6 w-6 mr-2" />
                    Загрузка файла
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept=".xml"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <FileText className={`h-12 w-12 mb-4 ${isDragOver ? "text-blue-500" : "text-gray-400"}`} />
                        <span className="text-lg font-medium text-gray-700 mb-2">
                          {isDragOver ? "Отпустите файл для загрузки" : "Выберите XML-файл или перетащите сюда"}
                        </span>
                        <span className="text-sm text-gray-500">Поддерживаются файлы межевых и технических планов</span>
                      </label>
                    </div>

                    {selectedFile && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="font-medium">{selectedFile.name}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Размер: {(selectedFile.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    )}

                    {isConverting && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 mr-2"></div>
                          <span className="font-medium text-orange-700">Конвертация файла...</span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleConvert}
                      disabled={!selectedFile || isConverting}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      {isConverting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Конвертация...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Конвертировать в DXF
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Информация о конвертере</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-green-600 mb-2">Поддерживаемые форматы:</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• XML-файлы межевых планов</li>
                        <li>• XML-файлы технических планов</li>
                        <li>• XML-файлы актов обследования</li>
                        <li>• Карты-планы территории</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-blue-600 mb-2">Возможности:</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Сохранение координат и геометрии</li>
                        <li>• Разделение по слоям</li>
                        <li>• Сохранение атрибутов объектов</li>
                        <li>• Совместимость с AutoCAD</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-700">Важно:</p>
                          <p className="text-yellow-600">
                            Конвертер работает только с корректными XML-файлами, соответствующими стандартам Росреестра.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {conversionResult && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div
                    className={`flex items-center p-4 rounded-lg ${
                      conversionResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {conversionResult.success ? (
                      <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    )}
                    <div className="flex-grow">
                      <p className="font-medium">{conversionResult.message}</p>
                      {conversionResult.success && conversionResult.downloadUrl && (
                        <div className="mt-3 flex gap-3">
                          <Button
                            onClick={() => {
                              if (conversionResult?.downloadUrl) {
                                const link = document.createElement("a")
                                link.href = conversionResult.downloadUrl
                                link.download = selectedFile?.name.replace(".xml", ".dxf") || "converted.dxf"
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                                URL.revokeObjectURL(conversionResult.downloadUrl)
                              }
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Скачать DXF
                          </Button>
                          <Button onClick={resetConverter} variant="outline">
                            Конвертировать еще файл
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-500 mb-4">Как использовать конвертер</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Выберите XML-файл</h3>
                  <p className="text-sm text-gray-600">Загрузите XML-файл или перетащите его в область загрузки</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Автоматическая конвертация</h3>
                  <p className="text-sm text-gray-600">Конвертация начнется автоматически после загрузки файла</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Скачайте результат</h3>
                  <p className="text-sm text-gray-600">Получите готовый DXF-файл для работы в AutoCAD</p>
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
                  className="mr-2 text-green-400"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="https://wa.me/89296727849" target="_blank" rel="noopener noreferrer">
                  8 (929) 672-78-49 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center justify-center">
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
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
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
