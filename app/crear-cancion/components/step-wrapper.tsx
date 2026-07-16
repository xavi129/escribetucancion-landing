"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

interface StepWrapperProps {
    children: ReactNode
    className?: string
    keyProp: string | number
}

export default function StepWrapper({ children, className, keyProp }: StepWrapperProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={keyProp}
                initial={false}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Custom ease for "premium" feel
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
