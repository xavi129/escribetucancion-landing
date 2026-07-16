import type { Relationship, Occasion, Genre, Style } from "./types"

export const RELATIONSHIPS: Relationship[] = [
  { label: "Mi novio/a", emoji: "💑", color: "text-brand-bordeaux", categories: ["romantic", "general"] },
  { label: "Mi prometido/a", emoji: "💍", color: "text-brand-terracotta", categories: ["romantic"] },
  { label: "Mi esposo/a", emoji: "💒", color: "text-red-400", categories: ["romantic", "general"] },
  { label: "Mi madre", emoji: "👩", color: "text-green-400", categories: ["family", "general"] },
  { label: "Mi padre", emoji: "👨", color: "text-brand-forest", categories: ["family", "general"] },
  { label: "Mi hijo/a", emoji: "👶", color: "text-yellow-400", categories: ["family", "general"] },
  { label: "Mi hermano/a", emoji: "👫", color: "text-brand-forest", categories: ["family", "general"] },
  { label: "Mi mejor amigo/a", emoji: "🤝", color: "text-orange-400", categories: ["friends", "general"] },
  { label: "Un amigo/a", emoji: "👥", color: "text-cyan-400", categories: ["friends", "general"] },
  { label: "Mi 'casi algo'", emoji: "😏", color: "text-rose-400", categories: ["romantic"] },
  { label: "Mi abuelo/a", emoji: "👴", color: "text-amber-400", categories: ["family", "memorial"] },
  { label: "Mi tío/a", emoji: "👨", color: "text-emerald-400", categories: ["family"] },
]

export const OCCASION_CATEGORIES: Record<string, string[]> = {
  "Para dedicar": ["romantic", "family", "friends", "general"],
  "Ocasión especial": ["romantic", "family", "friends", "general"],
  "Cumpleaños": ["romantic", "family", "friends", "general"],
  "Aniversario": ["romantic"],
  "Boda": ["romantic"],
  "San Valentín": ["romantic"],
  "Pedir matrimonio": ["romantic"],
  "Día de la madre": ["family"],
  "Día del padre": ["family"],
  "Graduación": ["family", "friends", "general"],
  "Disculparme": ["romantic", "family", "friends", "general"],
  "Navidad": ["romantic", "family", "friends", "general"],
  "Año nuevo": ["romantic", "family", "friends", "general"],
  "Día de muertos": ["family", "memorial"],
}

export const OCCASIONS: Occasion[] = [
  { label: "Para dedicar", emoji: "💝", color: "bg-rose-500/10 border-rose-500/50 text-rose-400" },
  { label: "Ocasión especial", emoji: "🎉", color: "bg-brand-terracotta/10 border-brand-terracotta/50 text-brand-terracotta" },
  { label: "Aniversario", emoji: "💑", color: "bg-brand-bordeaux/10 border-brand-bordeaux/50 text-brand-bordeaux" },
  { label: "Día de la madre", emoji: "👩", color: "bg-green-500/10 border-green-500/50 text-green-400" },
  { label: "San Valentín", emoji: "💕", color: "bg-red-500/10 border-red-500/50 text-red-400" },
  { label: "Navidad", emoji: "🎄", color: "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" },
  { label: "Cumpleaños", emoji: "🎂", color: "bg-brand-terracotta/10 border-brand-terracotta/50 text-brand-terracotta" },
  { label: "Boda", emoji: "💒", color: "bg-yellow-500/10 border-yellow-500/50 text-yellow-400" },
  { label: "Pedir matrimonio", emoji: "💍", color: "bg-brand-forest/10 border-brand-forest/50 text-brand-forest" },
  { label: "Día del padre", emoji: "👨", color: "bg-brand-forest/10 border-brand-forest/50 text-brand-forest" },
  { label: "Graduación", emoji: "🎓", color: "bg-orange-500/10 border-orange-500/50 text-orange-400" },
  { label: "Disculparme", emoji: "🙏", color: "bg-slate-500/10 border-slate-500/50 text-slate-400" },
  { label: "Año nuevo", emoji: "🎆", color: "bg-cyan-500/10 border-cyan-500/50 text-cyan-400" },
  { label: "Día de muertos", emoji: "💀", color: "bg-amber-500/10 border-amber-500/50 text-amber-400" },
]

export const GENRES: Genre[] = [
  { label: "Bachata", color: "text-amber-400" },
  { label: "Balada", color: "text-brand-terracotta" },
  { label: "Vallenato", color: "text-emerald-400" },
  { label: "Norteño", color: "text-brand-forest" },
  { label: "Banda", color: "text-green-400" },
  { label: "Corrido tumbado", color: "text-amber-500" },
  { label: "Mariachi", color: "text-orange-400" },
  { label: "Rock", color: "text-red-400" },
  { label: "Bolero", color: "text-teal-400" },
  { label: "Salsa", color: "text-rose-400" },
  { label: "Sierreño", color: "text-brand-forest" },
  { label: "Cumbia", color: "text-cyan-400" },
  { label: "Pop", color: "text-brand-bordeaux" },
  { label: "Reggaeton", color: "text-yellow-400" },
  { label: "Rap", color: "text-slate-400" },
  { label: "Trap", color: "text-brand-bordeaux" },
  { label: "R&B", color: "text-emerald-400" },
  { label: "Country", color: "text-lime-400" },
  { label: "Trova", color: "text-fuchsia-400" },
  { label: "Indie", color: "text-sky-400" },
  { label: "Reggae", color: "text-green-400" },
  { label: "Cueca", color: "text-red-500" },
  { label: "Calipso", color: "text-teal-500" },
  { label: "Criolla", color: "text-amber-600" },
  { label: "Huayno", color: "text-orange-500" },
  { label: "Marinera", color: "text-red-600" },
  { label: "Otro", color: "text-gray-400" },
]

export const STYLES: Style[] = [
  { label: "Romántica", color: "text-brand-bordeaux" },
  { label: "Alegre", color: "text-yellow-400" },
  { label: "Triste", color: "text-brand-forest" },
  { label: "Bailable", color: "text-brand-terracotta" },
  { label: "Épica", color: "text-red-400" },
  { label: "Relajada", color: "text-green-400" },
  { label: "Divertida", color: "text-orange-400" },
  { label: "Sentimental", color: "text-rose-400" },
  { label: "Acústica", color: "text-amber-400" },
  { label: "Electrónica", color: "text-cyan-400" },
]

// Genre color mapping for selection states
export const GENRE_COLORS: Record<string, { selected: string; hover: string }> = {
  "Bachata": { selected: "bg-amber-500/30 border-amber-400 text-amber-300", hover: "hover:border-amber-400/50" },
  "Balada": { selected: "bg-brand-terracotta/30 border-brand-terracotta text-brand-terracotta", hover: "hover:border-brand-terracotta/50" },
  "Vallenato": { selected: "bg-emerald-500/30 border-emerald-400 text-emerald-300", hover: "hover:border-emerald-400/50" },
  "Norteño": { selected: "bg-brand-forest/30 border-blue-400 text-brand-forest", hover: "hover:border-blue-400/50" },
  "Banda": { selected: "bg-green-500/30 border-green-400 text-green-300", hover: "hover:border-green-400/50" },
  "Corrido tumbado": { selected: "bg-amber-600/30 border-amber-500 text-amber-300", hover: "hover:border-amber-500/50" },
  "Mariachi": { selected: "bg-orange-500/30 border-orange-400 text-orange-300", hover: "hover:border-orange-400/50" },
  "Rock": { selected: "bg-red-500/30 border-red-400 text-red-300", hover: "hover:border-red-400/50" },
  "Bolero": { selected: "bg-teal-500/30 border-teal-400 text-teal-300", hover: "hover:border-teal-400/50" },
  "Salsa": { selected: "bg-rose-500/30 border-rose-400 text-rose-300", hover: "hover:border-rose-400/50" },
  "Sierreño": { selected: "bg-brand-forest/30 border-brand-forest text-brand-forest", hover: "hover:border-brand-forest/50" },
  "Cumbia": { selected: "bg-cyan-500/30 border-cyan-400 text-cyan-300", hover: "hover:border-cyan-400/50" },
  "Pop": { selected: "bg-brand-bordeaux/30 border-brand-bordeaux text-brand-bordeaux", hover: "hover:border-brand-bordeaux/50" },
  "Reggaeton": { selected: "bg-yellow-500/30 border-yellow-400 text-yellow-300", hover: "hover:border-yellow-400/50" },
  "Rap": { selected: "bg-slate-500/30 border-slate-400 text-slate-300", hover: "hover:border-slate-400/50" },
  "Trap": { selected: "bg-brand-bordeaux/30 border-brand-bordeaux text-brand-bordeaux", hover: "hover:border-brand-bordeaux/50" },
  "R&B": { selected: "bg-emerald-500/30 border-emerald-400 text-emerald-300", hover: "hover:border-emerald-400/50" },
  "Country": { selected: "bg-lime-500/30 border-lime-400 text-lime-300", hover: "hover:border-lime-400/50" },
  "Trova": { selected: "bg-fuchsia-500/30 border-fuchsia-400 text-fuchsia-300", hover: "hover:border-fuchsia-400/50" },
  "Indie": { selected: "bg-sky-500/30 border-sky-400 text-sky-300", hover: "hover:border-sky-400/50" },
  "Reggae": { selected: "bg-green-600/30 border-green-500 text-green-300", hover: "hover:border-green-500/50" },
  "Cueca": { selected: "bg-red-600/30 border-red-500 text-red-300", hover: "hover:border-red-500/50" },
  "Calipso": { selected: "bg-teal-600/30 border-teal-500 text-teal-300", hover: "hover:border-teal-500/50" },
  "Criolla": { selected: "bg-amber-700/30 border-amber-600 text-amber-300", hover: "hover:border-amber-600/50" },
  "Huayno": { selected: "bg-orange-600/30 border-orange-500 text-orange-300", hover: "hover:border-orange-500/50" },
  "Marinera": { selected: "bg-red-700/30 border-red-600 text-red-300", hover: "hover:border-red-600/50" },
  "Otro": { selected: "bg-gray-500/30 border-gray-400 text-gray-300", hover: "hover:border-gray-400/50" },
}

// Style color mapping for selection states
export const STYLE_COLORS: Record<string, { selected: string; hover: string }> = {
  "Romántica": { selected: "bg-brand-bordeaux/30 border-brand-bordeaux text-brand-bordeaux", hover: "hover:border-brand-bordeaux/50" },
  "Alegre": { selected: "bg-yellow-500/30 border-yellow-400 text-yellow-300", hover: "hover:border-yellow-400/50" },
  "Triste": { selected: "bg-brand-forest/30 border-blue-400 text-brand-forest", hover: "hover:border-blue-400/50" },
  "Bailable": { selected: "bg-brand-terracotta/30 border-brand-terracotta text-brand-terracotta", hover: "hover:border-brand-terracotta/50" },
  "Épica": { selected: "bg-red-500/30 border-red-400 text-red-300", hover: "hover:border-red-400/50" },
  "Relajada": { selected: "bg-green-500/30 border-green-400 text-green-300", hover: "hover:border-green-400/50" },
  "Divertida": { selected: "bg-orange-500/30 border-orange-400 text-orange-300", hover: "hover:border-orange-400/50" },
  "Sentimental": { selected: "bg-rose-500/30 border-rose-400 text-rose-300", hover: "hover:border-rose-400/50" },
  "Acústica": { selected: "bg-amber-500/30 border-amber-400 text-amber-300", hover: "hover:border-amber-400/50" },
  "Electrónica": { selected: "bg-cyan-500/30 border-cyan-400 text-cyan-300", hover: "hover:border-cyan-400/50" },
}

// Country-specific genre preferences
// Maps country codes (ISO 3166-1 alpha-2) to arrays of genre labels
export const COUNTRY_GENRES: Record<string, string[]> = {
  // Mexico - Regional Mexican genres + popular Latin genres
  MX: [
    "Banda",
    "Norteño",
    "Mariachi",
    "Corrido tumbado",
    "Sierreño",
    "Balada",
    "Pop",
    "Reggaeton",
    "Cumbia",
    "Rock",
    "Bolero",
    "Bachata",
    "Rap",
    "Trap",
    "Otro",
  ],
  // United States - Country, R&B, and diverse American genres
  US: [
    "Country",
    "Rock",
    "R&B",
    "Rap",
    "Trap",
    "Pop",
    "Reggaeton",
    "Indie",
    "Balada",
    "Bolero",
    "Bachata",
    "Salsa",
    "Otro",
  ],
  // Colombia - Vallenato, Cumbia, and tropical genres
  CO: [
    "Vallenato",
    "Cumbia",
    "Salsa",
    "Reggaeton",
    "Pop",
    "Balada",
    "Rock",
    "Trova",
    "Rap",
    "Trap",
    "Bachata",
    "Otro",
  ],
  // Dominican Republic - Bachata and Caribbean genres
  DO: [
    "Bachata",
    "Reggaeton",
    "Salsa",
    "Pop",
    "Balada",
    "Rap",
    "Trap",
    "Rock",
    "Cumbia",
    "Bolero",
    "Otro",
  ],
  // Puerto Rico - Reggaeton birthplace and Caribbean influences
  PR: [
    "Reggaeton",   // Extremadamente popular - Puerto Rico es cuna del reggaeton
    "Trap",        // Trap latino muy fuerte en Puerto Rico
    "Salsa",       // Tradición salsera boricua muy arraigada
    "Bachata",     // Romántico caribeño - muy popular
    "Pop",         // Universal - versátil
    "Balada",      // Romántico - dedicatorias
    "Rap",         // Urbano - escena fuerte en PR
    "Bolero",      // Clásico romántico boricua
    "Cumbia",      // Festivo - celebraciones
    "Rock",        // Audiencia leal
    "Reggae",      // Influencia caribeña
    "R&B",         // Romántico moderno
    "Indie",       // Nicho emergente
    "Otro",
  ],
  // Spain - European preferences with Latin influence
  ES: [
    "Balada",
    "Pop",
    "Rock",
    "Indie",
    "Reggaeton",
    "Rap",
    "Trap",
    "Salsa",
    "Bachata",
    "Trova",
    "Bolero",
    "Otro",
  ],
  // Argentina - Tango, Rock, and diverse genres
  AR: [
    "Rock",
    "Pop",
    "Cumbia",
    "Reggaeton",
    "Balada",
    "Rap",
    "Trap",
    "Salsa",
    "Trova",
    "Indie",
    "Otro",
  ],
  // Chile - Optimized for maximum conversion
  CL: [
    "Balada",      // #1 dedicatorias románticas - MÁXIMA conversión
    "Reggaeton",   // Extremadamente popular - alta conversión todas las edades
    "Pop",         // Universal - versátil para todo
    "Bolero",      // Romántico clásico - parejas mayores (alto ticket)
    "Rock",        // Cultura rock chilena muy fuerte
    "Cumbia",      // Fiestas/cumpleaños - alta demanda
    "Reggae",      // MUY popular en Chile - diferenciador
    "Trap",        // Urbano joven - tendencia
    "Rap",         // Urbano - personalización fuerte
    "R&B",         // Romántico moderno - nicho premium
    "Cueca",       // ÚNICO chileno - diferenciación total
    "Trova",       // Nueva Canción - cultural, especial
    "Indie",       // Nicho leal - personalización alta
    "Salsa",       // Festivo - celebraciones
    "Otro",
  ],
  // Costa Rica - Caribbean and Central American influences
  CR: [
    "Reggae",      // Muy popular en Costa Rica, especialmente en Limón
    "Calipso",     // Género único de la cultura afrocaribeña costarricense
    "Balada",      // Romántico - dedicatorias populares
    "Reggaeton",   // Urbano muy popular - alta conversión
    "Pop",         // Universal - versátil
    "Cumbia",      // Festivo - celebraciones
    "Salsa",       // Tropical - muy popular
    "Rock",        // Audiencia leal
    "Bachata",     // Romántico - eventos
    "Bolero",      // Clásico romántico
    "Trap",        // Urbano joven
    "Rap",         // Urbano - personalización
    "Trova",       // Cultural
    "Indie",       // Nicho emergente
    "Otro",
  ],
  // Panamá - Reggaeton, Salsa, and Caribbean influences
  PA: [
    "Reggaeton",   // Panamá es cuna del reggaeton
    "Salsa",       // Tradición salsera panameña
    "Cumbia",      // Muy popular en fiestas
    "Pop",         // Universal - versátil
    "Balada",      // Romántico - dedicatorias
    "Bachata",     // Caribeño - romántico
    "Reggae",      // Influencia caribeña
    "Rock",        // Audiencia leal
    "Rap",         // Urbano
    "Trap",        // Urbano joven
    "Bolero",      // Clásico romántico
    "Trova",       // Cultural
    "Indie",       // Nicho emergente
    "Otro",
  ],
  // Guatemala - Marimba influences and Latin pop
  GT: [
    "Balada",      // Romántico - dedicatorias populares
    "Pop",         // Universal - versátil
    "Reggaeton",   // Urbano muy popular
    "Cumbia",      // Festivo - celebraciones
    "Salsa",       // Tropical - popular
    "Rock",        // Audiencia leal
    "Bachata",     // Romántico - eventos
    "Bolero",      // Clásico romántico
    "Rap",         // Urbano
    "Trap",        // Urbano joven
    "Trova",       // Cultural
    "Indie",       // Nicho emergente
    "Reggae",      // Caribeño
    "Otro",
  ],
  // Brasil - Diverse Brazilian music scene
  BR: [
    "Pop",         // Universal - versátil
    "Rock",        // Fuerte escena de rock brasileño
    "Reggaeton",   // Muy popular en Brasil
    "R&B",         // Romántico moderno
    "Rap",         // Hip hop brasileiro muy fuerte
    "Trap",        // Urbano joven
    "Balada",      // Romántico - dedicatorias
    "Reggae",      // Popular en Brasil
    "Cumbia",      // Festivo
    "Bolero",      // Clásico romántico
    "Indie",       // Escena indie brasileña
    "Country",     // Sertanejo tiene elementos country
    "Bachata",     // Romántico
    "Otro",
  ],
  // Uruguay - Rock, Cumbia, and River Plate culture
  UY: [
    "Rock",        // Fuerte cultura de rock uruguayo
    "Cumbia",      // Cumbia villera/tropical muy popular
    "Pop",         // Universal - versátil
    "Balada",      // Romántico - dedicatorias
    "Reggaeton",   // Urbano popular
    "Rap",         // Urbano - personalización
    "Trap",        // Urbano joven
    "Salsa",       // Tropical
    "Bolero",      // Clásico romántico
    "Trova",       // Cultural - murga/candombe
    "Indie",       // Nicho emergente
    "Bachata",     // Romántico
    "Otro",
  ],
  // Bolivia - Andean and tropical influences
  BO: [
    "Cumbia",      // Cumbia boliviana muy popular
    "Balada",      // Romántico - dedicatorias
    "Pop",         // Universal - versátil
    "Reggaeton",   // Urbano popular
    "Rock",        // Audiencia leal
    "Salsa",       // Tropical
    "Bolero",      // Clásico romántico
    "Huayno",      // Música andina tradicional
    "Bachata",     // Romántico
    "Rap",         // Urbano
    "Trap",        // Urbano joven
    "Trova",       // Cultural
    "Indie",       // Nicho emergente
    "Otro",
  ],
  // Paraguay - Guarania, Polka paraguaya, and regional genres
  PY: [
    "Cumbia",      // Muy popular en fiestas paraguayas
    "Balada",      // Romántico - dedicatorias
    "Pop",         // Universal - versátil
    "Reggaeton",   // Urbano popular
    "Rock",        // Audiencia leal
    "Bachata",     // Romántico
    "Salsa",       // Tropical
    "Bolero",      // Clásico romántico
    "Rap",         // Urbano
    "Trap",        // Urbano joven
    "Trova",       // Cultural
    "Indie",       // Nicho emergente
    "Otro",
  ],
  // Honduras - Central American and Caribbean influences
  HN: [
    "Reggaeton",   // Urbano muy popular
    "Cumbia",      // Festivo - celebraciones
    "Balada",      // Romántico - dedicatorias
    "Pop",         // Universal - versátil
    "Salsa",       // Tropical
    "Bachata",     // Romántico - muy popular
    "Rock",        // Audiencia leal
    "Reggae",      // Influencia caribeña (Garífuna)
    "Bolero",      // Clásico romántico
    "Rap",         // Urbano
    "Trap",        // Urbano joven
    "Trova",       // Cultural
    "Indie",       // Nicho emergente
    "Otro",
  ],
  // Nicaragua - Tropical and Central American genres
  NI: [
    "Cumbia",      // Muy popular en Nicaragua
    "Balada",      // Romántico - dedicatorias
    "Reggaeton",   // Urbano popular
    "Pop",         // Universal - versátil
    "Salsa",       // Tropical
    "Bachata",     // Romántico
    "Rock",        // Audiencia leal
    "Bolero",      // Clásico romántico
    "Rap",         // Urbano
    "Trap",        // Urbano joven
    "Reggae",      // Caribeño
    "Trova",       // Cultural
    "Indie",       // Nicho emergente
    "Otro",
  ],
  // Ecuador - Andean and coastal influences
  EC: [
    "Cumbia",      // Muy popular en Ecuador
    "Salsa",       // Fuerte tradición salsera
    "Balada",      // Romántico - dedicatorias
    "Reggaeton",   // Urbano popular
    "Pop",         // Universal - versátil
    "Rock",        // Audiencia leal
    "Bolero",      // Clásico romántico
    "Bachata",     // Romántico
    "Rap",         // Urbano
    "Trap",        // Urbano joven
    "Trova",       // Cultural
    "Indie",       // Nicho emergente
    "Otro",
  ],
  // El Salvador - Central American genres
  SV: [
    "Cumbia",      // Muy popular en El Salvador
    "Reggaeton",   // Urbano popular
    "Balada",      // Romántico - dedicatorias
    "Pop",         // Universal - versátil
    "Salsa",       // Tropical
    "Bachata",     // Romántico
    "Rock",        // Audiencia leal
    "Bolero",      // Clásico romántico
    "Rap",         // Urbano
    "Trap",        // Urbano joven
    "Trova",       // Cultural
    "Indie",       // Nicho emergente
    "Otro",
  ],
  // Peru - Cumbia peruana, Criolla, and Andean influences
  PE: [
    "Cumbia",      // Cumbia peruana muy popular - alta conversión
    "Salsa",       // Gran tradición salsera en Perú
    "Criolla",     // Música criolla peruana tradicional - único
    "Balada",      // Romántico - dedicatorias populares
    "Reggaeton",   // Urbano moderno - muy popular
    "Pop",         // Universal - versátil
    "Huayno",      // Música andina tradicional - cultural
    "Marinera",    // Música costeña tradicional - único peruano
    "Rock",        // Fuerte escena de rock peruano
    "Bolero",      // Romántico clásico
    "Bachata",     // Romántico - eventos
    "Rap",         // Urbano - personalización
    "Trap",        // Urbano joven
    "Trova",       // Cultural
    "Indie",       // Nicho emergente
    "Otro",
  ],
}

// Default genres for countries not in the map above
const DEFAULT_GENRES: string[] = [
  "Pop",
  "Rock",
  "Balada",
  "Reggaeton",
  "Salsa",
  "Cumbia",
  "Bachata",
  "Rap",
  "Trap",
  "R&B",
  "Indie",
  "Bolero",
  "Otro",
]

/**
 * Get genres filtered by country
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., "MX", "US", "CO")
 * @returns Array of genres relevant to the country
 */
export function getGenresByCountry(countryCode: string): Genre[] {
  // Get the genre labels for this country (or use default)
  const genreLabels = COUNTRY_GENRES[countryCode.toUpperCase()] || DEFAULT_GENRES

  // Filter GENRES array to only include genres in the country's list
  // Maintain the order from the country-specific list
  return genreLabels
    .map((label) => GENRES.find((genre) => genre.label === label))
    .filter((genre): genre is Genre => genre !== undefined)
}
