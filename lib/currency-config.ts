export type CurrencyCode = "MXN" | "USD" | "EUR" | "COP" | "CLP" | "CRC" | "PEN" | "ARS" | "PAB" | "GTQ" | "BRL" | "UYU" | "BOB" | "PYG" | "DOP" | "HNL" | "NIO"

export interface CurrencyConfig {
  symbol: string
  code: CurrencyCode
  locale: string
  advance: number
  prices: {
    lite: number
    standard: number
    premium: number
    lite_original: number
    standard_original: number
    premium_original: number
    express_delivery: number
    spotify_upload: number
    video: number
    extra_editions: number
  }
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  MXN: {
    symbol: "$",
    code: "MXN",
    locale: "es-MX",
    advance: 90,
    prices: {
      lite: 199,
      standard: 349,
      premium: 899,
      lite_original: 499,
      standard_original: 1199,
      premium_original: 1599,
      express_delivery: 99,
      spotify_upload: 149,
      video: 99,
      extra_editions: 49
    }
  },
  USD: {
    symbol: "$",
    code: "USD",
    locale: "en-US",
    advance: 5,
    prices: {
      lite: 12,
      standard: 20,
      premium: 50,
      lite_original: 29,
      standard_original: 70,
      premium_original: 93,
      express_delivery: 6,
      spotify_upload: 9,
      video: 5,
      extra_editions: 3
    }
  },
  EUR: {
    symbol: "€",
    code: "EUR",
    locale: "es-ES",
    advance: 5,
    prices: {
      lite: 11,
      standard: 18,
      premium: 45,
      lite_original: 26,
      standard_original: 64,
      premium_original: 85,
      express_delivery: 6,
      spotify_upload: 8,
      video: 5,
      extra_editions: 3
    }
  },
  COP: {
    symbol: "$",
    code: "COP",
    locale: "es-CO",
    advance: 21000,
    prices: {
      lite: 46000,
      standard: 80000,
      premium: 207000,
      lite_original: 115000,
      standard_original: 276000,
      premium_original: 368000,
      express_delivery: 23000,
      spotify_upload: 34000,
      video: 23000,
      extra_editions: 11000
    }
  },
  CLP: {
    symbol: "$",
    code: "CLP",
    locale: "es-CL",
    advance: 4990,
    prices: {
      lite: 11990,
      standard: 19990,
      premium: 49990,
      lite_original: 27990,
      standard_original: 69990,
      premium_original: 89990,
      express_delivery: 5900,
      spotify_upload: 8990,
      video: 4990,
      extra_editions: 2990
    }
  },
  CRC: {
    symbol: "₡",
    code: "CRC",
    locale: "es-CR",
    advance: 2500,
    prices: {
      lite: 6000,
      standard: 10000,
      premium: 25000,
      lite_original: 15000,
      standard_original: 35000,
      premium_original: 47000,
      express_delivery: 3000,
      spotify_upload: 4500,
      video: 2500,
      extra_editions: 1500
    }
  },
  PEN: {
    symbol: "S/",
    code: "PEN",
    locale: "es-PE",
    advance: 18,
    prices: {
      lite: 44,
      standard: 74,
      premium: 185,
      lite_original: 107,
      standard_original: 259,
      premium_original: 344,
      express_delivery: 22,
      spotify_upload: 33,
      video: 18.50,
      extra_editions: 11
    }
  },
  ARS: {
    symbol: "$",
    code: "ARS",
    locale: "es-AR",
    advance: 5000,
    prices: {
      lite: 12000,
      standard: 20000,
      premium: 50000,
      lite_original: 29000,
      standard_original: 70000,
      premium_original: 93000,
      express_delivery: 5000,
      spotify_upload: 9000,
      video: 5000,
      extra_editions: 3000
    }
  },
  PAB: {
    symbol: "B/.",
    code: "PAB",
    locale: "es-PA",
    advance: 5,
    prices: {
      lite: 12,
      standard: 20,
      premium: 50,
      lite_original: 29,
      standard_original: 70,
      premium_original: 93,
      express_delivery: 6,
      spotify_upload: 9,
      video: 5,
      extra_editions: 3
    }
  },
  GTQ: {
    symbol: "Q",
    code: "GTQ",
    locale: "es-GT",
    advance: 38,
    prices: {
      lite: 92,
      standard: 154,
      premium: 385,
      lite_original: 223,
      standard_original: 539,
      premium_original: 716,
      express_delivery: 40,
      spotify_upload: 69,
      video: 38,
      extra_editions: 23
    }
  },
  BRL: {
    symbol: "R$",
    code: "BRL",
    locale: "pt-BR",
    advance: 28,
    prices: {
      lite: 69,
      standard: 116,
      premium: 290,
      lite_original: 168,
      standard_original: 406,
      premium_original: 539,
      express_delivery: 30,
      spotify_upload: 52,
      video: 28,
      extra_editions: 17
    }
  },
  UYU: {
    symbol: "$U",
    code: "UYU",
    locale: "es-UY",
    advance: 210,
    prices: {
      lite: 504,
      standard: 840,
      premium: 2100,
      lite_original: 1218,
      standard_original: 2940,
      premium_original: 3906,
      express_delivery: 220,
      spotify_upload: 378,
      video: 210,
      extra_editions: 126
    }
  },
  BOB: {
    symbol: "Bs.",
    code: "BOB",
    locale: "es-BO",
    advance: 34,
    prices: {
      lite: 82,
      standard: 138,
      premium: 345,
      lite_original: 200,
      standard_original: 483,
      premium_original: 641,
      express_delivery: 36,
      spotify_upload: 62,
      video: 34,
      extra_editions: 20
    }
  },
  PYG: {
    symbol: "₲",
    code: "PYG",
    locale: "es-PY",
    advance: 36000,
    prices: {
      lite: 88000,
      standard: 148000,
      premium: 370000,
      lite_original: 214000,
      standard_original: 518000,
      premium_original: 688000,
      express_delivery: 40000,
      spotify_upload: 66000,
      video: 36000,
      extra_editions: 22000
    }
  },
  DOP: {
    symbol: "RD$",
    code: "DOP",
    locale: "es-DO",
    advance: 300,
    prices: {
      lite: 720,
      standard: 1200,
      premium: 3000,
      lite_original: 1740,
      standard_original: 4200,
      premium_original: 5580,
      express_delivery: 320,
      spotify_upload: 540,
      video: 300,
      extra_editions: 180
    }
  },
  HNL: {
    symbol: "L",
    code: "HNL",
    locale: "es-HN",
    advance: 123,
    prices: {
      lite: 296,
      standard: 494,
      premium: 1235,
      lite_original: 716,
      standard_original: 1729,
      premium_original: 2297,
      express_delivery: 130,
      spotify_upload: 222,
      video: 123,
      extra_editions: 74
    }
  },
  NIO: {
    symbol: "C$",
    code: "NIO",
    locale: "es-NI",
    advance: 185,
    prices: {
      lite: 444,
      standard: 740,
      premium: 1850,
      lite_original: 1073,
      standard_original: 2590,
      premium_original: 3441,
      express_delivery: 200,
      spotify_upload: 333,
      video: 185,
      extra_editions: 111
    }
  }
}

export const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  // America del Norte
  MX: "MXN",
  US: "USD",
  // Europa (zona Euro)
  ES: "EUR",
  FR: "EUR",
  DE: "EUR",
  IT: "EUR",
  PT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  IE: "EUR",
  GR: "EUR",
  FI: "EUR",
  // America del Sur
  CO: "COP",
  CL: "CLP",
  PE: "PEN",
  AR: "ARS",
  BR: "BRL",
  UY: "UYU",
  BO: "BOB",
  PY: "PYG",
  // America Central
  CR: "CRC",
  PA: "PAB",
  GT: "GTQ",
  HN: "HNL",
  NI: "NIO",
  EC: "USD",
  SV: "USD",
  // Caribe
  DO: "DOP",
  PR: "USD"
}

export const DEFAULT_CURRENCY: CurrencyCode = "MXN"

export function getCurrencyForCountry(countryCode: string): CurrencyCode {
  return COUNTRY_TO_CURRENCY[countryCode?.toUpperCase()] || DEFAULT_CURRENCY
}

export function getCurrencyConfig(currency: CurrencyCode): CurrencyConfig {
  return CURRENCY_CONFIGS[currency]
}

export function getPricesForCurrency(currency: CurrencyCode) {
  return CURRENCY_CONFIGS[currency].prices
}
