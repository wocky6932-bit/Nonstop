"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface DeleteProductButtonProps {
  productId: string
  onProductDeleted?: () => void
}

export function DeleteProductButton({ productId, onProductDeleted }: DeleteProductButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch('/api/admin/delete-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete product')
      }

      const data = await response.json()

      console.log('📊 Delete response:', data)

      // Afficher un message détaillé basé sur l'action
      let title = "Action effectuée"
      let description = ""

      if (data.action === 'marked_sold_out') {
        description = `Produit marqué comme indisponible (${data.details?.orderItemsCount || 'présence dans'} élément(s) de commande)`
        title = "Produit conservé (avec historique)"
      } else if (data.action === 'deleted') {
        description = "Produit supprimé définitivement"
        title = "Produit supprimé"
      } else {
        description = data.message || "Action effectuée avec succès"
      }

      console.log('💬 Showing toast:', { title, description })

      toast({
        title: title,
        description: description,
      })

      // Appeler le callback pour rafraîchir la liste si fourni
      console.log('🔄 Refreshing product list after deletion...')
      if (onProductDeleted) {
        console.log('📞 Calling onProductDeleted callback...')
        onProductDeleted()
      } else {
        console.log('🔄 Using router.refresh()...')
        router.refresh()
      }
    } catch (error: any) {
      console.error("[v0] Delete error:", error.message || error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le produit.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le produit sera définitivement supprimé.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
