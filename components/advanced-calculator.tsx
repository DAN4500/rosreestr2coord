"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function AdvancedCalculator() {
  const [isOpen, setIsOpen] = useState(false)
  const [pointCount, setPointCount] = useState<number>(4)
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null)
  const [locationCoefficient, setLocationCoefficient] = useState<number>(1)

  const calculatePrice = () => {
    // Базовая стоимость: 6000₽ (для 4 точек)
    let totalPrice = 6000

    // Точки от 5 до 10: +1000₽ за каждую
    if (pointCount > 4) {
      const pointsFrom5To10 = Math.min(pointCount - 4, 6)
      totalPrice += pointsFrom5To10 * 1000
    }

    // Точки свыше 10: +500₽ за каждую
    if (pointCount > 10) {
      const pointsAbove10 = pointCount - 10
      totalPrice += pointsAbove10 * 500
    }

    // Применяем коэффициент удаленности
    totalPrice = Math.round(totalPrice * locationCoefficient)

    setCalculatedPrice(totalPrice)
  }

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setPointCount(value)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // На мобильных устройствах очищаем поле если значение 0
    if (pointCount === 0) {
      e.target.select()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white text-lg py-6 px-8 w-full max-w-md rounded-md">
          Рассчитать стоимость
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Расчет стоимости работ</DialogTitle>
          <DialogDescription className="text-gray-600">
            Укажите параметры вашего участка для расчета стоимости
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">Стоимость рассчитывается по формуле:</p>
            <ul className="space-y-1 text-sm">
              <li>• Базовая стоимость: 6000₽ (для 4 точек)</li>
              <li>• Точки от 5 до 10: +1000₽ за каждую</li>
              <li>• Точки свыше 10: +500₽ за каждую</li>
              <li>• Стоимость умножается на коэффициент удаленности</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="points" className="text-base font-medium">
                Количество точек
              </Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={pointCount === 0 ? "" : pointCount}
                onChange={handlePointChange}
                onFocus={handleFocus}
                className="mt-1 text-base"
                placeholder="4"
              />
            </div>
            <div>
              <Label className="text-base font-medium mb-3 block">Местоположение участка</Label>
              <RadioGroup
                value={locationCoefficient.toString()}
                onValueChange={(value) => setLocationCoefficient(Number.parseFloat(value))}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="location-1" />
                  <Label htmlFor="location-1" className="text-sm">
                    Москва и до ЦКАД (коэффициент 1)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1.5" id="location-1.5" />
                  <Label htmlFor="location-1.5" className="text-sm">
                    ЦКАД + 20 км (коэффициент 1,5)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="location-2" />
                  <Label htmlFor="location-2" className="text-sm">
                    более 20 км от ЦКАД (коэффициент 2)
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-gray-500 mt-2">• Стоимость работ умножается на коэффициент удаленности</p>
            </div>
          </div>

          <Button
            onClick={calculatePrice}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
          >
            Рассчитать стоимость
          </Button>

          {calculatedPrice !== null && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 mb-2">Стоимость работ:</p>
                <p className="text-3xl font-bold text-red-600">{calculatedPrice.toLocaleString()} ₽</p>
                <p className="text-sm text-gray-500 mt-2">Наш специалист свяжется с вами для уточнения деталей</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium mb-2">Связаться с нами:</p>
                <div className="flex flex-col space-y-2">
                  <a
                    href="https://wa.me/79296727849"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-white bg-green-500 hover:bg-green-600 transition-colors px-4 py-2 rounded-md text-sm"
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
                    className="flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-md text-sm"
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
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
