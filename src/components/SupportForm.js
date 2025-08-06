'use client'
import { useState } from 'react'

// In your SupportForm component
export default function SupportForm() {
  const [formData, setFormData] = useState({
    category: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Handle form submission
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <select
        name="category"
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
        className="bg-[#252529] text-white rounded p-2"
        required
        suppressHydrationWarning={true} // Add this
      >
        <option value="">Select a category</option>
        <option value="billing">Billing</option>
        <option value="technical">Technical Support</option>
        <option value="account">Account Issues</option>
      </select>

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
        placeholder="Your email"
        className="bg-[#252529] text-white rounded p-2"
        suppressHydrationWarning={true} // Add this
      />

      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
        required
        placeholder="Subject"
        className="bg-[#252529] text-white rounded p-2"
        suppressHydrationWarning={true} // Add this
      />

      <textarea
        name="message"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        required
        placeholder="Describe your issue"
        className="bg-[#252529] text-white rounded p-2 h-24"
        suppressHydrationWarning={true} // Add this
      />

      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white rounded p-2 font-semibold"
        disabled={isSubmitting}
        suppressHydrationWarning={true} // Add this
      >
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  )
}
