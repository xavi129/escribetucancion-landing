import type { Metadata } from "next"
import Link from "next/link"
import { FileText, Mail, Phone, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Términos y Condiciones | EscribeTuCancion",
  description: "Términos y condiciones de uso del servicio de EscribeTuCancion. Conoce las reglas y condiciones para el uso de nuestros servicios.",
  keywords: "términos y condiciones, condiciones de uso, servicio, canciones personalizadas",
  openGraph: {
    title: "Términos y Condiciones | EscribeTuCancion",
    description: "Términos y condiciones de uso del servicio de EscribeTuCancion.",
    type: "website",
    locale: "es_MX",
    url: "https://escribetucancion.com/terminos-y-condiciones",
    siteName: "EscribeTuCancion",
    images: [
      {
        url: "https://escribetucancion.com/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "EscribeTuCancion - Términos y Condiciones",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Términos y Condiciones | EscribeTuCancion",
    description: "Términos y condiciones de uso del servicio de EscribeTuCancion.",
    images: ["https://escribetucancion.com/placeholder-logo.png"],
  },
  alternates: {
    canonical: "https://escribetucancion.com/terminos-y-condiciones",
  },
}

export default function TerminosCondiciones() {
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
            <FileText className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Términos y Condiciones
            </h1>
          </div>
          <p className="text-slate-400">
            Última actualización: {new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          {/* Aceptación */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de los Términos</h2>
            <p className="text-slate-300 leading-relaxed">
              Al acceder y utilizar el sitio web y los servicios de <strong className="text-white">EscribeTuCancion</strong> (&quot;nosotros&quot;, &quot;nuestro&quot; o &quot;la empresa&quot;),
              aceptas cumplir y estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos,
              te pedimos que no utilices nuestros servicios.
            </p>
          </section>

          {/* Descripción del servicio */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">2. Descripción del Servicio</h2>
            <p className="text-slate-300 leading-relaxed">
              EscribeTuCancion es un servicio de creación de canciones personalizadas. Nuestro servicio permite a los usuarios
              solicitar canciones originales basadas en sus historias, emociones y preferencias musicales. El producto final es
              un archivo de audio digital con la canción personalizada.
            </p>
          </section>

          {/* Uso del servicio */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">3. Uso del Servicio</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Al utilizar nuestros servicios, te comprometes a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Proporcionar información veraz y precisa para la creación de tu canción</li>
              <li>No utilizar el servicio para fines ilegales o no autorizados</li>
              <li>No reproducir, duplicar o explotar comercialmente cualquier parte del servicio sin autorización</li>
              <li>No intentar interferir con el funcionamiento normal del sitio web o servicio</li>
              <li>Ser mayor de 18 años o contar con el consentimiento de un padre o tutor legal</li>
            </ul>
          </section>

          {/* Propiedad intelectual */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">4. Propiedad Intelectual</h2>
            <p className="text-slate-300 leading-relaxed">
              Las canciones creadas por EscribeTuCancion son obras originales. Una vez completado el pago, el cliente
              recibe una licencia de uso personal de la canción. EscribeTuCancion se reserva los derechos de autor sobre
              la composición musical y la producción.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              El cliente puede utilizar la canción para uso personal, incluyendo compartirla en redes sociales y eventos privados.
              El uso comercial de la canción requiere autorización expresa y por escrito de EscribeTuCancion.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              Todo el contenido del sitio web, incluyendo pero no limitado a textos, gráficos, logotipos, imágenes y software,
              es propiedad de EscribeTuCancion y está protegido por las leyes de propiedad intelectual aplicables.
            </p>
          </section>

          {/* Pagos */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">5. Pagos y Facturación</h2>
            <p className="text-slate-300 leading-relaxed">
              Los precios de nuestros servicios se muestran en el sitio web y pueden estar sujetos a cambios sin previo aviso.
              El pago se procesa de forma segura a través de proveedores de pago autorizados. Al realizar un pago,
              aceptas los términos del procesador de pago correspondiente.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              Todos los precios incluyen los impuestos aplicables según la legislación mexicana vigente.
              Para consultas sobre facturación, contáctanos a través de los medios indicados en la sección de contacto.
            </p>
          </section>

          {/* Proceso de entrega */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">6. Proceso de Entrega</h2>
            <p className="text-slate-300 leading-relaxed">
              Una vez confirmado el pago y proporcionada toda la información necesaria, procederemos a crear tu canción personalizada.
              Los tiempos de entrega pueden variar según la complejidad del pedido y la demanda actual.
              Te mantendremos informado sobre el progreso de tu pedido.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              La canción se entregará en formato digital a través de los medios acordados (correo electrónico, WhatsApp o descarga directa desde la plataforma).
            </p>
          </section>

          {/* Limitación de responsabilidad */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">7. Limitación de Responsabilidad</h2>
            <p className="text-slate-300 leading-relaxed">
              EscribeTuCancion se esfuerza por brindar un servicio de alta calidad. Sin embargo, no garantizamos que
              el servicio sea ininterrumpido, oportuno, seguro o libre de errores. En la máxima medida permitida por la ley,
              EscribeTuCancion no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten
              del uso o la incapacidad de usar nuestros servicios.
            </p>
          </section>

          {/* Modificaciones */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">8. Modificaciones a los Términos</h2>
            <p className="text-slate-300 leading-relaxed">
              Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento.
              Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.
              El uso continuado de nuestros servicios después de la publicación de los cambios constituye tu aceptación
              de los términos modificados. Te recomendamos revisar estos términos periódicamente.
            </p>
          </section>

          {/* Ley aplicable */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">9. Ley Aplicable y Jurisdicción</h2>
            <p className="text-slate-300 leading-relaxed">
              Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de los Estados Unidos Mexicanos.
              Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción de los tribunales
              competentes de la ciudad de Tijuana, Baja California, México.
            </p>
          </section>

          {/* Contacto */}
          <section className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-6 sm:p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">10. Contacto</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Si tienes preguntas o comentarios sobre estos Términos y Condiciones, puedes contactarnos a través de:
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
