'use client'

import { useEffect } from 'react'
import { setupChatbotFormIntegration } from '@/lib/chatbotFormIntegration'

export default function FormIntegrationSetup() {
  useEffect(() => {
    setupChatbotFormIntegration()
  }, [])
  
  return null
}





