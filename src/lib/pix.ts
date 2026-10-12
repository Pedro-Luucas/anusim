export function generatePixPayload(params: {
  pixKey: string
  merchantName: string
  merchantCity: string
  txid?: string
  amount?: string
}): string {
  const { pixKey, merchantName, merchantCity, txid = "***", amount } = params

  const merchantNameTruncated = merchantName.slice(0, 25)
  const merchantCityUpperCase = merchantCity.toUpperCase()

  const payloadFieldValue = (id: string, value: string): string => {
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
  const transactionAmountField = amount
    ? payloadFieldValue("54", amount)
    : ""
  const countryCode = payloadFieldValue("58", "BR")
  const merchantNameField = payloadFieldValue("59", merchantNameTruncated)
  const merchantCityField = payloadFieldValue("60", merchantCityUpperCase)
  const additionalDataField = payloadFieldValue(
    "62",
    payloadFieldValue("05", txid)
  )

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

export function calculateCRC16CCITT(payload: string): string {
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
