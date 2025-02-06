import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const DEFAULT_CARD_DESIGN = {
  name: { text: "", x: 20, y: 160, size: 24 },
  title: { text: "", x: 20, y: 190, size: 18 },
  company: { text: "", x: 20, y: 220, size: 18 },
  backgroundColor: "#ffffff",
  textColor: "#000000",
  qrCodeStyle: "modern1",
  qrCodePosition: { x: 280, y: 230, size: 100 },
}

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "Gemini API key not configured" }, { status: 500 })
  }

  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const systemPrompt = `
      Act as a business card design expert. Based on the following description, suggest a business card design.
      Description: ${prompt}
      
      Respond ONLY with a valid JSON object in the following format, no other text:
      {
        "name": {"x": number, "y": number, "size": number},
        "title": {"x": number, "y": number, "size": number},
        "company": {"x": number, "y": number, "size": number},
        "backgroundColor": "string (hex color)",
        "textColor": "string (hex color)",
        "qrCodeStyle": "string (one of: modern1, modern2, modern3)",
        "qrCodePosition": {"x": number, "y": number, "size": number}
      }
    `

    const result = await model.generateContent(systemPrompt)
    const response = result.response
    const text = response.text()

    try {
      // Remove code block markers if present
      const cleanedText = text.replace(/^```json\n|\n```$/g, "").trim()
      const data = JSON.parse(cleanedText)
      return Response.json({
        ...DEFAULT_CARD_DESIGN,
        ...data,
      })
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError)
      console.error("Raw Response:", text)
      return Response.json({ error: "Failed to parse AI response", rawResponse: text }, { status: 500 })
    }
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Failed to generate card design" }, { status: 500 })
  }
}

