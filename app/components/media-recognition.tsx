"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tv } from "lucide-react"

export default function MediaRecognition({ className }: { className?: string }) {
  return (
    <Card className={`border-white/10 bg-white/5 backdrop-blur-sm shadow-xl overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 p-3 text-white border-b border-white/5">
          <div className="flex justify-center items-center">
            <Tv className="h-5 w-5 mr-2 text-purple-400" />
            <h3 className="text-lg font-bold tracking-wide">Como lo viste en</h3>
          </div>
        </div>

        <div className="p-6 flex flex-col sm:flex-row items-center justify-center gap-8 bg-slate-950/50">
          <div className="flex flex-col items-center group">
            <div className="relative h-12 w-32 mb-3 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/tv-azteca-logo.svg"
                alt="TV Azteca"
                fill
                className="object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-300 bg-purple-500/10">
              Programa Venga la Alegría
            </Badge>
          </div>

          <div className="h-px w-full sm:h-12 sm:w-px bg-white/10"></div>

          <div className="flex flex-col items-center group">
            <div className="relative h-12 w-32 mb-3 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/televisa-logo.svg"
                alt="Televisa"
                fill
                className="object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-300 bg-purple-500/10">
              Programa Hoy
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}