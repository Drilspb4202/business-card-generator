import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBkJshGOF7i5Z9fi9RJaQGESVgkLPIqZ-I";

const genAI = new GoogleGenerativeAI(API_KEY);

const defaultDesign = {
  backgroundColor: "#ffffff",
  textColor: "#000000",
  fontFamily: "Arial",
  name: {
    text: "Иван Петров",
    x: 20,
    y: 160,
    size: 24
  },
  title: {
    text: "Senior Developer",
    x: 20,
    y: 190,
    size: 18
  },
  company: {
    text: "Tech Solutions",
    x: 20,
    y: 220,
    size: 18
  },
  email: {
    text: "ivan@example.com",
    x: 20,
    y: 250,
    size: 16
  },
  phone: {
    text: "+7 999 123-45-67",
    x: 20,
    y: 280,
    size: 16
  },
  website: {
    text: "www.example.com",
    x: 20,
    y: 310,
    size: 16
  },
  profileImage: {
    style: {
      shape: "circle",
      borderRadius: 50,
      rotation: 0,
      opacity: 100
    }
  },
  logoImage: {
    style: {
      shape: "square",
      borderRadius: 0,
      rotation: 0,
      opacity: 100
    }
  },
  designStyle: {
    pattern: "dots",
    overlay: "gradient",
    gradientColors: ["#4a90e2", "#50e3c2"],
    borderStyle: "solid",
    fontFamily: "Arial"
  }
};

export async function generateWithGemini(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const formattedPrompt = `Создай уникальный и креативный дизайн визитки для: "${prompt}".
    
    Проанализируй сферу деятельности и создай соответствующий стиль. Используй:
    - Подходящие цветовые сочетания для данной индустрии
    - Шрифты, отражающие характер бизнеса
    - Креативное расположение элементов
    - Уникальные визуальные акценты
    
    Верни ТОЛЬКО JSON-объект с такой структурой (замени примеры реальными значениями):
    {
      "backgroundColor": "#FFFFFF",
      "textColor": "#000000",
      "name": {
        "text": "Иван Петров",
        "x": 20,
        "y": 160,
        "size": 24,
        "font": "Arial"
      },
      "title": {
        "text": "Старший разработчик",
        "x": 20,
        "y": 190,
        "size": 18,
        "font": "Arial"
      },
      "company": {
        "text": "Tech Solutions",
        "x": 20,
        "y": 220,
        "size": 18,
        "font": "Arial"
      },
      "email": {
        "text": "ivan@example.com",
        "x": 20,
        "y": 250,
        "size": 16,
        "font": "Arial"
      },
      "phone": {
        "text": "+7 999 123-45-67",
        "x": 20,
        "y": 280,
        "size": 16,
        "font": "Arial"
      },
      "website": {
        "text": "www.example.com",
        "x": 20,
        "y": 310,
        "size": 16,
        "font": "Arial"
      },
      "profileImage": {
        "style": {
          "shape": "circle",
          "shadow": true,
          "shadowBlur": 10
        }
      },
      "logoImage": {
        "style": {
          "shape": "square",
          "shadow": true,
          "shadowBlur": 10
        }
      },
      "designStyle": {
        "pattern": "dots",
        "overlay": "gradient",
        "gradientColors": ["#4a90e2", "#50e3c2"],
        "borderStyle": "solid",
        "backgroundGradient": true,
        "backgroundGradientType": "linear",
        "backgroundGradientAngle": 45
      }
    }

    ВАЖНО:
    1. Верни только JSON, без дополнительного текста
    2. Используй только следующие значения:
       - Для shape: "circle", "square", "hexagon"
       - Для pattern: "dots", "lines", "grid", "none"
       - Для overlay: "gradient", "vignette", "none"
       - Для borderStyle: "solid", "double", "dashed", "none"
       - Для font: "Arial", "Helvetica", "Roboto", "Open Sans", "Montserrat", "Playfair Display"
       - Для координат x: от 20 до 380
       - Для координат y: от 20 до 330
       - Для размера шрифта: от 14 до 36
    3. Все цвета должны быть в формате HEX (#RRGGBB)
    4. Все числовые значения должны быть числами, не строками
    5. Все булевы значения должны быть true/false, не строками`

    const result = await model.generateContent(formattedPrompt)
    const response = await result.response
    const text = response.text()

    try {
      // Очищаем ответ от лишних символов и пробелов
      const cleanText = text.trim().replace(/```json|```/g, "")
      const parsedJson = JSON.parse(cleanText)
      return JSON.stringify(parsedJson)
    } catch (e) {
      console.error("Invalid JSON response:", text)
      throw new Error("Failed to parse AI response")
    }
  } catch (error) {
    console.error("Error generating with Gemini:", error)
    throw error
  }
}

export async function generateBusinessCardDesign(options: {
  style?: string;
  colors?: string[];
  businessType?: string;
  name?: string;
  position?: string;
  additionalDetails?: string;
}) {
  try {
    const {
      style = "modern",
      colors = ["#000000", "#FFFFFF"],
      businessType = "general",
      name = "",
      position = "",
      additionalDetails = ""
    } = options;

    const designPrompt = `Create a professional business card design with the following specifications:
    - Style: ${style} and minimalist design
    - Color scheme: Use these colors ${colors.join(', ')} in an elegant way
    - Industry focus: ${businessType}
    - Layout: Clean and balanced composition
    - Typography: Modern, readable fonts
    - Elements: Include subtle geometric patterns or minimal design elements
    ${name ? `- Name: ${name}` : ''}
    ${position ? `- Position: ${position}` : ''}
    ${additionalDetails ? `- Additional details: ${additionalDetails}` : ''}
    
    Important guidelines:
    - Maintain proper spacing and hierarchy
    - Use golden ratio for proportions
    - Ensure text is perfectly aligned
    - Add subtle design elements that enhance professionalism
    - Make sure the design is print-ready at 300 DPI
    - Standard business card size (3.5 x 2 inches)
    
    Please create a high-quality, professional design that would stand out while maintaining elegance and sophistication.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent(designPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating business card design:", error);
    throw error;
  }
}

export async function generateImageWithGemini(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw error;
  }
} 