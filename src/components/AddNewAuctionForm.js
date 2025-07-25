'use client'

import { useState, useRef } from 'react'

const categories = [
  "Electronics",
  "Art",
  "Collectibles",
  "Photography",
  "Watches",
  "Jewelry",
  "Antiques",
  "Memorabilia",
  "Rare Shoes",
]

export default function AddNewAuctionForm() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [description, setDescription] = useState('')
  const [startingBid, setStartingBid] = useState('')
  const [reservePrice, setReservePrice] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const dropRef = useRef(null)

  // Drag and Drop Handlers
  const handleDrop = e => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      // Optional: AI-detect demo
      setTitle('Vintage Leica M3 Rangefinder Camera')
      setCategory(categories[0])
      setDescription("A timeless classic, the Leica M3 is renowned for its precision engineering and iconic design. This particular model is in excellent condition, showing minimal signs of wear consistent with its age. Perfect for collectors and film photography enthusiasts. Includes original leather case.")
    }
  }

  const handleDrag = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleUploadClick = () => {
    dropRef.current.click()
  }

  const handleInputChange = e => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setTitle('Vintage Leica M3 Rangefinder Camera')
      setCategory(categories[0])
      setDescription("A timeless classic, the Leica M3 is renowned for its precision engineering and iconic design. This particular model is in excellent condition, showing minimal signs of wear consistent with its age. Perfect for collectors and film photography enthusiasts. Includes original leather case.")
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    if (!image || !title || !startingBid || !startTime || !endTime) {
      setError("Please fill all required fields and add an image.")
      setSubmitting(false)
      return
    }
    // Replace with API call for production use
    alert("Auction submitted! (not yet saved in database)")
    setSubmitting(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto m-10 bg-[#18181B] text-white rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 shadow"
    >
      {/* Left section: Image upload and AI fields */}
      <div className="md:col-span-2">
        {/* Drag & Drop Image */}
        <label className="block font-bold mb-2">Upload Product Image</label>
        <p className="text-xs text-gray-400 mb-3">High-resolution images lead to better AI analysis.</p>
        <div
          className={`bg-[#232326] rounded-lg flex flex-col items-center justify-center h-64 mb-4 border border-dashed border-orange-500 cursor-pointer transition ${preview ? '' : 'hover:bg-[#232326]/80'}`}
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onClick={handleUploadClick}
        >
          <input
            type="file"
            accept="image/*"
            ref={dropRef}
            style={{ display: "none" }}
            onChange={handleInputChange}
          />
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-48 rounded" />
          ) : (
            <span className="flex flex-col items-center text-gray-500">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 014-4h10a4 4 0 014 4M7 10V4m0 6l4-4m-4 4l-4-4" /></svg>
              Drag & drop or <span className="text-orange-400 underline ml-1">browse</span>
            </span>
          )}
        </div>

        {/* AI Detected Fields */}
        <div className="mt-6 bg-[#212126] rounded-lg p-4">
          <h3 className="font-bold mb-4 text-orange-400 flex items-center gap-2">
            <svg width="22" height="22" className="inline mr-1" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M11 7v4l2.5 2.5"/></svg>
            AI-Detected Details
          </h3>
          <div className="grid gap-3">
            <label className="text-xs text-gray-400">Listing Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#252529] rounded px-3 py-2 text-white mb-2"
              placeholder="Detected product name"
              required
            />
            <label className="text-xs text-gray-400 mt-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-[#252529] rounded px-3 py-2 text-white mb-2"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <label className="text-xs text-gray-400 mt-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-[#252529] rounded px-3 py-2 text-white"
              rows={4}
              required
            />
          </div>
        </div>
      </div>

      {/* Right section: Pricing & timing */}
      <div className="space-y-6">
        <div className="bg-[#232326] rounded-lg p-4">
          <h3 className="font-bold mb-2">Pricing & Quantity</h3>
          <label className="text-xs text-gray-400">Starting Bid (USD)</label>
          <input
            type="number"
            min={0}
            step={10}
            value={startingBid}
            onChange={e => setStartingBid(e.target.value)}
            className="w-full bg-[#252529] rounded px-3 py-2 text-white mb-2"
            required
          />
          <label className="text-xs text-gray-400">Reserve Price (Optional)</label>
          <input
            type="number"
            min={0}
            step={10}
            value={reservePrice}
            onChange={e => setReservePrice(e.target.value)}
            className="w-full bg-[#252529] rounded px-3 py-2 text-white mb-2"
          />
          <label className="text-xs text-gray-400">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-full bg-[#252529] rounded px-3 py-2 text-white"
            required
          />
        </div>
        <div className="bg-[#232326] rounded-lg p-4">
          <h3 className="font-bold mb-2 text-orange-400">Auction Timing</h3>
          <label className="text-xs text-gray-400">Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full bg-[#252529] rounded px-3 py-2 text-white mb-2"
            required
          />
          <label className="text-xs text-gray-400">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full bg-[#252529] rounded px-3 py-2 text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full mt-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Auction"}
        </button>
        {error && <div className="p-2 bg-red-900/40 text-red-400 text-sm rounded mt-2">{error}</div>}
      </div>
    </form>
  )
}
