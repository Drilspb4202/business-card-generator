"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { generateWithGemini } from "@/lib/gemini"
import { toast } from "sonner"

interface AISuggestionsProps {
  onApplySuggestion: (suggestion: any) => void
}

const businessCardPrompt = (description: string) => `
Создай современный дизайн визитки на основе описания: "${description}".
Ответ должен быть в формате JSON и содержать следующие параметры:
{
  "backgroundColor": "цвет фона (hex)",
  "textColor": "цвет текста (hex)",
  "fontFamily": "название шрифта",
  "name": {
    "text": "имя",
    "x": число,
    "y": число,
    "size": размер шрифта
  },
  "title": {
    "text": "должность",
    "x": число,
    "y": число,
    "size": размер шрифта
  },
  "company": {
    "text": "компания",
    "x": число,
    "y": число,
    "size": размер шрифта
  },
  "email": {
    "text": "email",
    "x": число,
    "y": число,
    "size": размер шрифта
  },
  "phone": {
    "text": "телефон",
    "x": число,
    "y": число,
    "size": размер шрифта
  },
  "website": {
    "text": "сайт",
    "x": число,
    "y": число,
    "size": размер шрифта
  },
  "profileImage": {
    "style": {
      "shape": "форма (circle, square, hexagon)",
      "borderRadius": число,
      "rotation": число,
      "opacity": число
    }
  },
  "logoImage": {
    "style": {
      "shape": "форма",
      "borderRadius": число,
      "rotation": число,
      "opacity": число
    }
  },
  "designStyle": {
    "pattern": "паттерн фона (dots, lines, grid, none)",
    "overlay": "тип оверлея (gradient, vignette, none)",
    "gradientColors": ["цвет1 (hex)", "цвет2 (hex)"],
    "borderStyle": "стиль рамки (solid, double, dashed, none)",
    "fontFamily": "название шрифта"
  }
}

Создай уникальный и креативный дизайн, учитывая современные тренды.
Используй реальные значения вместо placeholder-ов:
- Для координат (x, y): числа от 0 до 400 для x и от 0 до 350 для y
- Для размеров шрифта: числа от 12 до 48
- Для цветов: реальные hex-коды (#RRGGBB)
- Для форм: одно из значений "circle", "square", "hexagon"
- Для паттернов: одно из значений "dots", "lines", "grid", "none"
- Для оверлеев: одно из значений "gradient", "vignette", "none"
- Для стилей рамки: одно из значений "solid", "double", "dashed", "none"
- Для шрифтов: используй реальные веб-шрифты (Arial, Helvetica, Roboto, etc.)
`

export function AISuggestions({ onApplySuggestion }: AISuggestionsProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateDesign = async () => {
    if (!prompt) {
      toast.error("Пожалуйста, введите описание для генерации дизайна")
      return
    }

    setIsGenerating(true)
    try {
      const response = await generateWithGemini(prompt)
      let design
      try {
        design = JSON.parse(response)
      } catch (parseError) {
        console.error("Error parsing response:", parseError)
        toast.error("Ошибка при обработке ответа от AI. Попробуйте другое описание.")
        return
      }

      // Проверяем наличие необходимых полей
      if (!design.backgroundColor || !design.textColor || !design.name) {
        toast.error("Некорректный формат ответа от AI. Попробуйте другое описание.")
        return
      }

      // Добавляем значения по умолчанию для отсутствующих полей
      const defaultDesign = {
        backgroundColor: "#ffffff",
        textColor: "#000000",
        name: { text: "", x: 20, y: 160, size: 24, font: "Arial" },
        title: { text: "", x: 20, y: 190, size: 18, font: "Arial" },
        company: { text: "", x: 20, y: 220, size: 18, font: "Arial" },
        email: { text: "", x: 20, y: 250, size: 16, font: "Arial" },
        phone: { text: "", x: 20, y: 280, size: 16, font: "Arial" },
        website: { text: "", x: 20, y: 310, size: 16, font: "Arial" },
        profileImage: {
          style: {
            shape: "circle",
            shadow: false,
            shadowBlur: 10,
          }
        },
        logoImage: {
          style: {
            shape: "square",
            shadow: false,
            shadowBlur: 10,
          }
        },
        designStyle: {
          pattern: "none",
          overlay: "none",
          gradientColors: ["#ffffff", "#f0f0f0"],
          borderStyle: "none",
          backgroundGradient: false,
          backgroundGradientType: "linear",
          backgroundGradientAngle: 45,
        }
      }

      // Объединяем полученный дизайн с дефолтными значениями
      const finalDesign = {
        ...defaultDesign,
        ...design,
        designStyle: {
          ...defaultDesign.designStyle,
          ...(design.designStyle || {}),
        },
        profileImage: {
          ...defaultDesign.profileImage,
          ...(design.profileImage || {}),
          style: {
            ...defaultDesign.profileImage.style,
            ...(design.profileImage?.style || {}),
          }
        },
        logoImage: {
          ...defaultDesign.logoImage,
          ...(design.logoImage || {}),
          style: {
            ...defaultDesign.logoImage.style,
            ...(design.logoImage?.style || {}),
          }
        }
      }

      onApplySuggestion(finalDesign)
      toast.success("Дизайн успешно сгенерирован!")
    } catch (error) {
      console.error("Error generating design:", error)
      toast.error("Ошибка при генерации дизайна. Попробуйте другое описание.")
    } finally {
      setIsGenerating(false)
    }
  }

  const examplePrompts = [
    "Создай современную минималистичную визитку для IT-специалиста в светлых тонах с акцентом на технологичность",
    "Разработай креативный дизайн для фотографа с градиентами и элегантным расположением элементов",
    "Сгенерируй элегантную визитку для юриста в классическом стиле с золотыми акцентами и строгой типографикой",
    "Создай яркую визитку для дизайнера с современными элементами и креативным расположением текста",
    "Сделай стильную визитку для архитектора с геометрическими паттернами и минималистичным дизайном",
    "Создай визитку для врача в спокойных тонах с акцентом на профессионализм и заботу",
    "Разработай визитку для ресторана с элегантными шрифтами и аппетитной цветовой гаммой",
    "Сгенерируй визитку для фитнес-тренера в энергичных тонах с динамичным дизайном",
    "Создай визитку для свадебного фотографа с романтическими элементами и нежной цветовой палитрой",
    "Разработай визитку для бизнес-консультанта с профессиональным и современным дизайном"
  ]

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="space-y-2">
          <Label className="text-lg font-semibold">Опишите желаемый дизайн визитки</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Например: Современная визитка для IT-специалиста..."
              className="flex-1"
            />
            <Button
              onClick={generateDesign}
              disabled={isGenerating}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? "Генерация..." : "Создать"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold">Примеры запросов:</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {examplePrompts.map((examplePrompt) => (
              <Button
                key={examplePrompt}
                variant="outline"
                onClick={() => setPrompt(examplePrompt)}
                className="text-left h-auto p-3 whitespace-normal hover:bg-accent transition-colors"
              >
                {examplePrompt}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

