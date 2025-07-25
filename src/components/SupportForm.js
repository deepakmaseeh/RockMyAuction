'use client'
import { useState } from 'react'

export default function SupportForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    const formData = new FormData(e.target)
    // Simulate async API submission
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
    }, 1200)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">
      <select name="category" className="bg-[#252529] text-white rounded p-2" required>
        <option value="">Choose topic...</option>
        <option>Technical Issue</option>
        <option>Account/Billing</option>
        <option>Auction/Listing</option>
        <option>Feedback</option>
        <option>Other</option>
      </select>
      <input
        type="email"
        name="email"
        required
        placeholder="Your email"
        className="bg-[#252529] text-white rounded p-2"
      />
      <input
        type="text"
        name="subject"
        required
        placeholder="Subject"
        className="bg-[#252529] text-white rounded p-2"
      />
      <textarea
        name="description"
        rows={3}
        required
        placeholder="Describe your issue..."
        className="bg-[#252529] text-white rounded p-2"
      />
      <input type="file" name="attachments" multiple className="text-xs" />
      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white rounded p-2 font-semibold"
        disabled={loading}
      >
        {loading ? "Sending..." : "Submit Request"}
      </button>
      {success && <p className="text-green-400">Thank you! Our team will get back to you soon.</p>}
      {error && <p className="text-red-400">{error}</p>}
    </form>
  )
}
