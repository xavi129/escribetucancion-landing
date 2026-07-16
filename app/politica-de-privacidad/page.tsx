import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Mail, Phone, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Política de Privacidad | EscribeTuCancion",
  description: "Política de privacidad de EscribeTuCancion. Conoce cómo protegemos y manejamos tus datos personales.",
  keywords: "política de privacidad, protección de datos, privacidad, datos personales, LFPDPPP",
  openGraph: {
    title: "Política de Privacidad | EscribeTuCancion",
    description: "Política de privacidad de EscribeTuCancion. Conoce cómo protegemos y manejamos tus datos personales.",
    type: "website",
    locale: "es_MX",
    url: "https://escribetucancion.com/politica-de-privacidad",
    siteName: "EscribeTuCancion",
    images: [
      {
        url: "https://escribetucancion.com/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "EscribeTuCancion - Política de Privacidad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Política de Privacidad | EscribeTuCancion",
    description: "Política de privacidad de EscribeTuCancion. Conoce cómo protegemos y manejamos tus datos personales.",
    images: ["https://escribetucancion.com/placeholder-logo.png"],
  },
  alternates: {
    canonical: "https://escribetucancion.com/politica-de-privacidad",
  },
}

export default function PoliticaPrivacidad() {
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
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Política de Privacidad
            </h1>
          </div>
          <p className="text-slate-400">
            Última actualización: {new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          {/* Introducción */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">1. Introducción</h2>
            <p className="text-slate-300 leading-relaxed">
              En <strong className="text-white">EscribeTuCancion</strong> ("nosotros", "nuestro" o "la empresa"), 
              nos comprometemos a proteger y respetar tu privacidad. Esta Política de Privacidad explica cómo 
              recopilamos, usamos, divulgamos y protegemos tu información personal cuando utilizas nuestro servicio 
              de creación de canciones personalizadas a través de nuestra aplicación de Facebook Messenger y nuestro 
              sitio web.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              Al utilizar nuestros servicios, aceptas la recopilación y el uso de información de acuerdo con esta política. 
              Si no estás de acuerdo con alguna parte de esta política, por favor no utilices nuestros servicios.
            </p>
          </section>

          {/* Información que recopilamos */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">2. Información que Recopilamos</h2>
            
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1. Información que nos proporcionas directamente</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong className="text-white">Datos de contacto:</strong> Nombre, número de teléfono, dirección de correo electrónico</li>
              <li><strong className="text-white">Información de la canción:</strong> Detalles, anécdotas, nombres, fechas especiales y otra información personal que compartes para crear tu canción personalizada</li>
              <li><strong className="text-white">Información de pago:</strong> Datos de facturación y método de pago (procesados de forma segura a través de Stripe)</li>
              <li><strong className="text-white">Comunicaciones:</strong> Mensajes que nos envías a través de Facebook Messenger, WhatsApp o correo electrónico</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2. Información recopilada automáticamente</h3>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong className="text-white">Datos de uso:</strong> Cómo interactúas con nuestra aplicación y sitio web</li>
              <li><strong className="text-white">Datos técnicos:</strong> Dirección IP, tipo de navegador, sistema operativo, páginas visitadas, tiempo de permanencia</li>
              <li><strong className="text-white">Cookies y tecnologías similares:</strong> Utilizamos cookies para mejorar tu experiencia y analizar el uso de nuestros servicios</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3. Información de Facebook</h3>
            <p className="text-slate-300 leading-relaxed">
              Cuando utilizas nuestra aplicación de Facebook Messenger, podemos recibir información de tu perfil de Facebook, 
              incluyendo tu nombre, foto de perfil y ID de usuario, según los permisos que otorgues.
            </p>
          </section>

          {/* Cómo usamos tu información */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">3. Cómo Utilizamos tu Información</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Utilizamos la información recopilada para los siguientes propósitos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong className="text-white">Proporcionar nuestros servicios:</strong> Crear y entregar tu canción personalizada</li>
              <li><strong className="text-white">Procesar pagos:</strong> Gestionar transacciones y procesar pagos de forma segura</li>
              <li><strong className="text-white">Comunicación:</strong> Responder a tus consultas, enviar actualizaciones sobre tu pedido y proporcionar soporte al cliente</li>
              <li><strong className="text-white">Mejora de servicios:</strong> Analizar el uso de nuestros servicios para mejorar la experiencia del usuario</li>
              <li><strong className="text-white">Marketing:</strong> Enviar promociones y ofertas especiales (solo con tu consentimiento)</li>
              <li><strong className="text-white">Cumplimiento legal:</strong> Cumplir con obligaciones legales y proteger nuestros derechos</li>
            </ul>
          </section>

          {/* Compartir información */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">4. Compartir tu Información</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              No vendemos tu información personal. Podemos compartir tu información solo en las siguientes circunstancias:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong className="text-white">Proveedores de servicios:</strong> Compartimos información con terceros que nos ayudan a operar nuestro negocio (procesadores de pago, servicios de hosting, servicios de análisis)</li>
              <li><strong className="text-white">Facebook:</strong> Como parte de la integración con Facebook Messenger, cierta información puede ser compartida con Facebook según sus políticas</li>
              <li><strong className="text-white">Requisitos legales:</strong> Cuando sea requerido por ley o para proteger nuestros derechos legales</li>
              <li><strong className="text-white">Con tu consentimiento:</strong> En cualquier otra situación con tu consentimiento explícito</li>
            </ul>
          </section>

          {/* Seguridad */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">5. Seguridad de tus Datos</h2>
            <p className="text-slate-300 leading-relaxed">
              Implementamos medidas de seguridad técnicas, administrativas y físicas apropiadas para proteger tu información 
              personal contra acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún método de 
              transmisión por Internet o almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar seguridad absoluta.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
              Utilizamos servicios de pago seguros (Stripe) que cumplen con los estándares PCI DSS para el procesamiento 
              de información de tarjetas de crédito.
            </p>
          </section>

          {/* Tus derechos */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">6. Tus Derechos</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              De acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) 
              de México y otras leyes aplicables, tienes los siguientes derechos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><strong className="text-white">Acceso:</strong> Solicitar una copia de los datos personales que tenemos sobre ti</li>
              <li><strong className="text-white">Rectificación:</strong> Corregir información inexacta o incompleta</li>
              <li><strong className="text-white">Cancelación:</strong> Solicitar la eliminación de tus datos personales</li>
              <li><strong className="text-white">Oposición:</strong> Oponerte al procesamiento de tus datos personales para ciertos fines</li>
              <li><strong className="text-white">Revocación:</strong> Revocar tu consentimiento en cualquier momento</li>
              <li><strong className="text-white">Portabilidad:</strong> Recibir tus datos en un formato estructurado y de uso común</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              Para ejercer estos derechos, contáctanos a través de los medios indicados en la sección de contacto.
            </p>
          </section>

          {/* Cookies */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies y Tecnologías de Seguimiento</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Mejorar la funcionalidad de nuestro sitio web</li>
              <li>Analizar el uso de nuestros servicios</li>
              <li>Personalizar tu experiencia</li>
              <li>Mostrar publicidad relevante (con tu consentimiento)</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              Puedes controlar las cookies a través de la configuración de tu navegador. Ten en cuenta que deshabilitar 
              cookies puede afectar la funcionalidad de nuestro sitio web.
            </p>
          </section>

          {/* Retención de datos */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">8. Retención de Datos</h2>
            <p className="text-slate-300 leading-relaxed">
              Conservamos tu información personal durante el tiempo necesario para cumplir con los propósitos descritos en 
              esta política, a menos que la ley requiera o permita un período de retención más largo. Cuando ya no necesitemos 
              tu información personal, la eliminaremos de forma segura.
            </p>
          </section>

          {/* Menores de edad */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">9. Privacidad de Menores</h2>
            <p className="text-slate-300 leading-relaxed">
              Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información personal 
              de menores de edad. Si descubrimos que hemos recopilado información de un menor sin el consentimiento de los padres, 
              tomaremos medidas para eliminar esa información de nuestros servidores.
            </p>
          </section>

          {/* Cambios a la política */}
          <section className="bg-white/5 rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">10. Cambios a esta Política</h2>
            <p className="text-slate-300 leading-relaxed">
              Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cualquier cambio 
              publicando la nueva política en esta página y actualizando la fecha de "Última actualización". Te recomendamos 
              revisar esta política periódicamente para estar informado sobre cómo protegemos tu información.
            </p>
          </section>

          {/* Contacto */}
          <section className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-6 sm:p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">11. Contacto</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Si tienes preguntas, inquietudes o deseas ejercer tus derechos relacionados con esta Política de Privacidad, 
              puedes contactarnos a través de:
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
            <p className="text-slate-300 leading-relaxed mt-6">
              <strong className="text-white">Responsable del tratamiento de datos:</strong> EscribeTuCancion
            </p>
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

