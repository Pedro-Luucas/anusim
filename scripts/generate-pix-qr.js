const QRCode = require("qrcode-generator")

function generatePixPayload(params) {
  const { pixKey, merchantName, merchantCity, txid = "***", amount } = params

  const merchantNameTruncated = merchantName.slice(0, 25)
  const merchantCityUpperCase = merchantCity.toUpperCase()

  const payloadFieldValue = (id, value) => {
    const len = value.length.toString().padStart(2, "0")
    return `${id}${len}${value}`
  }

  const pixKeyField = payloadFieldValue("01", pixKey)
  const merchantAccountInformation = payloadFieldValue(
    "26",
    payloadFieldValue("00", "br.gov.bcb.pix") + pixKeyField
  )

  const merchantCategoryCode = payloadFieldValue("52", "0000")
  const transactionCurrency = payloadFieldValue("53", "986")
  const transactionAmountField = amount ? payloadFieldValue("54", amount) : ""
  const countryCode = payloadFieldValue("58", "BR")
  const merchantNameField = payloadFieldValue("59", merchantNameTruncated)
  const merchantCityField = payloadFieldValue("60", merchantCityUpperCase)
  const additionalDataField = payloadFieldValue("62", payloadFieldValue("05", txid))

  const payloadWithoutCrc =
    "000201" +
    merchantAccountInformation +
    merchantCategoryCode +
    transactionCurrency +
    transactionAmountField +
    countryCode +
    merchantNameField +
    merchantCityField +
    additionalDataField +
    "6304"

  const crc16 = calculateCRC16CCITT(payloadWithoutCrc)
  return payloadWithoutCrc + crc16
}

function calculateCRC16CCITT(payload) {
  let crc = 0xffff
  const polynomial = 0x1021

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial
      } else {
        crc = crc << 1
      }
    }
  }

  crc = crc & 0xffff
  return crc.toString(16).toUpperCase().padStart(4, "0")
}

function generateQRCodeSVG(data) {
  const qr = QRCode(0, "M")
  qr.addData(data)
  qr.make()

  const moduleCount = qr.getModuleCount()
  const size = moduleCount

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">\n`
  svg += `  <rect width="${size}" height="${size}" fill="#ffffff"/>\n`

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        svg += `  <rect x="${col}" y="${row}" width="1" height="1" fill="#000000"/>\n`
      }
    }
  }

  svg += `</svg>`
  return svg
}

const payload = generatePixPayload({
  pixKey: "criciuma@anussimbrasil.com.br",
  merchantName: "ANUSSIM BRASIL CRICIUMA",
  merchantCity: "CRICIUMA",
})

console.log("Generated PIX Payload:", payload)
console.log("Payload length:", payload.length)

const payloadWithoutCrc = payload.slice(0, -4)
const providedCrc = payload.slice(-4)
const calculatedCrc = calculateCRC16CCITT(payloadWithoutCrc)

console.log("\nCRC Validation:")
console.log("Provided CRC:", providedCrc)
console.log("Calculated CRC:", calculatedCrc)
console.log("Match:", providedCrc === calculatedCrc ? "✓ PASS" : "✗ FAIL")

if (providedCrc !== calculatedCrc) {
  console.error("\n✗ CRC mismatch! Exiting.")
  process.exit(1)
}

console.log("\nGenerating QR Code SVG...")
const svg = generateQRCodeSVG(payload)

const fs = require("fs")
const path = require("path")

const outputPath = path.join(__dirname, "..", "public", "pix-qrcode.svg")
fs.writeFileSync(outputPath, svg)
console.log("✓ QR Code saved to:", outputPath)
