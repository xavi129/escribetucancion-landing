import { NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"

// Configure Groq provider using OpenAI-compatible API
const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

// Función para generar letras de canciones usando AI SDK con failback automático
async function generateLyricsWithGemini(prompt: string, isEdit: boolean = false, generateSingle: boolean = false): Promise<string[]> {
  let generatedText: string | null = null
  let lastError: Error | null = null

  // Try Gemini first
  try {
    console.log("Attempting to generate lyrics with Gemini 2.5 Flash Lite...")

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno")
    }

    const result = await generateText({
      model: google("gemini-2.5-flash-lite"),
      prompt: prompt,
      temperature: 0.8,
    })

    generatedText = result.text
    console.log("✓ Lyrics generated successfully with Gemini")
  } catch (error) {
    console.error("✗ Gemini failed:", error)
    lastError = error instanceof Error ? error : new Error(String(error))

    // Try Groq with Llama 4 Scout as fallback
    try {
      console.log("Attempting failback to Groq with Llama 4 Scout...")

      if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY no está configurada en las variables de entorno")
      }

      const result = await generateText({
        model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
        prompt: prompt,
        temperature: 0.8,
      })

      generatedText = result.text
      console.log("✓ Lyrics generated successfully with Groq/Llama 4 Scout (failback)")
    } catch (groqError) {
      console.error("✗ Groq failback also failed:", groqError)
      lastError = groqError instanceof Error ? groqError : new Error(String(groqError))

      // For edit operations, re-throw the error so the user can retry with their current lyric preserved
      if (isEdit) {
        throw lastError
      }

      // Return fallback lyrics: single if generateSingle, otherwise two
      console.log("⚠ Using hardcoded fallback lyrics")
      const fallbackLyrics = generateFallbackLyrics()
      return generateSingle ? [fallbackLyrics[0]] : fallbackLyrics
    }
  }

  // Process the generated text
  if (!generatedText) {
    // This should never happen, but just in case
    console.log("⚠ No text generated, using hardcoded fallback lyrics")
    const fallbackLyrics = generateFallbackLyrics()
    return generateSingle ? [fallbackLyrics[0]] : fallbackLyrics
  }

  // Limpiar cualquier texto explicativo que pueda haber sido incluido
  const cleanedText = cleanGeneratedText(generatedText)

  // Si es una edición o generación única, devolver la letra limpia directamente
  if (isEdit || generateSingle) {
    return [cleanedText]
  }

  // Dividir el texto en dos letras diferentes
  const lyrics = extractTwoLyrics(cleanedText)

  return lyrics
}

// Función para limpiar el texto generado de explicaciones y comentarios
function cleanGeneratedText(text: string): string {
  // Buscar el primer marcador de sección válido como (Intro), (Verso), (Estribillo), etc.
  const sectionPattern = /\(Intro\)|\(Verso\)|\(Estribillo\)|\(Puente\)|\(Outro\)/i
  const firstSectionMatch = text.match(sectionPattern)
  
  if (firstSectionMatch && firstSectionMatch.index !== undefined) {
    // Si encontramos un marcador de sección, eliminamos todo lo que viene antes
    text = text.substring(firstSectionMatch.index)
  }

  // Buscar y eliminar marcadores de letras al inicio
  const letterMarkers = [
    /^Letra\s*1\s*:?\s*/i,
    /^Opción\s*1\s*:?\s*/i,
    /^Propuesta\s*1\s*:?\s*/i,
    /^Primera\s*letra\s*:?\s*/i,
    /^Canción\s*1\s*:?\s*/i,
  ]

  for (const marker of letterMarkers) {
    text = text.replace(marker, '')
  }

  return text.trim()
}

// Función para extraer dos letras del texto generado y limpiar indicaciones adicionales
function extractTwoLyrics(text: string): string[] {
  // Intentar dividir por marcadores comunes de letras (más específicos primero)
  const markers = [
    ["Letra 1:", "Letra 2:"],
    ["Letra 1\n", "Letra 2:"],
    ["Letra 1\n", "Letra 2\n"],
    ["Opción 1:", "Opción 2:"],
    ["Opción 1\n", "Opción 2:"],
    ["Propuesta 1:", "Propuesta 2:"],
    ["Primera letra:", "Segunda letra:"],
    ["Canción 1:", "Canción 2:"],
  ]

  let firstPart = ""
  let secondPart = ""

  // Buscar marcadores para dividir el texto
  for (const [marker1, marker2] of markers) {
    // Crear regex más estricto que busque el marcador completo
    const escapedMarker1 = marker1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const escapedMarker2 = marker2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    
    // Buscar el índice del primer marcador
    const regex1 = new RegExp(escapedMarker1, 'i')
    const regex2 = new RegExp(escapedMarker2, 'i')
    
    const match1 = text.match(regex1)
    const match2 = text.match(regex2)
    
    if (match1 && match2 && match1.index !== undefined && match2.index !== undefined) {
      // Asegurarse de que el segundo marcador viene después del primero
      if (match2.index > match1.index) {
        // Extraer la primera letra (después del marcador 1 hasta el marcador 2)
        firstPart = text.substring(match1.index + match1[0].length, match2.index).trim()
        // Extraer la segunda letra (después del marcador 2 hasta el final)
        secondPart = text.substring(match2.index + match2[0].length).trim()
        
        // Limpiar cualquier resto del marcador que pueda quedar
        firstPart = firstPart.replace(/^Letra\s*1\s*:?\s*/i, '').trim()
        secondPart = secondPart.replace(/^Letra\s*2\s*:?\s*/i, '').trim()
        
        if (firstPart && secondPart) {
          break
        }
      }
    }
  }

  // Si no se encuentran marcadores, intentar dividir por secciones duplicadas
  if (!firstPart && !secondPart) {
    // Buscar patrones de secciones que se repiten (indicando dos letras)
    const sectionPattern = /\((?:Intro|Verso|Estribillo|Puente|Outro)\)/gi
    const sections = text.match(sectionPattern)
    
    if (sections && sections.length >= 4) {
      // Buscar un patrón específico: (Outro) seguido de (Intro) indica nueva letra
      const outroIntroPattern = /\(Outro\)[\s\S]*?\n\n[\s\S]*?\(Intro\)/i
      const outroIntroMatch = text.match(outroIntroPattern)
      
      if (outroIntroMatch && outroIntroMatch.index !== undefined) {
        // Encontrar el inicio del segundo (Intro)
        const secondIntroIndex = text.indexOf("(Intro)", outroIntroMatch.index + "(Outro)".length)
        if (secondIntroIndex !== -1) {
          // Buscar el (Intro) anterior para asegurarnos de que es el segundo
          const firstIntroIndex = text.indexOf("(Intro)")
          if (secondIntroIndex > firstIntroIndex) {
            // Dividir justo antes del segundo (Intro)
            firstPart = text.substring(0, secondIntroIndex).trim()
            secondPart = text.substring(secondIntroIndex).trim()
          }
        }
      }
      
      // Si aún no se dividió, buscar el segundo (Intro) o (Verso) después del primer (Outro)
      if (!firstPart && !secondPart) {
        const firstOutroIndex = text.indexOf("(Outro)")
        if (firstOutroIndex !== -1) {
          // Buscar el siguiente (Intro) o (Verso) después del primer (Outro)
          const afterOutro = text.substring(firstOutroIndex + "(Outro)".length)
          const secondIntroIndex = afterOutro.search(/\(Intro\)|\(Verso\)/i)
          
          if (secondIntroIndex !== -1) {
            // Buscar múltiples saltos de línea antes del segundo (Intro)/(Verso) para dividir
            const splitPoint = firstOutroIndex + "(Outro)".length + secondIntroIndex
            // Retroceder para encontrar el inicio del segundo (Intro) o (Verso)
            const actualSplitPoint = text.lastIndexOf("(Intro)", splitPoint) !== -1 
              ? text.lastIndexOf("(Intro)", splitPoint)
              : text.lastIndexOf("(Verso)", splitPoint)
            
            if (actualSplitPoint !== -1 && actualSplitPoint > firstOutroIndex) {
              // Buscar múltiples saltos de línea antes del segundo inicio
              let splitIndex = actualSplitPoint
              // Retroceder hasta encontrar al menos 2 saltos de línea consecutivos
              for (let i = actualSplitPoint - 1; i >= 0; i--) {
                if (text.substring(i, i + 2) === "\n\n" || text.substring(i, i + 3) === "\n\n\n") {
                  splitIndex = i + (text.substring(i, i + 3) === "\n\n\n" ? 3 : 2)
                  break
                }
              }
              
              firstPart = text.substring(0, splitIndex).trim()
              secondPart = text.substring(splitIndex).trim()
            }
          }
        }
      }
      
      // Si aún no se dividió, usar el método del punto medio mejorado
      if (!firstPart && !secondPart) {
        const midpoint = Math.floor(text.length / 2)
        // Buscar un punto de división natural (doble salto de línea cerca del medio)
        let splitIndex = text.indexOf("\n\n\n", midpoint - 200)
        if (splitIndex === -1 || splitIndex > midpoint + 200) {
          splitIndex = text.indexOf("\n\n", midpoint - 100)
        }
        if (splitIndex === -1 || splitIndex > midpoint + 200) {
          splitIndex = midpoint
        }
        
        firstPart = text.substring(0, splitIndex).trim()
        secondPart = text.substring(splitIndex).trim()
      }
    } else {
      // Si no hay suficientes secciones, dividir por la mitad
      const midpoint = Math.floor(text.length / 2)
      let splitIndex = text.indexOf("\n\n", midpoint)
      if (splitIndex === -1) {
        splitIndex = midpoint
      }
      firstPart = text.substring(0, splitIndex).trim()
      secondPart = text.substring(splitIndex).trim()
    }
  }

  // Limpiar indicaciones sobre estilo, género, instrumentos y otros metadatos
  const cleanLyrics = (lyric: string): string => {
    if (!lyric) return ""
    
    // Eliminar cualquier marcador de letra que pueda quedar dentro del contenido
    lyric = lyric.replace(/^(Letra\s*[12]|Opción\s*[12]|Propuesta\s*[12]|Canción\s*[12]|Primera\s*letra|Segunda\s*letra)\s*:?\s*/gim, '')
    
    // IMPORTANTE: Si la letra contiene un (Outro) seguido de un (Intro), cortar después del (Outro)
    // Esto indica que se mezcló con la siguiente letra
    const outroIntroPattern = /\(Outro\)[\s\S]*?\n\s*\(Intro\)/i
    if (outroIntroPattern.test(lyric)) {
      const outroIndex = lyric.lastIndexOf("(Outro)")
      if (outroIndex !== -1) {
        // Encontrar el final del (Outro) - buscar el siguiente (Intro) o el final del texto
        const afterOutro = lyric.substring(outroIndex)
        const introAfterOutro = afterOutro.search(/\(Intro\)/i)
        if (introAfterOutro !== -1) {
          // Cortar justo antes del (Intro) que viene después del (Outro)
          const cutPoint = outroIndex + introAfterOutro
          lyric = lyric.substring(0, cutPoint).trim()
          // Asegurar que termine con el (Outro) completo
          const lastOutroEnd = lyric.lastIndexOf("(Outro)")
          if (lastOutroEnd !== -1) {
            // Encontrar el final del contenido del Outro (hasta el siguiente salto de línea o fin)
            const outroContent = lyric.substring(lastOutroEnd)
            const outroEnd = outroContent.indexOf("\n\n")
            if (outroEnd !== -1) {
              lyric = lyric.substring(0, lastOutroEnd + outroEnd).trim()
            } else {
              // Si no hay doble salto de línea, buscar el final del contenido del Outro
              const outroLines = outroContent.split("\n")
              if (outroLines.length > 1) {
                // Tomar el (Outro) y sus líneas hasta encontrar un salto de línea doble o fin
                let outroText = outroLines[0] // (Outro)
                for (let i = 1; i < outroLines.length; i++) {
                  if (outroLines[i].trim() === "" && outroLines[i-1].trim() !== "") {
                    break // Encontró un salto de línea, terminar aquí
                  }
                  outroText += "\n" + outroLines[i]
                }
                lyric = lyric.substring(0, lastOutroEnd) + outroText
              }
            }
          }
        }
      }
    }
    
    // Eliminar líneas que contengan indicaciones sobre estilo, género o instrumentos
    const lines = lyric.split("\n")
    const filteredLines = lines.filter(line => {
      const lowerLine = line.toLowerCase().trim()
      // Ignorar líneas vacías
      if (!lowerLine) return true
      
      // Eliminar líneas con metadatos o marcadores de letras
      return !(
        lowerLine.match(/^(letra|opción|propuesta|canción|primera\s*letra|segunda\s*letra)\s*[12]\s*:?/i) ||
        lowerLine.includes("estilo:") ||
        lowerLine.includes("género:") ||
        lowerLine.includes("instrumento:") ||
        lowerLine.includes("instrumentación:") ||
        lowerLine.includes("producción:") ||
        lowerLine.includes("nota:") ||
        lowerLine.includes("importante:") ||
        lowerLine.startsWith("nota") ||
        lowerLine.startsWith("importante") ||
        (lowerLine.includes("bachata") || lowerLine.includes("cumbia") || 
         lowerLine.includes("reggaeton") || lowerLine.includes("corrido") ||
         lowerLine.includes("rap") || lowerLine.includes("rock") ||
         lowerLine.includes("pop") || lowerLine.includes("salsa"))
      )
    })
    
    let cleaned = filteredLines.join("\n").trim()
    
    // Eliminar múltiples saltos de línea consecutivos (más de 2)
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n")
    
    // Asegurar que las secciones estén correctamente formateadas
    cleaned = cleaned.replace(/\(([^)]+)\)/g, (match, section) => {
      const normalized = section.trim()
      const validSections = ['Intro', 'Verso', 'Estribillo', 'Puente', 'Outro']
      if (validSections.includes(normalized)) {
        return `(${normalized})`
      }
      return match
    })
    
    return cleaned
  }

  const cleanedFirst = cleanLyrics(firstPart)
  const cleanedSecond = cleanLyrics(secondPart)

  // Si alguna de las letras está vacía o es muy corta, usar la letra completa
  if (!cleanedFirst || cleanedFirst.length < 50) {
    return [cleanLyrics(text), cleanedSecond || cleanLyrics(text)]
  }
  if (!cleanedSecond || cleanedSecond.length < 50) {
    return [cleanedFirst, cleanLyrics(text)]
  }

  return [cleanedFirst, cleanedSecond]
}

// Función para generar letras de respaldo en caso de error
function generateFallbackLyrics(): string[] {
  return [
    `Verso 1:
En cada amanecer pienso en ti
Tus ojos son mi guía, mi luz
No hay distancia que nos pueda separar
Porque tu amor es mi verdad

Coro:
Eres mi todo, mi razón
Late por ti mi corazón
No hay palabras para explicar
Lo que por ti puedo sentir

Verso 2:
Recuerdo aquel momento especial
Cuando el tiempo se detuvo al mirar
Tus ojos que me hablaban de amor
Y supe que eras tú, mi amor`,

    `Verso 1:
Desde que te conocí
Mi mundo cambió de color
Cada día junto a ti
Es un regalo del amor

Coro:
Tu sonrisa es mi luz
Tu mirada mi paz
En tus brazos encuentro
Un amor de verdad

Verso 2:
No importa lo que pase
Siempre estaré para ti
Nuestro amor es eterno
Como el cielo y el mar`,
  ]
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formData: rawFormData, currentLyric, editInstructions, generateSingle } = body

    // Usar objeto vacío si formData es null/undefined para permitir generación con datos parciales
    const formData = rawFormData || {}

    // Si hay instrucciones de edición, usar un prompt diferente
    let prompt: string
    let isEdit = false
    if (currentLyric && editInstructions) {
      prompt = createEditPromptWithInstructions(currentLyric, editInstructions, formData)
      isEdit = true
    } else {
      // Crear un prompt basado en los datos del formulario
      prompt = createPromptFromFormData(formData, generateSingle)
    }

    // Generar letras con Gemini
    const lyrics = await generateLyricsWithGemini(prompt, isEdit, generateSingle)

    return NextResponse.json({ lyrics })
  } catch (error) {
    console.error("Error al generar letras:", error)
    return NextResponse.json({ error: "Error al generar letras de canciones" }, { status: 500 })
  }
}

// Función para crear un prompt de edición con instrucciones
function createEditPromptWithInstructions(currentLyric: string, editInstructions: string, formData: any): string {
  const {
    occasion,
    includeName,
    personName,
    relationship,
    genre,
    styles,
  } = formData

  let contextInfo = ""
  
  if (occasion) {
    contextInfo += `Ocasión: ${occasion}\n`
  }
  if (relationship) {
    contextInfo += `Relación: ${relationship}\n`
  }
  if (includeName === 'yes' && personName) {
    contextInfo += `Nombre a incluir: ${personName}\n`
  }
  if (genre && genre !== 'Otro') {
    contextInfo += `Género musical de referencia: ${genre}\n`
  }
  if (styles && styles.length > 0) {
    contextInfo += `Estilos emocionales: ${styles.join(', ')}\n`
  }

  const editPrompt = `Eres un compositor profesional de letras de canciones en español. Tienes una letra de canción existente y el usuario quiere hacer cambios específicos manteniendo el contexto general.

CONTEXTO ORIGINAL:
${contextInfo}

LETRA ACTUAL:
${currentLyric}

INSTRUCCIONES DE EDICIÓN DEL USUARIO:
${editInstructions}

INSTRUCCIONES CRÍTICAS:

1. MANTÉN EL CONTEXTO: La nueva versión debe mantener el tema, la ocasión y el sentimiento general de la letra original.

2. APLICA LOS CAMBIOS: Implementa específicamente los cambios que el usuario solicitó en sus instrucciones.

3. ESTRUCTURA DE SECCIONES:
   - Usa SIEMPRE estos nombres exactos de secciones entre paréntesis: (Intro), (Verso), (Estribillo), (Puente), (Outro)
   - NO uses variaciones como "Introducción", "Coro", "Chorus", "Verso 1", "Verso 2", etc.
   - Mantén una estructura similar a la original a menos que el usuario pida cambios específicos en la estructura

4. FORMATO DE RESPUESTA:
   - Devuelve ÚNICAMENTE la nueva letra modificada
   - NO incluyas explicaciones, comentarios, ni texto introductorio
   - NO uses comillas, asteriscos o caracteres especiales alrededor de la letra
   - NO incluyas marcadores como "Letra 1:" o "Opción 1:" - solo devuelve la letra directamente

5. RESTRICCIONES:
   - NUNCA menciones el género musical en la letra (como "bachata", "cumbia", "reggaeton", etc.)
   - NO incluyas información sobre precios, costos o aspectos técnicos
   - NO uses dígitos numéricos (0-9). Escribe TODOS los números en letras.
   - La letra DEBE estar completamente en español
   - IMPORTANTE: La letra NO debe exceder los 2000 caracteres en total. Si es necesario, ajusta la longitud manteniendo la esencia

6. PERSONALIZACIÓN:
${includeName === 'yes' && personName ? `   - Asegúrate de incluir el nombre "${personName}" de forma natural si ya estaba en la letra original\n` : ''}
${relationship ? `   - Mantén la relación "${relationship}" reflejada en la letra\n` : ''}

Genera ahora la letra modificada siguiendo las instrucciones del usuario:`

  return editPrompt
}

function createPromptFromFormData(formData: any, generateSingle: boolean = false): string {
  // Extraer información relevante del formulario
  const {
    songType,
    occasion,
    includeName,
    personName,
    relationship,
    genre,
    references,
    voiceGender,
    styles,
    details
  } = formData

  // Construir el contexto de la canción
  let contextPrompt = ""

  if (occasion) {
    contextPrompt += `OCASIÓN: ${occasion}\n`
  }

  if (relationship) {
    contextPrompt += `RELACIÓN: ${relationship}\n`
  }

  if (includeName === 'yes' && personName) {
    contextPrompt += `INCLUIR NOMBRE: ${personName} (debe aparecer de forma natural en la letra)\n`
  }

  if (genre && genre !== 'Otro') {
    contextPrompt += `GÉNERO MUSICAL DE REFERENCIA: ${genre} (solo como referencia de estilo, NO mencionar en la letra)\n`
  }

  if (styles && styles.length > 0) {
    contextPrompt += `ESTILOS EMOCIONALES: ${styles.join(', ')}\n`
  }

  if (references) {
    contextPrompt += `REFERENCIAS MUSICALES: ${references} (solo como inspiración, NO copiar)\n`
  }

  if (details) {
    contextPrompt += `DETALLES ESPECÍFICOS PARA LA LETRA:\n${details}\n`
  }

  // Construir un prompt mejorado y más específico
  const taskDescription = generateSingle 
    ? `Eres un compositor profesional de letras de canciones en español. Tu tarea es crear una letra de canción basada en el siguiente contexto:`
    : `Eres un compositor profesional de letras de canciones en español. Tu tarea es crear dos letras de canciones completamente diferentes basadas en el siguiente contexto:`
  
  const enhancedPrompt = `${taskDescription}

${contextPrompt}

INSTRUCCIONES CRÍTICAS DE FORMATO:

1. ESTRUCTURA DE SECCIONES:
   - Usa SIEMPRE estos nombres exactos de secciones entre paréntesis: (Intro), (Verso), (Estribillo), (Puente), (Outro)
   - NO uses variaciones como "Introducción", "Coro", "Chorus", "Verso 1", "Verso 2", etc.
   - Cada sección debe estar claramente marcada con su nombre entre paréntesis en una línea separada
   - Ejemplo correcto:
     (Verso)
     Línea 1 de la letra
     Línea 2 de la letra
     
     (Estribillo)
     Línea del estribillo

2. CONTENIDO:
   - La respuesta debe contener ÚNICAMENTE la letra de la canción, sin ningún texto introductorio, explicativo o comentario
   - NO incluyas comillas, asteriscos, guiones o caracteres especiales alrededor de la letra
   - La letra DEBE estar completamente en español
   - Mantén cada letra entre 200-400 palabras en total (máximo 2000 caracteres)
   - Enfócate en el contenido emocional, la historia personal y el contexto proporcionado

3. RESTRICCIONES ABSOLUTAS:
   - NUNCA menciones el género musical en la letra (como "bachata", "cumbia", "reggaeton", "corrido", "rap", "rock", "pop", etc.)
   - En lugar de mencionar el género, usa palabras genéricas como "canción", "melodía", "música", "ritmo", "sonido", etc.
   - NO incluyas NUNCA información sobre precios, costos, pagos, dinero o detalles financieros
   - NO incluyas explicaciones sobre estilo, instrumentación, producción o aspectos técnicos
   - NO uses lenguaje técnico musical
   - NO uses dígitos numéricos (0-9). Escribe TODOS los números en letras (ejemplo: 'uno' en lugar de '1', 'mil novecientos noventa' en lugar de '1990').
   - Esta regla de "no números" se aplica a TODO el contenido, incluso si el usuario proporcionó fechas o cantidades en números en los detalles.

4. PERSONALIZACIÓN:
${includeName === 'yes' && personName ? `   - Incluye el nombre "${personName}" de forma natural y emotiva en la letra (al menos 2-3 veces)\n` : '   - Enfócate en la relación y los sentimientos sin nombres específicos\n'}
${relationship ? `   - Refleja la relación "${relationship}" de manera profunda y emotiva\n` : ''}
${occasion ? `   - Adapta la letra específicamente para la ocasión: "${occasion}"\n` : ''}
${styles && styles.length > 0 ? `   - Incorpora los estilos emocionales: ${styles.join(', ')}\n` : ''}

${generateSingle ? `5. FORMATO DE RESPUESTA:
   - Devuelve ÚNICAMENTE la letra de la canción
   - NO incluyas marcadores como "Letra 1:" o títulos
   - Comienza directamente con la primera sección de la letra` : `5. GENERACIÓN DE DOS LETRAS:
   - Genera DOS letras completamente diferentes
   - Cada letra debe tener una perspectiva, estructura y enfoque emocional distintos
   - Márcalas claramente como "Letra 1:" y "Letra 2:" al inicio de cada una
   - Ambas letras deben ser igualmente válidas y de alta calidad`}

IMPORTANTE: El estilo musical se aplicará después en la producción, así que la letra debe ser universal y no mencionar géneros específicos.

Genera ahora ${generateSingle ? 'la letra' : 'las dos letras'} siguiendo estrictamente estas instrucciones:`

  return enhancedPrompt
}

