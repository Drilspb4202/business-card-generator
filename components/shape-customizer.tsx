import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ShapeCustomizerProps {
  element: string
  shape: string
  borderRadius: number
  rotation: number
  opacity: number
  onShapeChange: (value: string) => void
  onBorderRadiusChange: (value: number) => void
  onRotationChange: (value: number) => void
  onOpacityChange: (value: number) => void
}

export function ShapeCustomizer({
  element,
  shape,
  borderRadius,
  rotation,
  opacity,
  onShapeChange,
  onBorderRadiusChange,
  onRotationChange,
  onOpacityChange,
}: ShapeCustomizerProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Форма {element}</Label>
        <Select value={shape} onValueChange={onShapeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите форму" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">Квадрат</SelectItem>
            <SelectItem value="circle">Круг</SelectItem>
            <SelectItem value="hexagon">Шестиугольник</SelectItem>
            <SelectItem value="custom">Своя форма</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Скругление углов</Label>
        <Slider
          min={0}
          max={50}
          step={1}
          value={[borderRadius]}
          onValueChange={(value) => onBorderRadiusChange(value[0])}
        />
      </div>

      <div className="space-y-2">
        <Label>Поворот</Label>
        <Slider
          min={0}
          max={360}
          step={1}
          value={[rotation]}
          onValueChange={(value) => onRotationChange(value[0])}
        />
      </div>

      <div className="space-y-2">
        <Label>Прозрачность</Label>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[opacity]}
          onValueChange={(value) => onOpacityChange(value[0])}
        />
      </div>
    </div>
  )
} 