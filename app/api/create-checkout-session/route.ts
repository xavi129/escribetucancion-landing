import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
})

// Supported currencies for Stripe
const SUPPORTED_CURRENCIES = ["mxn", "usd", "eur", "cop", "clp", "crc", "pen", "ars", "pab", "gtq", "brl", "uyu", "bob", "pyg", "dop", "hnl", "nio"] as const
type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number]

// Zero-decimal currencies (amounts should NOT be multiplied by 100)
// https://stripe.com/docs/currencies#zero-decimal
const ZERO_DECIMAL_CURRENCIES = ["clp", "pyg"] as const

function isValidCurrency(currency: string): currency is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(currency.toLowerCase() as SupportedCurrency)
}

function isZeroDecimalCurrency(currency: string): boolean {
  return ZERO_DECIMAL_CURRENCIES.includes(currency.toLowerCase() as typeof ZERO_DECIMAL_CURRENCIES[number])
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency, songType, deliveryType, customerName, email, referenceId } = body

    // Validate and normalize amount
    const parsedAmount = Number(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "El monto debe ser un número válido mayor a 0" },
        { status: 400 }
      )
    }

    // Validate and normalize currency (default to MXN if missing or invalid)
    const normalizedCurrency = currency && isValidCurrency(currency)
      ? currency.toLowerCase() as SupportedCurrency
      : "mxn"

    // Convert to smallest currency unit for Stripe
    // Zero-decimal currencies (CLP, PYG) don't have subunits, so use amount as-is
    // Other currencies need to be multiplied by 100 to convert to cents
    const normalizedAmount = isZeroDecimalCurrency(normalizedCurrency)
      ? Math.round(parsedAmount)
      : Math.round(parsedAmount * 100)

    // Crear una sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: normalizedCurrency,
            product_data: {
              name: `Canción Personalizada - Adelanto`,
              description: `Adelanto para canción personalizada ${deliveryType === "express" ? "con entrega rápida" : "con entrega estándar"}`,
            },
            unit_amount: normalizedAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/crear-cancion/confirmacion?session_id={CHECKOUT_SESSION_ID}&reference=${referenceId}`,
      cancel_url: `${request.headers.get("origin")}/crear-cancion?canceled=true`,
      metadata: {
        songType,
        deliveryType,
        customerName,
        referenceId,
        currency: normalizedCurrency,
      },
      customer_email: email || undefined,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error al crear la sesión de checkout:", error)
    return NextResponse.json({ error: "Error al crear la sesión de checkout" }, { status: 500 })
  }
}

