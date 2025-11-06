import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lot from '@/lib/models/Lot';
import LotImage from '@/lib/models/LotImage';
import { parseCSV, exportLotsToCSV } from '@/lib/utils/csv';

// POST /api/admin/lots/import - Import lots from CSV
export async function POST(request) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const file = formData.get('file');
    const auctionId = formData.get('auctionId');
    const dryRun = formData.get('dryRun') === 'true';
    
    if (!file || !auctionId) {
      return NextResponse.json(
        { success: false, error: 'File and auctionId are required' },
        { status: 400 }
      );
    }
    
    // Parse CSV
    const { valid, invalid, errors } = await parseCSV(file);
    
    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        valid: valid.length,
        invalid: invalid.length,
        errors,
        preview: valid.slice(0, 10) // Preview first 10 valid rows
      });
    }
    
    // Import lots
    const imported = [];
    const failed = [];
    
    for (const row of valid) {
      try {
        // Check lot number uniqueness
        const existing = await Lot.findOne({
          auctionId,
          lotNumber: row.lotNumber
        });
        
        if (existing) {
          failed.push({
            row: row._rowIndex,
            lotNumber: row.lotNumber,
            error: 'Lot number already exists'
          });
          continue;
        }
        
        // Create lot
        const lot = new Lot({
          ...row,
          auctionId,
          seoSlug: row.title
            ?.toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') || `lot-${row.lotNumber}`
        });
        
        await lot.save();
        
        // Add images
        if (row.images && Array.isArray(row.images)) {
          const lotImages = row.images.map((url, index) => ({
            lotId: lot._id,
            url,
            sortOrder: index,
            alt: row.title || ''
          }));
          
          if (lotImages.length > 0) {
            await LotImage.insertMany(lotImages);
          }
        }
        
        imported.push({
          lotNumber: lot.lotNumber,
          title: lot.title,
          id: lot._id
        });
      } catch (error) {
        failed.push({
          row: row._rowIndex,
          lotNumber: row.lotNumber,
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      imported: imported.length,
      failed: failed.length,
      importedLots: imported,
      failures: failed
    });
  } catch (error) {
    console.error('Error importing lots:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/admin/lots/export - Export lots to CSV
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const auctionId = searchParams.get('auctionId');
    const fields = searchParams.get('fields')?.split(',');
    
    const query = {};
    if (auctionId) query.auctionId = auctionId;
    
    const lots = await Lot.find(query)
      .sort({ lotNumber: 1 })
      .lean();
    
    // Populate images
    const lotsWithImages = await Promise.all(
      lots.map(async (lot) => {
        const images = await LotImage.find({ lotId: lot._id })
          .sort({ sortOrder: 1 })
          .lean();
        return {
          ...lot,
          images: images.map(img => img.url)
        };
      })
    );
    
    const csv = exportLotsToCSV(lotsWithImages, fields);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="lots-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting lots:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}





