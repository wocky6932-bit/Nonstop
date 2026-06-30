import { getLookbooks } from '@/lib/mysql'
import { LookbooksList } from '@/components/admin/lookbooks-list'

export const dynamic = 'force-dynamic'

export default async function LookbooksPage() {
  const lookbooks = await getLookbooks()

  return (
    <div className="p-6">
      <LookbooksList initialLookbooks={lookbooks} />
    </div>
  )
}
