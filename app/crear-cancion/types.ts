import type React from "react"

export interface FormData {
  songType: string
  occasion: string
  includeName: string
  personName: string
  relationship: string
  genre: string
  customGenre: string
  references: string
  voiceGender: string
  styles: string[]
  details: string
  deliveryType: string
  spotifyUpload: string
  video: string
  customerName: string
  whatsapp: string
  email: string
  paymentMethod: string
}

export interface StepProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export interface Relationship {
  label: string
  emoji: string
  color: string
  categories: string[]
}

export interface Occasion {
  label: string
  emoji: string
  color: string
}

export interface Genre {
  label: string
  color: string
}

export interface Style {
  label: string
  color: string
}
