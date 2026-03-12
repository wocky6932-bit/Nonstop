"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

const statusOptions = [
  { value: 'pending', label: '🟡 En attente', color: 'text-yellow-600' },
  { value: 'delivered', label: '🟢 Livrée', color: 'text-green-600' },
  { value: 'cancelled', label: '🔴 Annulée', color: 'text-red-600' },
]

export function UpdateOrderStatusButton({
  orderId,
  currentStatus,
  onStatusUpdated,
}: {
  orderId: string
  currentStatus: string
  onStatusUpdated?: () => void
}) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true)
    setIsOpen(false)

    try {
      const response = await fetch('/api/admin/orders/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été modifié avec succès.",
      })

      if (onStatusUpdated) {
        onStatusUpdated()
      }
    } catch (error) {
      console.error("Update status error:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const currentStatusLabel = statusOptions.find(
    (option) => option.value === currentStatus
  )?.label

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        disabled={isUpdating}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isUpdating ? "..." : (currentStatusLabel || currentStatus)}
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleUpdateStatus(option.value)}
              disabled={option.value === currentStatus}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${option.color}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

