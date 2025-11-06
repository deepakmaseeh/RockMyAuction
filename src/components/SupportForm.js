'use client'
import { useState, useRef, useEffect } from 'react'

export default function SupportForm() {
  const [formData, setFormData] = useState({
    category: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)
  const [progress, setProgress] = useState(0)
  const textareaRef = useRef(null)

  // Calculate form completion progress
  useEffect(() => {
    const filledFields = Object.values(formData).filter(value => value.trim() !== '').length
    const totalFields = Object.keys(formData).length
    setProgress((filledFields / totalFields) * 100)
  }, [formData])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [formData.message])

  // ✅ Listen for chatbot form fill events
  useEffect(() => {
    const handleFillForm = (event) => {
      const data = event.detail
      if (data.category) setFormData(prev => ({ ...prev, category: data.category }))
      if (data.email) setFormData(prev => ({ ...prev, email: data.email }))
      if (data.subject) setFormData(prev => ({ ...prev, subject: data.subject }))
      if (data.message) setFormData(prev => ({ ...prev, message: data.message }))
    }

    const handleClearForm = () => {
      setFormData({
        category: '',
        email: '',
        subject: '',
        message: ''
      })
    }

    window.addEventListener('fill-support-form', handleFillForm)
    window.addEventListener('clear-form', handleClearForm)

    return () => {
      window.removeEventListener('fill-support-form', handleFillForm)
      window.removeEventListener('clear-form', handleClearForm)
    }
  }, [])

  const categories = [
    { value: 'billing', label: 'Billing & Payments', icon: '💳', color: 'from-green-500 to-emerald-500' },
    { value: 'technical', label: 'Technical Support', icon: '🔧', color: 'from-blue-500 to-cyan-500' },
    { value: 'account', label: 'Account Issues', icon: '👤', color: 'from-purple-500 to-pink-500' },
    { value: 'auction', label: 'Auction Support', icon: '🔨', color: 'from-orange-500 to-red-500' },
    { value: 'other', label: 'Other', icon: '💬', color: 'from-gray-500 to-gray-600' }
  ]

  const validateField = (name, value) => {
    let error = ''
    
    switch (name) {
      case 'email':
        if (!value) error = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Please enter a valid email'
        break
      case 'subject':
        if (!value) error = 'Subject is required'
        else if (value.length < 5) error = 'Subject must be at least 5 characters'
        break
      case 'message':
        if (!value) error = 'Message is required'
        else if (value.length < 10) error = 'Message must be at least 10 characters'
        break
      case 'category':
        if (!value) error = 'Please select a category'
        break
    }
    
    return error
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
    setFocusedField(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Shake animation for errors
      const form = e.target
      form.classList.add('animate-shake')
      setTimeout(() => form.classList.remove('animate-shake'), 500)
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          category: '',
          email: '',
          subject: '',
          message: ''
        })
        setIsSuccess(false)
      }, 3000)
      
    } catch (error) {
      setErrors({ submit: 'Failed to submit. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-gradient-to-br from-[#18181B] to-[#232326] rounded-2xl p-6 sm:p-8 border border-green-500/30 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Request Submitted! 🎉</h3>
          <p className="text-gray-300 text-sm sm:text-base mb-4">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Ticket created successfully</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-[#18181B] to-[#232326] rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#333] shadow-xl">
      {/* Info Banner about Chatbot */}
      <div className="mb-4 bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-xl">🤖</span>
          <div className="flex-1">
            <p className="font-semibold text-blue-300 mb-1 text-xs">AI-Powered Form Filling</p>
            <p className="text-gray-300 text-xs">
              Upload an image via the chatbot (bottom right) and say <strong>"fill the form"</strong> to automatically fill this form with AI-extracted details!
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Get Support</h2>
            <p className="text-gray-400 text-sm sm:text-base">We're here to help you 24/7</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-400">Form Progress</span>
            <span className="text-xs sm:text-sm text-orange-400 font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-white mb-3">
            What can we help you with? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  formData.category === category.value
                    ? `border-orange-500 bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                    : 'border-gray-600 bg-[#2a2a2e] hover:border-gray-500 hover:bg-[#323236] text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg sm:text-xl">{category.icon}</span>
                  <span className="text-sm sm:text-base font-medium">{category.label}</span>
                </div>
                {formData.category === category.value && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.category}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-white mb-2">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('email')}
              onBlur={handleBlur}
              placeholder="your.email@example.com"
              className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-[#2a2a2e] border-2 rounded-xl text-white placeholder-gray-400 text-sm sm:text-base transition-all duration-200 ${
                errors.email 
                  ? 'border-red-500 focus:border-red-400' 
                  : focusedField === 'email' 
                    ? 'border-orange-500 focus:border-orange-400 ring-2 ring-orange-500/20' 
                    : 'border-gray-600 focus:border-gray-500'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject Input */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-white mb-2">
            Subject *
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('subject')}
              onBlur={handleBlur}
              placeholder="Brief description of your issue"
              className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-[#2a2a2e] border-2 rounded-xl text-white placeholder-gray-400 text-sm sm:text-base transition-all duration-200 ${
                errors.subject 
                  ? 'border-red-500 focus:border-red-400' 
                  : focusedField === 'subject' 
                    ? 'border-orange-500 focus:border-orange-400 ring-2 ring-orange-500/20' 
                    : 'border-gray-600 focus:border-gray-500'
              }`}
            />
          </div>
          {errors.subject && (
            <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message Textarea */}
        <div>
          <label className="block text-sm sm:text-base font-semibold text-white mb-2">
            Message *
          </label>
          <div className="relative">
            <div className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <textarea
              ref={textareaRef}
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('message')}
              onBlur={handleBlur}
              placeholder="Please describe your issue in detail. The more information you provide, the better we can help you."
              rows={4}
              className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-[#2a2a2e] border-2 rounded-xl text-white placeholder-gray-400 text-sm sm:text-base transition-all duration-200 resize-none ${
                errors.message 
                  ? 'border-red-500 focus:border-red-400' 
                  : focusedField === 'message' 
                    ? 'border-orange-500 focus:border-orange-400 ring-2 ring-orange-500/20' 
                    : 'border-gray-600 focus:border-gray-500'
              }`}
              style={{ minHeight: '120px' }}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {formData.message.length}/500
            </div>
          </div>
          {errors.message && (
            <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || progress < 100}
          className={`w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 transform ${
            isSubmitting || progress < 100
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Submitting Request...</span>
            </div>
          ) : progress < 100 ? (
            `Complete form to submit (${Math.round(progress)}%)`
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Submit Support Request</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          )}
        </button>

        {errors.submit && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 sm:p-4">
            <p className="text-red-400 text-xs sm:text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.submit}
            </p>
          </div>
        )}
      </form>

      {/* Help Section */}
      <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-700">
        <div className="text-center">
          <p className="text-gray-400 text-xs sm:text-sm mb-3">
            Need immediate assistance?
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <a 
              href="mailto:support@rockmyauction.com" 
              className="flex items-center justify-center gap-2 text-orange-400 hover:text-orange-300 text-xs sm:text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@rockmyauction.com
            </a>
            <a 
              href="tel:+1234567890" 
              className="flex items-center justify-center gap-2 text-orange-400 hover:text-orange-300 text-xs sm:text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +1 (234) 567-890
            </a>
          </div>
        </div>
      </div>

      {/* Custom CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
