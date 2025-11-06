/**
 * Validation utilities for catalogues, lots, and auctions
 */

export const catalogueValidations = {
  validateTitle: (title) => {
    if (!title || title.trim() === '') {
      return { valid: false, error: 'Title is required' }
    }
    return { valid: true }
  },
  
  validateAuctionDate: (auctionDate) => {
    if (!auctionDate) {
      return { valid: false, error: 'Auction date is required' }
    }
    
    const date = new Date(auctionDate)
    if (isNaN(date.getTime())) {
      return { valid: false, error: 'Invalid auction date format' }
    }
    
    return { valid: true }
  },
  
  validateStatus: (status) => {
    const validStatuses = ['draft', 'published', 'archived']
    if (status && !validStatuses.includes(status)) {
      return { valid: false, error: `Status must be one of: ${validStatuses.join(', ')}` }
    }
    return { valid: true }
  }
}

export const lotValidations = {
  validateLotNumber: (lotNumber) => {
    if (!lotNumber || lotNumber.trim() === '') {
      return { valid: false, error: 'Lot number is required' }
    }
    return { valid: true }
  },
  
  validateTitle: (title) => {
    if (!title || title.trim() === '') {
      return { valid: false, error: 'Title is required' }
    }
    if (title.length > 80) {
      return { valid: false, error: 'Title must be 80 characters or less' }
    }
    return { valid: true }
  },
  
  validateStatus: (status) => {
    const validStatuses = ['draft', 'published', 'sold', 'passed']
    if (status && !validStatuses.includes(status)) {
      return { valid: false, error: `Status must be one of: ${validStatuses.join(', ')}` }
    }
    return { valid: true }
  },
  
  validateCondition: (condition) => {
    const validConditions = ['excellent', 'very-good', 'good', 'fair', 'poor']
    if (condition && !validConditions.includes(condition)) {
      return { valid: false, error: `Condition must be one of: ${validConditions.join(', ')}` }
    }
    return { valid: true }
  },
  
  validatePricing: (estimateLow, estimateHigh, startingBid, reservePrice) => {
    const low = Math.max(0, parseFloat(estimateLow) || 0)
    const high = Math.max(0, parseFloat(estimateHigh) || 0)
    const bid = Math.max(0, parseFloat(startingBid) || 0)
    const reserve = Math.max(0, parseFloat(reservePrice) || 0)
    
    if (low > high) {
      return { valid: false, error: 'Estimate low must be less than or equal to estimate high' }
    }
    
    if (reserve > 0 && bid > 0 && reserve < bid) {
      return { valid: false, error: 'Reserve price must be greater than or equal to starting bid' }
    }
    
    return { valid: true, values: { estimateLow: low, estimateHigh: high, startingBid: bid, reservePrice: reserve } }
  }
}

export const auctionValidations = {
  validateTitle: (title) => {
    if (!title || title.trim() === '') {
      return { valid: false, error: 'Title is required' }
    }
    return { valid: true }
  },
  
  validateDates: (startTime, endTime, endAt) => {
    if (!endTime && !endAt) {
      return { valid: false, error: 'End time is required' }
    }
    
    const start = startTime ? new Date(startTime) : new Date()
    const end = endTime ? new Date(endTime) : new Date(endAt)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { valid: false, error: 'Invalid date format' }
    }
    
    if (end <= start) {
      return { valid: false, error: 'End time must be after start time' }
    }
    
    return { valid: true, values: { startAt: start, endAt: end } }
  },
  
  validateStatus: (status) => {
    const validStatuses = ['draft', 'scheduled', 'live', 'closed']
    if (status && !validStatuses.includes(status)) {
      return { valid: false, error: `Status must be one of: ${validStatuses.join(', ')}` }
    }
    return { valid: true }
  },
  
  generateSlug: async (title, Auction) => {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Ensure slug is unique
    let slugCount = await Auction.countDocuments({ slug })
    if (slugCount > 0) {
      slug = `${slug}-${Date.now()}`
    }
    
    return slug
  }
}





