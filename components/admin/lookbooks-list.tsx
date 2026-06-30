"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export function LookbooksList({ initialLookbooks }: { initialLookbooks: any[] }) {
  const [lookbooks, setLookbooks] = useState(initialLookbooks)
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce lookbook ?")) return

    setIsDeleting(id)
    try {
      const res = await fetch(`/api/admin/lookbooks/${id}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) throw new Error('Erreur de suppression')
      
      setLookbooks(lookbooks.filter(lb => lb.id !== id))
      toast({ title: "Lookbook supprimé" })
      router.refresh()
    } catch (err) {
      console.error(err)
      toast({ title: "Erreur", variant: "destructive" })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lookbooks Interactifs</h1>
        <Link href="/admin/lookbooks/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Lookbook
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {lookbooks.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Aucun lookbook interactif pour le moment.
          </div>
        ) : (
          <div className="divide-y">
            {lookbooks.map((lb: any) => (
              <div key={lb.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden relative">
                    <img src={lb.image_url} alt={lb.title} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h3 className="font-medium">{lb.title}</h3>
                    <p className="text-sm text-gray-500">
                      {lb.pins?.length || 0} tag(s) produit
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${lb.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {lb.is_active ? 'Actif' : 'Inactif'}
                  </span>
                  
                  <Link href={`/admin/lookbooks/${lb.id}`}>
                    <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(lb.id)}
                    disabled={isDeleting === lb.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
