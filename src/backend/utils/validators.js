/**
 * Validation utilities for auctions
 */

export const auctionValidations = {
  validateTitle: (title) => {
    if (!title || title.trim() === '') {
      return { valid: false, error: 'Title is required' };
    }
    return { valid: true };
  },
  
  validateDates: (startTime, endTime, endAt) => {
    if (!endTime && !endAt) {
      return { valid: false, error: 'End time is required' };
    }
    
    const start = startTime ? new Date(startTime) : new Date();
    const end = endTime ? new Date(endTime) : new Date(endAt);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }
    
    if (end <= start) {
      return { valid: false, error: 'End time must be after start time' };
    }
    
    return { valid: true, values: { startAt: start, endAt: end } };
  },
  
  validateStatus: (status) => {
    const validStatuses = ['draft', 'scheduled', 'live', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return { valid: false, error: `Status must be one of: ${validStatuses.join(', ')}` };
    }
    return { valid: true };
  },
  
  generateSlug: async (title, Auction) => {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Ensure slug is unique
    let slugCount = await Auction.countDocuments({ slug });
    if (slugCount > 0) {
      slug = `${slug}-${Date.now()}`;
    }
    
    return slug;
  }
};






