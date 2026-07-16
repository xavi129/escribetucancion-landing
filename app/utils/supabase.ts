import { createClient } from "@supabase/supabase-js"

// Crear cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Función para guardar o actualizar un pedido en Supabase
export async function saveOrderToSupabase(orderData: any) {
  try {
    // Determinar el valor de spotify_upload basado en spotifyUpload o spotify_upload
    let isSpotify = false;
    
    // Procesar el valor de spotifyUpload (usado en el formulario)
    if (orderData.spotifyUpload !== undefined) {
      // Convertir el valor de texto a booleano - solo "yes" debe ser true
      isSpotify = orderData.spotifyUpload === "yes";
    } 
    // Procesar el valor de spotify_upload (usado en la base de datos)
    else if (orderData.spotify_upload !== undefined) {
      // Usar el valor existente si ya es booleano o string - solo true o "yes" deben ser true
      isSpotify = orderData.spotify_upload === true || orderData.spotify_upload === "yes";
    }
    
    // Asignar el valor correcto a spotify_upload
    orderData.spotify_upload = isSpotify;
    
    // Asegurarse de que los campos requeridos existen
    const requiredFields = {
      generated_lyric: "",
      delivery_type: "standard",  // Campo requerido según el esquema
      customer_name: orderData.customer_name || "",
      whatsapp: orderData.whatsapp || "",
      email: orderData.email || "",
      song_type: orderData.song_type || "lite",  // Campo requerido según el esquema
      spotify_upload: orderData.spotify_upload !== undefined ? orderData.spotify_upload : false,  // Nuevo campo para la opción de Spotify como booleano
      video: orderData.video !== undefined ? orderData.video : false,
      currency: orderData.currency || "MXN"  // Moneda del pedido, default MXN
    }

    // Combinar los datos proporcionados con los valores predeterminados para campos requeridos
    const completeOrderData = {
      ...orderData,
      ...Object.entries(requiredFields).reduce((acc, [key, defaultValue]) => {
        if (!(key in orderData) || orderData[key] === undefined) {
          (acc as Record<string, any>)[key] = defaultValue;
        }
        return acc;
      }, {} as Record<string, any>)
    }

    // Buscar si ya existe un registro EN PROGRESO para este cliente (por email o whatsapp)
    // Solo actualizamos pedidos que están en proceso (early_lead, lead, new, pending)
    // No actualizamos pedidos completados, cancelados o entregados
    let existingOrder = null;
    
    if (completeOrderData.email || completeOrderData.whatsapp) {
      let orQuery = "";
      if (completeOrderData.email && completeOrderData.whatsapp) {
          orQuery = `email.eq.${completeOrderData.email},whatsapp.eq.${completeOrderData.whatsapp}`;
      } else if (completeOrderData.email) {
          orQuery = `email.eq.${completeOrderData.email}`;
      } else if (completeOrderData.whatsapp) {
          orQuery = `whatsapp.eq.${completeOrderData.whatsapp}`;
      }

      if (orQuery) {
        const { data: existingData, error: searchError } = await supabase
          .from("orders")
          .select("*")
          .or(orQuery)
          .in('status', ['early_lead', 'lead', 'new', 'pending']) // Solo pedidos en progreso
          .order('created_at', { ascending: false })
          .limit(1);

        if (!searchError && existingData && existingData.length > 0) {
          existingOrder = existingData[0];
        }
      }
    }

    // Si existe un registro EN PROGRESO, actualizarlo en lugar de crear uno nuevo
    if (existingOrder) {
      // Actualizar campos, pero mantener el transaction_id original y created_at
      const updateData = {
        ...completeOrderData,
        transaction_id: existingOrder.transaction_id, // Mantener el ID original
        created_at: existingOrder.created_at, // Mantener la fecha de creación original
        updated_at: new Date().toISOString() // Actualizar la fecha de modificación
      };

      const { data, error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", existingOrder.id)
        .select();

      if (error) {
        console.error("Error updating order in Supabase:", error);
        return { success: false, error, isUpdate: true };
      }

      console.log("Order updated successfully:", existingOrder.transaction_id);
      return { success: true, data, isUpdate: true, originalId: existingOrder.transaction_id };
    }

    // Si no existe, crear uno nuevo
    const { data, error } = await supabase.from("orders").insert([completeOrderData]).select()

    if (error) {
      console.error("Error saving to Supabase:", error)
      return { success: false, error, isUpdate: false }
    }

    console.log("New order created successfully:", completeOrderData.transaction_id);
    return { success: true, data, isUpdate: false }
  } catch (error) {
    console.error("Exception when saving to Supabase:", error)
    return { success: false, error }
  }
}

// Función para actualizar la letra de una canción existente
export async function updateSongLyrics(
  orderId: string,
  lyrics: string,
  status: string = "lyrics_ready",
  options?: { incrementRevisionCount?: boolean }
) {
  try {
    const shouldIncrement = options?.incrementRevisionCount ?? true

    let newRevisionCount: number | undefined
    if (shouldIncrement) {
      // Primero obtener el registro actual para incrementar el contador de revisiones
      const { data: currentOrder, error: fetchError } = await supabase
        .from("orders")
        .select("lyric_revision_count")
        .eq("id", orderId)
        .single()

      if (fetchError) {
        console.error("Error fetching current order:", fetchError)
        // Continuar de todas formas, usar 0 como valor por defecto
      }

      const currentRevisionCount = currentOrder?.lyric_revision_count || 0
      newRevisionCount = currentRevisionCount + 1
    }

    const updatePayload: Record<string, any> = {
      generated_lyric: lyrics,
      updated_at: new Date().toISOString(),
      status, // Actualizar el estado al guardar la letra
    }

    if (shouldIncrement) {
      updatePayload.lyric_revision_count = newRevisionCount
    }

    // Actualizar la letra (y opcionalmente el contador de revisiones) y la fecha de actualización
    const { data, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId)
      .select()

    if (error) {
      console.error("Error updating lyrics in Supabase:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Exception when updating lyrics in Supabase:", error)
    return { success: false, error }
  }
}

export async function fetchOrderById(orderId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, song_type, generated_lyric, lyric_revision_count, extra_editions, occasion, include_name, person_name, relationship, genre, styles, currency"
      )
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("Error fetching order by id:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Exception when fetching order by id:", error)
    return { success: false, error }
  }
}

export async function updateOrderExtraEditions(orderId: string, extraEditions: number) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        extra_editions: extraEditions,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()

    if (error) {
      console.error("Error updating extra editions:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Exception when updating extra editions:", error)
    return { success: false, error }
  }
}

export async function incrementLyricRevisionCount(orderId: string) {
  try {
    const { data: currentOrder, error: fetchError } = await supabase
      .from("orders")
      .select("lyric_revision_count")
      .eq("id", orderId)
      .single()

    if (fetchError) {
      console.error("Error fetching current order for revision count:", fetchError)
      return { success: false, error: fetchError }
    }

    const currentRevisionCount = currentOrder?.lyric_revision_count || 0
    const newRevisionCount = currentRevisionCount + 1

    const { data, error } = await supabase
      .from("orders")
      .update({
        lyric_revision_count: newRevisionCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select("lyric_revision_count")
      .single()

    if (error) {
      console.error("Error incrementing lyric revision count:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Exception when incrementing lyric revision count:", error)
    return { success: false, error }
  }
}

export default supabase

