import { parseString } from 'fast-csv';

const STRING_FIELDS = [
  'lotNumber',
  'title',
  'subtitle',
  'companyCategory',
  'category',
  'descriptionHtml',
  'additionalDescriptionHtml',
  'videoUrl',
];

const NUMERIC_FIELDS = [
  'quantity',
  'estimateLow',
  'estimateHigh',
  'startingBid',
  'reservePrice',
  'sequence',
];

export const parseCsvBuffer = async (buffer) =>
  new Promise((resolve, reject) => {
    const rows = [];
    parseString(buffer.toString('utf8'), {
      headers: true,
      ignoreEmpty: true,
      trim: true,
    })
      .on('error', reject)
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows));
  });

export const mapCsvRowToLot = (row) => {
  const mapped = {};

  STRING_FIELDS.forEach((field) => {
    if (row[field]) mapped[field] = row[field];
  });

  NUMERIC_FIELDS.forEach((field) => {
    if (row[field] !== undefined && row[field] !== '') {
      mapped[field] = Number(row[field]);
    }
  });

  if (row.attributes) {
    try {
      mapped.attributes = JSON.parse(row.attributes);
    } catch (error) {
      throw new Error(`Invalid JSON in attributes column: ${error.message}`);
    }
  }

  if (row.images) {
    mapped.images = row.images
      .split(';')
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url, index) => ({
        url,
        order: index + 1,
        caption: '',
      }));
  }

  mapped.requiresApproval = row.requiresApproval === 'true' || row.requiresApproval === true;
  mapped.featured = row.featured === 'true' || row.featured === true;

  return mapped;
};

export const lotsToCsv = (lots = []) => {
  const header = [
    'lotNumber',
    'title',
    'subtitle',
    'companyCategory',
    'category',
    'descriptionHtml',
    'additionalDescriptionHtml',
    'quantity',
    'estimateLow',
    'estimateHigh',
    'startingBid',
    'reservePrice',
    'status',
    'featured',
    'requiresApproval',
    'attributes',
    'images',
  ];

  const rows = lots.map((lot) => {
    const attributes = lot.attributes ? JSON.stringify(Object.fromEntries(lot.attributes)) : '{}';
    const images = Array.isArray(lot.images)
      ? lot.images.map((img) => img.url).join(';')
      : '';

    return [
      lot.lotNumber || '',
      lot.title || '',
      lot.subtitle || '',
      lot.companyCategory || '',
      lot.category || '',
      lot.descriptionHtml || '',
      lot.additionalDescriptionHtml || '',
      lot.quantity ?? '',
      lot.estimateLow ?? '',
      lot.estimateHigh ?? '',
      lot.startingBid ?? '',
      lot.reservePrice ?? '',
      lot.status || 'draft',
      lot.featured ? 'true' : 'false',
      lot.requiresApproval ? 'true' : 'false',
      attributes,
      images,
    ]
      .map((value) => {
        const stringValue = value?.toString() ?? '';
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',');
  });

  return [header.join(','), ...rows].join('\n');
};

