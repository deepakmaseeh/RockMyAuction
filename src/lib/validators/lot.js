// Simple validation helpers (zod alternative)
// Install zod: npm install zod for full validation

export function validateLotNumber(lotNumber) {
  const lotNumberRegex = /^(\d+)([A-Za-z]*)$/;
  return lotNumberRegex.test(lotNumber);
}

export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseLotNumberForSort(lotNumber) {
  const match = lotNumber.match(/^(\d+)([A-Za-z]*)$/);
  if (!match) return { numeric: 0, alpha: '' };
  return {
    numeric: parseInt(match[1], 10),
    alpha: match[2] || ''
  };
}

export function compareLotNumbers(a, b) {
  const parsedA = parseLotNumberForSort(a);
  const parsedB = parseLotNumberForSort(b);
  
  if (parsedA.numeric !== parsedB.numeric) {
    return parsedA.numeric - parsedB.numeric;
  }
  
  return parsedA.alpha.localeCompare(parsedB.alpha);
}

// Basic validation function
export function validateLotData(data) {
  const errors = [];
  
  if (!data.lotNumber || data.lotNumber.trim() === '') {
    errors.push('Lot number is required');
  }
  
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (data.title && data.title.length > 80) {
    errors.push('Title must be 80 characters or less');
  }
  
  if (data.estimateHigh < data.estimateLow) {
    errors.push('Estimate high must be >= estimate low');
  }
  
  if (data.reservePrice > 0 && data.startingBid > 0 && data.reservePrice < data.startingBid) {
    errors.push('Reserve price must be >= starting bid');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
