import { csvLotRowSchema } from './lot';

// Simple CSV parser (since papaparse might not be installed)
export async function parseCSV(file, options = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          resolve({ valid: [], invalid: [], errors: [] });
          return;
        }

        // Parse header
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const valid = [];
        const invalid = [];
        const errors = [];

        // Parse rows
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          const row = {};
          
          headers.forEach((header, idx) => {
            row[header] = values[idx]?.trim() || '';
          });

          try {
            // Parse JSON fields
            if (row.attributes && typeof row.attributes === 'string') {
              try {
                row.attributes = JSON.parse(row.attributes);
              } catch {
                row.attributes = {};
              }
            }

            // Parse images (semicolon-separated)
            if (row.images && typeof row.images === 'string') {
              row.images = row.images.split(';').map(url => url.trim()).filter(Boolean);
            }

            // Validate row
            const validated = csvLotRowSchema.parse(row);
            valid.push({ ...validated, _rowIndex: i });
          } catch (error) {
            invalid.push({
              row: i,
              data: row,
              error: error.message || 'Validation failed'
            });
            errors.push({
              row: i,
              field: error.path?.[0] || 'unknown',
              message: error.message || 'Validation failed'
            });
          }
        }

        resolve({ valid, invalid, errors });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// Helper to parse CSV line handling quoted values
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  
  return values;
}

/**
 * Convert lots to CSV format
 * @param {Array} lots - Array of lot objects
 * @param {Array} fields - Fields to include in export
 * @returns {string} CSV string
 */
export function exportLotsToCSV(lots, fields = null) {
  const defaultFields = [
    'lotNumber',
    'title',
    'description',
    'condition',
    'category',
    'quantity',
    'estimateLow',
    'estimateHigh',
    'reservePrice',
    'startingBid',
    'featured',
    'attributes',
    'images'
  ];

  const fieldsToExport = fields || defaultFields;
  
  // Build header
  const header = fieldsToExport.join(',');
  
  // Build rows
  const rows = lots.map(lot => {
    const values = fieldsToExport.map(field => {
      let value = '';
      
      if (field === 'attributes') {
        value = JSON.stringify(lot.attributes || {});
      } else if (field === 'images') {
        const images = lot.images || (lot.lotImages || []).map(img => img.url || img);
        value = Array.isArray(images) ? images.join(';') : '';
      } else {
        value = lot[field] || '';
      }
      
      // Escape quotes and wrap in quotes if contains comma
      if (String(value).includes(',') || String(value).includes('"')) {
        value = '"' + String(value).replace(/"/g, '""') + '"';
      }
      
      return value;
    });
    
    return values.join(',');
  });

  return [header, ...rows].join('\n');
}

/**
 * Convert lots to Excel format (CSV with Excel-compatible headers)
 */
export function exportLotsToExcel(lots, fields = null) {
  return exportLotsToCSV(lots, fields);
}








