'use client'

import { useRouter } from 'next/navigation'
import CatalogueBuilder from '@/components/catalog/CatalogueBuilder'

export default function NewCataloguePage() {
  const router = useRouter()

  const handleSave = (catalogue) => {
    router.push(`/catalogues/${catalogue._id}`)
  }

  const handleCancel = () => {
    router.push('/catalogues')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] p-6">
      <div className="max-w-7xl mx-auto">
        <CatalogueBuilder
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

