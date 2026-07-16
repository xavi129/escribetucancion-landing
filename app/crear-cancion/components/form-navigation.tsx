"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react"

interface FormNavigationProps {
  step: number
  totalSteps: number
  isLoading: boolean
  onBack: () => void
  onNext: () => void
}

export function DesktopNavigation({
  step,
  totalSteps,
  isLoading,
  onBack,
  onNext,
}: FormNavigationProps) {
  const isLastStep = step === totalSteps

  return (
    <div className="hidden sm:flex sm:justify-between sm:mt-12">
      {step > 1 && (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-xl px-6 py-6 text-base transition-hover border border-transparent hover:border-white/10"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Atrás
        </Button>
      )}

      {!isLastStep ? (
        <Button
          type="button"
          onClick={onNext}
          className="ml-auto flex items-center justify-center brand-cta text-white px-8 py-6 text-lg transition-selection gpu-accelerated border-t border-white/20"
          aria-label="Avanzar al siguiente paso"
        >
          Siguiente <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          className="ml-auto flex items-center justify-center brand-cta text-white px-8 py-6 text-lg transition-selection gpu-accelerated border-t border-white/20"
          aria-label={isLoading ? "Procesando solicitud" : "Completar solicitud"}
        >
          {isLoading ? (
            <>
              Procesando... <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            </>
          ) : (
            <>
              Completar Solicitud <Check className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      )}
    </div>
  )
}

export function MobileNavigation({
  step,
  totalSteps,
  isLoading,
  onBack,
  onNext,
}: FormNavigationProps) {
  const isLastStep = step === totalSteps

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-brand-ink/90 backdrop-blur-md border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.4)] transform-gpu"
      style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
    >
      <div className="px-4 pt-3">
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              aria-label="Volver al paso anterior"
              className="flex-1 items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-xl px-4 py-6 text-base transition-hover border border-white/5 hover:border-white/10 bg-white/5"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          {!isLastStep ? (
            <Button
              type="button"
              onClick={onNext}
              className="flex-[3] flex items-center justify-center brand-cta text-white px-4 py-6 text-lg transition-selection gpu-accelerated border-t border-white/20"
              aria-label="Avanzar al siguiente paso"
            >
              Siguiente <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onNext}
              disabled={isLoading}
              aria-label={isLoading ? "Procesando solicitud" : "Completar solicitud"}
              className="flex-[3] flex items-center justify-center brand-cta text-white px-4 py-6 text-lg transition-selection gpu-accelerated border-t border-white/20"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Completar <Check className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FormNavigation(props: FormNavigationProps) {
  return (
    <>
      <DesktopNavigation {...props} />
      <MobileNavigation {...props} />
    </>
  )
}
