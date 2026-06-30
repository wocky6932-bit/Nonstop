import { getLookbooks } from '@/lib/mysql'
import { LookbookForm } from '@/components/admin/lookbook-form'
import { notFound } from 'next/navigation'

export default async function EditLookbookPage({ params }: { params: { id: string } }) {
  const lookbooks = await getLookbooks()
  const lookbook = lookbooks.find((lb: any) => lb.id === params.id)

  if (!lookbook) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <LookbookForm initialData={lookbook} />
    </div>
  )
}
