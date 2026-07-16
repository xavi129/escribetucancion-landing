import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music2 } from "lucide-react"

export default function Navbar() {
  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="bg-emerald-500/20 p-1.5 rounded-lg mr-2 group-hover:bg-emerald-500/30 transition-colors">
                <Music2 className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Melodia<span className="text-emerald-400">Mía</span></span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/#como-funciona" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              ¿Cómo funciona?
            </Link>
            <Link href="/#demos" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
              Demos
            </Link>
          </nav>

          <div>
            <Button className="bg-green-600 hover:bg-green-500 text-white font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all hover:scale-105" asChild>
              <Link href="/crear-cancion" className="flex items-center">
                Crear canción
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

