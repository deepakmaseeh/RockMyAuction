import { NextResponse } from 'next/server'

/**
 * Error handler middleware
 */
export function handleError(error, defaultMessage = 'An error occurred') {
  console.error('Error:', error)
  
  // Handle specific error types
  if (error.code === 11000) {
    return NextResponse.json(
      { success: false, error: 'Duplicate entry found' },
      { status: 400 }
    )
  }
  
  if (error.name === 'ValidationError') {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
  
  return NextResponse.json(
    { success: false, error: error.message || defaultMessage },
    { status: 500 }
  )
}

/**
 * Success response helper
 */
export function successResponse(data, message = 'Success', status = 200) {
  return NextResponse.json({
    success: true,
    message,
    ...data
  }, { status })
}

/**
 * Validation helper
 */
export function validateRequired(body, fields) {
  const errors = []
  
  fields.forEach(field => {
    if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
      errors.push(`${field} is required`)
    }
  })
  
  if (errors.length > 0) {
    return NextResponse.json(
      { success: false, error: errors.join(', ') },
      { status: 400 }
    )
  }
  
  return null
}

/**
 * Pagination helper
 */
export function getPaginationParams(req) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  
  return { page, limit, skip: (page - 1) * limit }
}








