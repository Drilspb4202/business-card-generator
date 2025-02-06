"use client"

import type { ChangeEvent } from "react"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { DragDropImage } from "./drag-drop-image"
import { Slider } from "../../components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { ShapeCustomizer } from "./shape-customizer"
import { Switch } from "../../components/ui/switch"
import { ColorPicker } from "./color-picker"
import { motion } from "framer-motion"

interface CardCustomizerProps {
  cardData: any
  availableFonts: string[]
  onInputChange: (field: string, value: any) => void
  onFontChange: (field: string, font: string) => void
  onElementMove: (element: string, x: number, y: number) => void
  onElementResize: (element: string, size: number) => void
  onElementStyle: (element: string, styleProperty: string, value: any) => void
}

export default function CardCustomizer({
  cardData,
  availableFonts,
  onInputChange,
  onFontChange,
  onElementMove,
  onElementResize,
  onElementStyle,
}: CardCustomizerProps) {
  const textFields = [
    { key: "name", label: "Имя" },
    { key: "title", label: "Должность" },
    { key: "company", label: "Компания" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Телефон" },
    { key: "website", label: "Сайт" },
  ]

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0]
    if (file) {
      onInputChange(field, { ...cardData[field], file })
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="text">
            <AccordionTrigger>Текст и шрифты</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {textFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      value={cardData[field.key]?.text || ""}
                      onChange={(e) =>
                        onInputChange(field.key, {
                          ...cardData[field.key],
                          text: e.target.value,
                        })
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Шрифт</Label>
                        <Select
                          value={cardData[field.key]?.font || "Arial"}
                          onValueChange={(value) => onFontChange(field.key, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите шрифт" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFonts.map((font) => (
                              <SelectItem key={font} value={font}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Размер</Label>
                        <Slider
                          value={[cardData[field.key]?.size || 16]}
                          onValueChange={(value) => onElementResize(field.key, value[0])}
                          min={12}
                          max={48}
                          step={1}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Позиция X</Label>
                        <Slider
                          value={[cardData[field.key]?.x || 20]}
                          onValueChange={(value) =>
                            onElementMove(field.key, value[0], cardData[field.key]?.y || 20)
                          }
                          min={0}
                          max={400}
                          step={1}
                        />
                      </div>
                      <div>
                        <Label>Позиция Y</Label>
                        <Slider
                          value={[cardData[field.key]?.y || 20]}
                          onValueChange={(value) =>
                            onElementMove(field.key, cardData[field.key]?.x || 20, value[0])
                          }
                          min={0}
                          max={350}
                          step={1}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="services">
            <AccordionTrigger>Услуги</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {cardData.services?.map((service: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="space-y-4 p-4 border rounded-lg bg-card hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold">Услуга {index + 1}</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newServices = cardData.services.filter((_, i) => i !== index)
                          onInputChange("services", newServices)
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Название услуги</Label>
                      <Input
                        value={service.text}
                        onChange={(e) => {
                          const newServices = [...cardData.services]
                          newServices[index] = { ...service, text: e.target.value }
                          onInputChange("services", newServices)
                        }}
                        placeholder="Введите название услуги"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Шрифт</Label>
                        <Select
                          value={service.font}
                          onValueChange={(value) => {
                            const newServices = [...cardData.services]
                            newServices[index] = { ...service, font: value }
                            onInputChange("services", newServices)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите шрифт" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFonts.map((font) => (
                              <SelectItem key={font} value={font}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Размер шрифта</Label>
                        <Slider
                          value={[service.size]}
                          onValueChange={(value) => {
                            const newServices = [...cardData.services]
                            newServices[index] = { ...service, size: value[0] }
                            onInputChange("services", newServices)
                          }}
                          min={12}
                          max={24}
                          step={1}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Позиция по горизонтали (X)</Label>
                      <Slider
                        value={[service.x]}
                        onValueChange={(value) => {
                          const newServices = [...cardData.services]
                          newServices[index] = { ...service, x: value[0] }
                          onInputChange("services", newServices)
                        }}
                        min={20}
                        max={380}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Позиция по вертикали (Y)</Label>
                      <Slider
                        value={[service.y]}
                        onValueChange={(value) => {
                          const newServices = [...cardData.services]
                          newServices[index] = { ...service, y: value[0] }
                          onInputChange("services", newServices)
                        }}
                        min={20}
                        max={330}
                        step={1}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Стиль текста</Label>
                        <Select
                          value={service.textStyle || "normal"}
                          onValueChange={(value) => {
                            const newServices = [...cardData.services]
                            newServices[index] = { ...service, textStyle: value }
                            onInputChange("services", newServices)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите стиль" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Обычный</SelectItem>
                            <SelectItem value="italic">Курсив</SelectItem>
                            <SelectItem value="bold">Жирный</SelectItem>
                            <SelectItem value="boldItalic">Жирный курсив</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Цвет текста</Label>
                        <ColorPicker
                          color={service.color || cardData.textColor}
                          onChange={(color) => {
                            const newServices = [...cardData.services]
                            newServices[index] = { ...service, color }
                            onInputChange("services", newServices)
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Эффекты</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={service.underline}
                            onCheckedChange={(checked) => {
                              const newServices = [...cardData.services]
                              newServices[index] = { ...service, underline: checked }
                              onInputChange("services", newServices)
                            }}
                          />
                          <Label>Подчеркивание</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={service.shadow}
                            onCheckedChange={(checked) => {
                              const newServices = [...cardData.services]
                              newServices[index] = { ...service, shadow: checked }
                              onInputChange("services", newServices)
                            }}
                          />
                          <Label>Тень текста</Label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button
                  onClick={() => {
                    const newServices = [
                      ...(cardData.services || []),
                      {
                        text: "",
                        x: 20,
                        y: 280 + (cardData.services?.length || 0) * 30,
                        size: 14,
                        font: "Arial",
                      },
                    ]
                    onInputChange("services", newServices)
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  + Добавить услугу
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="design">
            <AccordionTrigger>Дизайн</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Цвет фона</Label>
                    <ColorPicker
                      color={cardData.backgroundColor}
                      onChange={(color) => onInputChange("backgroundColor", color)}
                    />
                  </div>
                  <div>
                    <Label>Цвет текста</Label>
                    <ColorPicker
                      color={cardData.textColor}
                      onChange={(color) => onInputChange("textColor", color)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Градиентный фон</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={cardData.designStyle.backgroundGradient}
                      onCheckedChange={(checked) =>
                        onInputChange("designStyle", {
                          ...cardData.designStyle,
                          backgroundGradient: checked,
                        })
                      }
                    />
                    <Label>Включить градиент</Label>
                  </div>
                  {cardData.designStyle.backgroundGradient && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <ColorPicker
                          color={cardData.designStyle.gradientColors[0]}
                          onChange={(color) => {
                            const newColors = [...cardData.designStyle.gradientColors]
                            newColors[0] = color
                            onInputChange("designStyle", {
                              ...cardData.designStyle,
                              gradientColors: newColors,
                            })
                          }}
                        />
                        <ColorPicker
                          color={cardData.designStyle.gradientColors[1]}
                          onChange={(color) => {
                            const newColors = [...cardData.designStyle.gradientColors]
                            newColors[1] = color
                            onInputChange("designStyle", {
                              ...cardData.designStyle,
                              gradientColors: newColors,
                            })
                          }}
                        />
                      </div>
                      <Select
                        value={cardData.designStyle.backgroundGradientType}
                        onValueChange={(value) =>
                          onInputChange("designStyle", {
                            ...cardData.designStyle,
                            backgroundGradientType: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Тип градиента" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linear">Линейный</SelectItem>
                          <SelectItem value="radial">Радиальный</SelectItem>
                        </SelectContent>
                      </Select>
                      {cardData.designStyle.backgroundGradientType === "linear" && (
                        <div>
                          <Label>Угол градиента</Label>
                          <Slider
                            value={[cardData.designStyle.backgroundGradientAngle]}
                            onValueChange={(value) =>
                              onInputChange("designStyle", {
                                ...cardData.designStyle,
                                backgroundGradientAngle: value[0],
                              })
                            }
                            min={0}
                            max={360}
                            step={1}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Паттерн</Label>
                  <Select
                    value={cardData.designStyle.pattern}
                    onValueChange={(value) =>
                      onInputChange("designStyle", {
                        ...cardData.designStyle,
                        pattern: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите паттерн" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Нет</SelectItem>
                      <SelectItem value="dots">Точки</SelectItem>
                      <SelectItem value="lines">Линии</SelectItem>
                      <SelectItem value="grid">Сетка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Оверлей</Label>
                  <Select
                    value={cardData.designStyle.overlay}
                    onValueChange={(value) =>
                      onInputChange("designStyle", {
                        ...cardData.designStyle,
                        overlay: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите оверлей" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Нет</SelectItem>
                      <SelectItem value="gradient">Градиент</SelectItem>
                      <SelectItem value="vignette">Виньетка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Рамка</Label>
                  <Select
                    value={cardData.designStyle.borderStyle}
                    onValueChange={(value) =>
                      onInputChange("designStyle", {
                        ...cardData.designStyle,
                        borderStyle: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите стиль рамки" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Нет</SelectItem>
                      <SelectItem value="solid">Сплошная</SelectItem>
                      <SelectItem value="double">Двойная</SelectItem>
                      <SelectItem value="dashed">Пунктирная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="images">
            <AccordionTrigger>Изображения</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Фото профиля</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profileImage")}
                  />
                  <div className="space-y-2">
                    <Label>Позиция X</Label>
                    <Slider
                      min={0}
                      max={300}
                      step={1}
                      value={[cardData.profileImage.x || 20]}
                      onValueChange={(value) =>
                        onInputChange("profileImage", {
                          ...cardData.profileImage,
                          x: value[0],
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Позиция Y</Label>
                    <Slider
                      min={0}
                      max={250}
                      step={1}
                      value={[cardData.profileImage.y || 20]}
                      onValueChange={(value) =>
                        onInputChange("profileImage", {
                          ...cardData.profileImage,
                          y: value[0],
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Размер</Label>
                    <Slider
                      min={50}
                      max={150}
                      step={1}
                      value={[cardData.profileImage.size || 100]}
                      onValueChange={(value) =>
                        onInputChange("profileImage", {
                          ...cardData.profileImage,
                          size: value[0],
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Форма</Label>
                    <Select
                      value={cardData.profileImage.style.shape}
                      onValueChange={(value) =>
                        onElementStyle("profileImage", "shape", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите форму" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circle">Круг</SelectItem>
                        <SelectItem value="square">Квадрат</SelectItem>
                        <SelectItem value="hexagon">Шестиугольник</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Тень</Label>
                    <Switch
                      checked={cardData.profileImage.style.shadow}
                      onCheckedChange={(checked) =>
                        onElementStyle("profileImage", "shadow", checked)
                      }
                    />
                  </div>
                  {cardData.profileImage.style.shadow && (
                    <div className="space-y-2">
                      <Label>Размытие тени</Label>
                      <Slider
                        value={[cardData.profileImage.style.shadowBlur]}
                        onValueChange={(value) =>
                          onElementStyle("profileImage", "shadowBlur", value[0])
                        }
                        min={0}
                        max={20}
                        step={1}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Логотип</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "logoImage")}
                  />
                  <div className="space-y-2">
                    <Label>Позиция X</Label>
                    <Slider
                      min={0}
                      max={300}
                      step={1}
                      value={[cardData.logoImage.x || 280]}
                      onValueChange={(value) =>
                        onInputChange("logoImage", {
                          ...cardData.logoImage,
                          x: value[0],
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Позиция Y</Label>
                    <Slider
                      min={0}
                      max={250}
                      step={1}
                      value={[cardData.logoImage.y || 20]}
                      onValueChange={(value) =>
                        onInputChange("logoImage", {
                          ...cardData.logoImage,
                          y: value[0],
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Размер</Label>
                    <Slider
                      min={50}
                      max={150}
                      step={1}
                      value={[cardData.logoImage.size || 100]}
                      onValueChange={(value) =>
                        onInputChange("logoImage", {
                          ...cardData.logoImage,
                          size: value[0],
                        })
                      }
                    />
                  </div>
                  <ShapeCustomizer
                    element="Логотип"
                    shape={cardData.logoImage.style.shape}
                    borderRadius={cardData.logoImage.style.borderRadius}
                    rotation={cardData.logoImage.style.rotation}
                    opacity={cardData.logoImage.style.opacity}
                    onShapeChange={(value) =>
                      onElementStyle("logoImage", "shape", value)
                    }
                    onBorderRadiusChange={(value) =>
                      onElementStyle("logoImage", "borderRadius", value)
                    }
                    onRotationChange={(value) =>
                      onElementStyle("logoImage", "rotation", value)
                    }
                    onOpacityChange={(value) =>
                      onElementStyle("logoImage", "opacity", value)
                    }
                  />
                </div>
                <div className="space-y-4">
                  <DragDropImage
                    onImageUpload={(file) => onInputChange("backgroundImage", file)}
                    label="Фоновое изображение"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

