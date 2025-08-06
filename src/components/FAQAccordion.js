'use client'
import { useState } from 'react'

// In your FAQAccordion component
export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="divide-y divide-[#232326]">
      {items.map((item, index) => (
        <div key={index}>
          <button
            className="w-full text-left flex justify-between items-center py-3 focus:outline-none hover:text-orange-400 transition"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            suppressHydrationWarning={true} // Add this
          >
            <span className="font-medium">{item.q}</span>
            <span className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          {openIndex === index && (
            <div className="pb-3 text-gray-400">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
