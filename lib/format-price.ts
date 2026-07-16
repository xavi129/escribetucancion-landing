import { CurrencyCode, CURRENCY_CONFIGS } from "./currency-config"

export interface FormatPriceOptions {
  showDecimals?: boolean
  showCurrencyCode?: boolean
}

export function formatPrice(
  price: number,
  currency: CurrencyCode = "MXN",
  options: FormatPriceOptions = {}
): string {
  const config = CURRENCY_CONFIGS[currency]
  const {
    showDecimals = currency === "USD" || currency === "EUR",
    showCurrencyCode = true
  } = options

  const formatted = price.toLocaleString(config.locale, {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  })

  const priceWithSymbol = `${config.symbol}${formatted}`

  if (!showCurrencyCode) {
    return priceWithSymbol
  }

  return `${priceWithSymbol} ${config.code}`
}

export function formatPriceParts(price: number, currency: CurrencyCode) {
  const config = CURRENCY_CONFIGS[currency]
  const showDecimals = currency === "USD" || currency === "EUR"

  const amount = price.toLocaleString(config.locale, {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  })

  return {
    symbol: config.symbol,
    amount,
    code: currency,
    full: `${config.symbol}${amount} ${currency}`
  }
}
