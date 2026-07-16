"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateSongLyrics } from "@/app/utils/supabase"
import supabase from "@/app/utils/supabase"

interface Order {
  id: string
  transaction_id: string
  customer_name: string
  song_type: string
  generated_lyric: string
  created_at: string
  video?: boolean
}

export default function LyricsAdmin() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedLyric, setEditedLyric] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("id, transaction_id, customer_name, song_type, generated_lyric, created_at, video")
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) {
          console.error("Error fetching orders:", error)
          return
        }

        setOrders(data || [])
      } catch (error) {
        console.error("Exception fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleEdit = (order: Order) => {
    setEditingId(order.id)
    setEditedLyric(order.generated_lyric || "")
  }

  const handleSave = async () => {
    if (!editingId) return

    setSaving(true)
    try {
      const result = await updateSongLyrics(editingId, editedLyric)

      if (result.success) {
        // Update the local state
        setOrders(orders.map((order) => (order.id === editingId ? { ...order, generated_lyric: editedLyric } : order)))
        setEditingId(null)
      } else {
        console.error("Failed to update lyrics:", result.error)
      }
    } catch (error) {
      console.error("Error saving lyrics:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditedLyric("")
  }

  if (loading) {
    return <div className="p-8 text-center">Cargando letras de canciones...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Administración de Letras de Canciones</h1>

      {orders.length === 0 ? (
        <p>No hay pedidos con letras de canciones.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Pedido: {order.transaction_id}</span>
                  <span className="text-sm font-normal text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </CardTitle>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  Cliente: {order.customer_name} | Tipo: {order.song_type}
                  {order.video && (
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-red-400">
                      🎥 Video
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingId === order.id ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editedLyric}
                      onChange={(e) => setEditedLyric(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCancel} disabled={saving}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Guardando..." : "Guardar cambios"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="whitespace-pre-line bg-gray-50 p-4 rounded border text-sm">
                      {order.generated_lyric || <em className="text-gray-400">Sin letra generada</em>}
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={() => handleEdit(order)}>
                        Editar letra
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

