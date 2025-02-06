import QRCode from "qrcode"

export async function generateQRCodeSVG(text: string, style: string = "modern1"): Promise<string> {
  const options = {
    errorCorrectionLevel: "H",
    type: "svg",
    margin: 1,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  }

  try {
    const qrCode = await QRCode.toString(text, options)
    return qrCode
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw error
  }
}

function generateDefaultStyle(modules: boolean[][], moduleCount: number): string {
  let path = ""
  for (let y = 0; y < moduleCount; y++) {
    for (let x = 0; x < moduleCount; x++) {
      if (modules[y][x]) {
        path += `M${x},${y}h1v1h-1z`
      }
    }
  }
  return `<path d="${path}" fill="black"/>`
}

function generateModern1Style(modules: boolean[][], moduleCount: number): string {
  let path = ""
  for (let y = 0; y < moduleCount; y++) {
    for (let x = 0; x < moduleCount; x++) {
      if (modules[y][x]) {
        path += `M${x + 0.1},${y + 0.1}h0.8v0.8h-0.8z`
      }
    }
  }
  return `<path d="${path}" fill="black" stroke="none"><animate attributeName="fill" values="black;#3498db;black" dur="3s" repeatCount="indefinite"/></path>`
}

function generateModern2Style(modules: boolean[][], moduleCount: number): string {
  let path = ""
  for (let y = 0; y < moduleCount; y++) {
    for (let x = 0; x < moduleCount; x++) {
      if (modules[y][x]) {
        path += `M${x + 0.5},${y + 0.5}l0.4,-0.4l0.1,0.9l-0.9,-0.1z`
      }
    }
  }
  return `<path d="${path}" fill="#e74c3c" stroke="none"><animate attributeName="fill" values="#e74c3c;#f39c12;#e74c3c" dur="4s" repeatCount="indefinite"/></path>`
}

function generateModern3Style(modules: boolean[][], moduleCount: number): string {
  let circles = ""
  for (let y = 0; y < moduleCount; y++) {
    for (let x = 0; x < moduleCount; x++) {
      if (modules[y][x]) {
        circles += `<circle cx="${x + 0.5}" cy="${y + 0.5}" r="0.4"><animate attributeName="r" values="0.4;0.2;0.4" dur="2s" repeatCount="indefinite"/></circle>`
      }
    }
  }
  return `<g fill="#2ecc71">${circles}</g>`
}

