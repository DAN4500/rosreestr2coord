"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PointCalculator() {
  const [pointCount, setPointCount] = useState<number>(4)
  const [price, setPrice] = useState<number>(6000)

  const calculatePrice = (points: number) => {
    if (points <= 0) return 0

    // Базовая стоимость за 4 точки = 6000₽
    // Каждая дополнительная точка = +1000₽
    // Если меньше 4 точек, то цена за точку = 1500₽

    if (points <= 4) {
      return points * 1500
    } else {
      const basePrice = 6000 // за первые 4 точки
      const additionalPoints = points - 4
      return basePrice + additionalPoints * 1000
    }
  }

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setPointCount(value)
    setPrice(calculatePrice(value))
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // На мобильных устройствах очищаем поле если значение 0
    if (pointCount === 0) {
      e.target.select()
    }
  }

  const handleButtonClick = (points: number) => {
    setPointCount(points)
    setPrice(calculatePrice(points))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl">Калькулятор стоимости выноса точек</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="points">Количество поворотных точек:</Label>
          <Input
            id="points"
            type="number"
            min="1"
            max="50"
            value={pointCount === 0 ? "" : pointCount}
            onChange={handlePointChange}
            onFocus={handleFocus}
            className="text-center text-lg"
            placeholder="4"
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[4, 5, 6, 8].map((num) => (
            <Button
              key={num}
              variant={pointCount === num ? "default" : "outline"}
              size="sm"
              onClick={() => handleButtonClick(num)}
            >
              {num}
            </Button>
          ))}
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Стоимость работ:</div>
          <div className="text-3xl font-bold text-red-600">{price.toLocaleString()} ₽</div>

          <div className="mt-3 text-xs text-gray-500 space-y-1">
            <div>• До 4 точек: 1500₽ за точку</div>
            <div>• От 5 точек: 6000₽ + 1000₽ за каждую дополнительную</div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600">Для заказа работ свяжитесь с нами:</div>
          <div className="flex flex-col space-y-2">
            <a
              href="https://wa.me/89296727849"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-white bg-green-500 hover:bg-green-600 transition-colors px-4 py-2 rounded-md"
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
              WhatsApp: +7 929 672-78-49
            </a>
            <a
              href="mailto:topo500@mail.ru"
              className="flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-md"
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email: topo500@mail.ru
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
