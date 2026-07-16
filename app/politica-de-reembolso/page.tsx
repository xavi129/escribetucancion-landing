import type { Metadata } from "next"
import Link from "next/link"
import { RefreshCw, Mail, Phone, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Política de Reembolso | EscribeTuCancion",
  description: "Política de reembolso de EscribeTuCancion. Conoce las condiciones y procedimientos para solicitar un reembolso.",
  keywords: "política de reembolso, devoluciones, reembolso, canciones personalizadas",
  openGraph: {
    title: "Política de Reembolso | EscribeTuCancion",
    description: "Política de reembolso de EscribeTuCancion. Conoce las condiciones para solicitar un reembolso.",
    type: "website",
    locale: "es_MX",
    url: "https://escribetucancion.com/politica-de-reembolso",
    siteName: "EscribeTuCancion",
    images: [
      {
        url: "https://escribetucancion.com/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "EscribeTuCancion - Política de Reembolso",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Política de Reembolso | EscribeTuCancion",
    description: "Política de reembolso de EscribeTuCancion. Conoce las condiciones para solicitar un reembolso.",
    images: ["https://escribetucancion.com/placeholder-logo.png"],
  },
  alternates: {
    canonical: "https://escribetucancion.com/politica-de-reembolso",
  },
}

export default function PoliticaReembolso() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-6 text-slate-400 hover:text-white"
            asChild
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Política de Reembolso
            </h1>
          </div>
          <p className="text-slate-400">
            Última actualización: {new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          {/* Alcance */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">1. Alcance</h2>
            <p className="text-slate-300 leading-relaxed">
              Esta Política de Reembolso aplica a todos los servicios ofrecidos por <strong className="text-white">EscribeTuCancion</strong>,
              incluyendo la creación de canciones personalizadas. Al realizar una compra en nuestro sitio web,
              aceptas los términos descritos en esta política.
            </p>
          </section>

          {/* Naturaleza del producto */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">2. Naturaleza del Producto</h2>
            <p className="text-slate-300 leading-relaxed">
              Nuestros productos son canciones personalizadas, es decir, productos digitales creados a medida según las
              especificaciones de cada cliente. Debido a la naturaleza personalizada de nuestro servicio, cada canción es
              única y se crea específicamente para ti.
            </p>
          </section>

          {/* Condiciones de reembolso */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">3. Condiciones de Reembolso</h2>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1. Reembolso completo</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Podrás solicitar un reembolso completo en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Si cancelas tu pedido antes de que hayamos comenzado la producción de tu canción</li>
              <li>Si se presenta un error técnico de nuestra parte que impida la entrega del producto</li>
              <li>Si el producto entregado es sustancialmente diferente a lo solicitado y no podemos corregirlo</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.2. Reembolso parcial</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              En ciertos casos, podemos ofrecer un reembolso parcial:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Si la producción de tu canción ya ha comenzado pero no se ha completado al momento de la cancelación</li>
              <li>Si el producto requiere modificaciones significativas que van más allá de lo originalmente solicitado</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.3. Revisiones incluidas</h3>
            <p className="text-slate-300 leading-relaxed">
              Antes de considerar un reembolso, te ofrecemos la posibilidad de solicitar revisiones a tu canción.
              Trabajaremos contigo para asegurar que el resultado final cumpla con tus expectativas.
              Nuestro objetivo es que estés completamente satisfecho con tu canción personalizada.
            </p>
          </section>

          {/* Excepciones */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">4. Excepciones</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              No se otorgarán reembolsos en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Si la canción ya fue entregada y descargada, y cumple con las especificaciones solicitadas</li>
              <li>Si han transcurrido más de 30 días desde la fecha de compra</li>
              <li>Si el cliente proporcionó información incorrecta o incompleta que afectó el resultado final</li>
              <li>Si el cambio de opinión no está relacionado con la calidad del producto entregado</li>
            </ul>
          </section>

          {/* Proceso de solicitud */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">5. Proceso de Solicitud de Reembolso</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Para solicitar un reembolso, sigue estos pasos:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-slate-300">
              <li>Contáctanos a través de correo electrónico o WhatsApp indicando tu número de pedido</li>
              <li>Describe el motivo de tu solicitud de reembolso</li>
              <li>Nuestro equipo revisará tu solicitud dentro de las siguientes 48 horas hábiles</li>
              <li>Te notificaremos nuestra decisión y, en caso de aprobación, procesaremos el reembolso</li>
            </ol>
          </section>

          {/* Tiempos de procesamiento */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">6. Tiempos de Procesamiento</h2>
            <p className="text-slate-300 leading-relaxed">
              Una vez aprobado un reembolso, el procesamiento puede tomar entre 5 y 10 días hábiles dependiendo
              del método de pago utilizado y de la institución financiera correspondiente. El reembolso se realizará
              al mismo método de pago utilizado en la compra original.
            </p>
          </section>

          {/* Modificaciones */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">7. Modificaciones a esta Política</h2>
            <p className="text-slate-300 leading-relaxed">
              Nos reservamos el derecho de modificar esta Política de Reembolso en cualquier momento.
              Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.
              La política vigente al momento de tu compra será la que aplique a tu transacción.
            </p>
          </section>

          {/* Contacto */}
          <section className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-6 sm:p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">8. Contacto</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Si tienes preguntas sobre nuestra Política de Reembolso o deseas solicitar un reembolso, contáctanos a través de:
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-purple-400" />
                <a
                  href="mailto:support@example.com"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  support@example.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-purple-400" />
                <span>000000000000</span>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-8 border-t border-white/10">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border-white/20"
              asChild
            >
              <Link href="/" className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
