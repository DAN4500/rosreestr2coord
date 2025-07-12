import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cadastralNumber = searchParams.get("cadastralNumber")

  if (!cadastralNumber) {
    return NextResponse.json({ error: "Кадастровый номер не указан" }, { status: 400 })
  }

  // Валидация формата кадастрового номера
  const cadastralRegex = /^\d{2}:\d{2}:\d{6,7}:\d{1,4}$/
  if (!cadastralRegex.test(cadastralNumber)) {
    return NextResponse.json({ error: "Неверный формат кадастрового номера" }, { status: 400 })
  }

  try {
    // Пробуем несколько источников данных
    const sources = [
      {
        name: "PKK Rosreestr",
        url: `https://pkk.rosreestr.ru/api/features/1/${cadastralNumber}`,
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Referer: "https://pkk.rosreestr.ru/",
        },
      },
      {
        name: "Alternative API",
        url: `https://rosreestr.gov.ru/api/online/fir_object/${cadastralNumber}`,
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    ]

    for (const source of sources) {
      try {
        const response = await fetch(source.url, {
          method: "GET",
          headers: source.headers,
          // Добавляем таймаут
          signal: AbortSignal.timeout(10000),
        })

        if (response.ok) {
          const data = await response.json()

          // Обрабатываем ответ от PKK API
          if (source.name === "PKK Rosreestr" && data?.feature) {
            const feature = data.feature
            const attrs = feature.attrs || {}

            // Извлекаем координаты
            let coordinates: Array<{ x: number; y: number }> = []
            if (feature.extent?.rings?.[0]) {
              coordinates = feature.extent.rings[0].map((coord: number[]) => ({
                x: coord[1], // широта
                y: coord[0], // долгота
              }))
            }

            return NextResponse.json({
              success: true,
              source: source.name,
              data: {
                cadastralNumber,
                area: attrs.area_value ? `${attrs.area_value} м²` : "Не указана",
                address: attrs.address || attrs.readable_address || "Адрес не найден",
                category: attrs.category_type || "Не указана",
                usage: attrs.util_by_doc || attrs.permitted_use_by_doc || "Не указано",
                coordinates,
                status: attrs.state || "Учтен",
                objectType: attrs.object_type || "Земельный участок",
                dateCreated: attrs.date_create,
                dateUpdated: attrs.date_update,
              },
            })
          }

          // Обрабатываем ответ от альтернативного API
          if (source.name === "Alternative API" && data?.objectData) {
            return NextResponse.json({
              success: true,
              source: source.name,
              data: {
                cadastralNumber,
                area: data.objectData.areaValue || "Не указана",
                address: data.objectData.objectAddress || "Адрес не найден",
                category: data.objectData.categoryType || "Не указана",
                usage: data.objectData.utilByDoc || "Не указано",
                coordinates: [],
                status: "Учтен",
                objectType: "Земельный участок",
              },
            })
          }
        }
      } catch (sourceError) {
        console.log(`Ошибка источника ${source.name}:`, sourceError)
        continue
      }
    }

    // Если все источники недоступны, возвращаем демо-данные
    const region = cadastralNumber.split(":")[0]
    const district = cadastralNumber.split(":")[1]

    // Генерируем реалистичные координаты в зависимости от региона
    const getRegionCoordinates = (regionCode: string) => {
      const regions: { [key: string]: { lat: number; lng: number; name: string } } = {
        "50": { lat: 55.7558, lng: 37.6176, name: "Московская область" },
        "77": { lat: 55.7558, lng: 37.6176, name: "г. Москва" },
        "78": { lat: 59.9311, lng: 30.3609, name: "г. Санкт-Петербург" },
        "23": { lat: 45.0355, lng: 38.9753, name: "Краснодарский край" },
        "61": { lat: 51.672, lng: 39.1843, name: "Ростовская область" },
      }

      return regions[regionCode] || { lat: 55.7558, lng: 37.6176, name: `Регион ${regionCode}` }
    }

    const regionInfo = getRegionCoordinates(region)
    const baseArea = 600 + Math.floor(Math.random() * 2000)

    return NextResponse.json({
      success: true,
      source: "Demo Data",
      isDemo: true,
      data: {
        cadastralNumber,
        area: `${baseArea} м²`,
        address: `${regionInfo.name}, район ${district}, демонстрационные данные`,
        category: "Земли населенных пунктов",
        usage: "Для индивидуального жилищного строительства",
        coordinates: [
          { x: regionInfo.lat + (Math.random() - 0.5) * 0.01, y: regionInfo.lng + (Math.random() - 0.5) * 0.01 },
          { x: regionInfo.lat + (Math.random() - 0.5) * 0.01, y: regionInfo.lng + (Math.random() - 0.5) * 0.01 },
          { x: regionInfo.lat + (Math.random() - 0.5) * 0.01, y: regionInfo.lng + (Math.random() - 0.5) * 0.01 },
          { x: regionInfo.lat + (Math.random() - 0.5) * 0.01, y: regionInfo.lng + (Math.random() - 0.5) * 0.01 },
        ],
        status: "Учтен (демо-данные)",
        objectType: "Земельный участок",
        dateCreated: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      },
    })
  } catch (error) {
    console.error("Ошибка поиска участка:", error)

    return NextResponse.json(
      {
        error: "Ошибка при поиске участка",
        details: error instanceof Error ? error.message : "Неизвестная ошибка",
      },
      { status: 500 },
    )
  }
}
