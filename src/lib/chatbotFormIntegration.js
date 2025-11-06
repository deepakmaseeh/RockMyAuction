// Chatbot Form Integration
// This allows the chatbot to interact with forms on the page

export function setupChatbotFormIntegration() {
  // Make formActions available globally for chatbot
  if (typeof window !== 'undefined') {
    window.fillCatalogueForm = (data) => {
      window.dispatchEvent(new CustomEvent('fill-catalogue-form', { detail: data }))
      return { success: true, message: 'Catalogue form filled!' }
    }
    
    window.fillLotForm = (data) => {
      window.dispatchEvent(new CustomEvent('fill-lot-form', { detail: data }))
      return { success: true, message: 'Lot form filled!' }
    }
    
    window.fillAuctionForm = (data) => {
      window.dispatchEvent(new CustomEvent('fill-auction-form', { detail: data }))
      return { success: true, message: 'Auction form filled!' }
    }
    
    window.fillSupportForm = (data) => {
      window.dispatchEvent(new CustomEvent('fill-support-form', { detail: data }))
      return { success: true, message: 'Support form filled!' }
    }
    
    window.clearForm = (formType) => {
      window.dispatchEvent(new CustomEvent('clear-form', { detail: { formType } }))
      return { success: true, message: 'Form cleared!' }
    }
    
    window.getCurrentPage = () => {
      return window.location.pathname
    }
    
    window.isFormPage = () => {
      const path = window.location.pathname
      return path.includes('/catalogues/new') || 
             path.includes('/catalogues/') && path.includes('/edit') ||
             path.includes('/lots/new') ||
             path.includes('/lots/') && path.includes('/edit') ||
             path.includes('/seller/new-auction') ||
             path.includes('/help-center') ||
             path.includes('/support')
    }
  }
}

// Parse chatbot commands and fill forms
export function parseChatbotCommand(message) {
  const lowerMessage = message.toLowerCase()
  
  // Check if it's a form fill command
  if (lowerMessage.includes('fill') || lowerMessage.includes('auto-fill') || lowerMessage.includes('autofill')) {
    const isCatalogue = lowerMessage.includes('catalogue') || lowerMessage.includes('catalog')
    const isLot = lowerMessage.includes('lot') || lowerMessage.includes('item')
    
    // If user just says "fill form" without details, use sample data
    const useSampleData = !lowerMessage.includes('title') && 
                          !lowerMessage.includes('description') && 
                          !lowerMessage.includes('price') &&
                          !lowerMessage.includes('location')
    
    if (useSampleData) {
      // Return command with useSample flag - data will be loaded in executeChatbotCommand
      return {
        action: 'fill-form',
        formType: isCatalogue ? 'catalogue' : isLot ? 'lot' : 'auto-detect',
        data: null,
        useSample: true
      }
    }
    
    // Extract form data from message using AI-like parsing
    const formData = {}
    
    // Extract title
    const titleMatch = message.match(/title[:\s]+([^\n,]+)/i)
    if (titleMatch) formData.title = titleMatch[1].trim()
    
    // Extract description
    const descMatch = message.match(/description[:\s]+([^\n]+)/i)
    if (descMatch) formData.description = descMatch[1].trim()
    
    // Extract location
    const locationMatch = message.match(/location[:\s]+([^\n,]+)/i)
    if (locationMatch) formData.location = locationMatch[1].trim()
    
    // Extract price
    const priceMatch = message.match(/(?:price|value|estimated)[:\s]+\$?([\d,]+)/i)
    if (priceMatch) {
      const price = parseFloat(priceMatch[1].replace(/,/g, ''))
      if (isLot) {
        formData.estimatedValue = price
        formData.startingPrice = price * 0.8
      }
    }
    
    return {
      action: 'fill-form',
      formType: isCatalogue ? 'catalogue' : isLot ? 'lot' : 'auto-detect',
      data: formData,
      useSample: false
    }
  }
  
  // Check if it's a clear command
  if (lowerMessage.includes('clear') || lowerMessage.includes('reset')) {
    return {
      action: 'clear-form',
      formType: 'auto-detect'
    }
  }
  
  return null
}

// Analyze image and fill form with AI-extracted data
export async function analyzeImageAndFillForm(imageBase64, formType = 'auto') {
  try {
    console.log('🔍 Analyzing image for form filling...')
    
    // Determine form type from URL if not specified
    if (formType === 'auto') {
      const path = window.location.pathname
      if (path.includes('catalogue') && !path.includes('lot')) {
        formType = 'catalogue'
      } else if (path.includes('lot')) {
        formType = 'lot'
      } else if (path.includes('new-auction') || path.includes('/seller/new-auction')) {
        formType = 'auction'
      } else if (path.includes('help-center') || path.includes('support')) {
        formType = 'support'
      } else {
        // If we can't determine form type, throw an error
        throw new Error('Could not determine form type. Please navigate to a form page.')
      }
    }

    // Call the form image analysis API
    const response = await fetch('/api/analyze-image-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageBase64,
        formType,
        imageUrl: imageBase64 // Pass the data URL as imageUrl for forms that support it
      })
    })

    const result = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to analyze image')
    }

    // Map the AI response to form fields
    const formData = mapAIResponseToFormFields(result.data, result.formType)

    // Fill the appropriate form
    if (result.formType === 'catalogue') {
      window.fillCatalogueForm(formData)
      return { 
        success: true, 
        message: '✅ Catalogue form filled with AI-extracted data from image!',
        data: formData
      }
    } else if (result.formType === 'lot') {
      window.fillLotForm(formData)
      return { 
        success: true, 
        message: '✅ Lot form filled with AI-extracted data from image!',
        data: formData
      }
    } else if (result.formType === 'auction') {
      window.fillAuctionForm(formData)
      return { 
        success: true, 
        message: '✅ Auction form filled with AI-extracted data from image!',
        data: formData
      }
    } else if (result.formType === 'support') {
      window.fillSupportForm(formData)
      return { 
        success: true, 
        message: '✅ Support form filled with AI-extracted data from image!',
        data: formData
      }
    } else {
      throw new Error('Unknown form type: ' + result.formType)
    }
  } catch (error) {
    console.error('Error analyzing image:', error)
    return {
      success: false,
      message: `Failed to analyze image: ${error.message}`
    }
  }
}

// Map AI response to form field structure
function mapAIResponseToFormFields(aiData, formType) {
  if (formType === 'catalogue') {
    return {
      title: aiData.title || '',
      description: aiData.description || '',
      location: aiData.location || '',
      auctionDate: aiData.suggestedDate ? `${aiData.suggestedDate}T10:00` : '',
      coverImage: aiData.coverImage || aiData.imageUrl || '',
      status: 'draft'
    }
  } else if (formType === 'lot') {
    // Lot form mapping
    return {
      title: aiData.title || '',
      description: aiData.description || '',
      category: aiData.category || 'Memorabilia',
      condition: aiData.condition || 'good',
      estimatedValue: aiData.estimatedValue || 0,
      startingPrice: aiData.startingPrice || 0,
      reservePrice: aiData.reservePrice || 0,
      provenance: aiData.provenance || '',
      dimensions: aiData.dimensions || { height: 0, width: 0, depth: 0, unit: 'cm' },
      weight: aiData.weight || { value: 0, unit: 'kg' },
      tags: (aiData.tags || []).join(', '),
      images: aiData.images || (aiData.imageUrl ? [aiData.imageUrl] : []),
      status: 'draft'
    }
  } else if (formType === 'auction') {
    // Auction form mapping
    return {
      title: aiData.title || '',
      description: aiData.description || '',
      category: aiData.category || 'Memorabilia',
      startingBid: aiData.startingPrice || aiData.estimatedValue || 0,
      reservePrice: aiData.reservePrice || 0,
      image: aiData.imageUrl || aiData.coverImage || '',
      imageUrl: aiData.imageUrl || aiData.coverImage || '',
      preview: aiData.imageUrl || aiData.coverImage || ''
    }
  } else if (formType === 'support') {
    // Support form mapping
    return {
      category: aiData.category || 'technical',
      email: aiData.email || '',
      subject: aiData.subject || aiData.title || 'Support Request',
      message: aiData.message || aiData.description || ''
    }
  }
  
  return {}
}

// Execute chatbot command
export async function executeChatbotCommand(command) {
  if (!command) return { success: false, message: 'No command found' }
  
  try {
    if (command.action === 'fill-form') {
      const { formType, data, useSample } = command
      
      if (useSample && !data) {
        // Load sample data dynamically
        const { sampleData } = await import('./formAutoFill')
        const pagePath = window.location.pathname
        
        if (pagePath.includes('catalogue') && !pagePath.includes('lot')) {
          window.fillCatalogueForm(sampleData.catalogue)
          return { success: true, message: '✅ Catalogue form filled with sample data!' }
        } else if (pagePath.includes('lot')) {
          window.fillLotForm(sampleData.lot)
          return { success: true, message: '✅ Lot form filled with sample data!' }
        }
      }
      
      if (formType === 'catalogue' || (formType === 'auto-detect' && window.location.pathname.includes('catalogue') && !window.location.pathname.includes('lot'))) {
        window.fillCatalogueForm(data)
        return { success: true, message: '✅ Catalogue form filled successfully!' }
      } else if (formType === 'lot' || (formType === 'auto-detect' && window.location.pathname.includes('lot'))) {
        window.fillLotForm(data)
        return { success: true, message: '✅ Lot form filled successfully!' }
      } else if (formType === 'auction' || (formType === 'auto-detect' && (window.location.pathname.includes('new-auction') || window.location.pathname.includes('/seller/new-auction')))) {
        window.fillAuctionForm(data)
        return { success: true, message: '✅ Auction form filled successfully!' }
      } else if (formType === 'support' || (formType === 'auto-detect' && (window.location.pathname.includes('help-center') || window.location.pathname.includes('support')))) {
        window.fillSupportForm(data)
        return { success: true, message: '✅ Support form filled successfully!' }
      }
    } else if (command.action === 'clear-form') {
      window.clearForm(command.formType)
      return { success: true, message: '✅ Form cleared!' }
    }
    
    return { success: false, message: 'Unknown command' }
  } catch (error) {
    console.error('Error executing chatbot command:', error)
    return { success: false, message: error.message }
  }
}
