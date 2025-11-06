'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import LotBuilder from '@/components/catalog/LotBuilder'

export default function EditLotPage() {
  const router = useRouter()
  const params = useParams()

  const handleSave = (lot) => {
    router.push(`/catalogues/${params.id}`)
  }

  const handleCancel = () => {
    router.push(`/catalogues/${params.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181B] via-[#1f1f23] to-[#232326] p-6">
      <div className="max-w-7xl mx-auto">
        <LotBuilder
          lotId={params.lotId}
          catalogueId={params.id}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}


