'use client'
import { useState } from 'react'

export default function FAQAccordion({ items }) {
  const [open, setOpen] = useState(-1)
  return (
    <div className="divide-y divide-[#232326]">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            className="w-full text-left flex justify-between items-center py-3 focus:outline-none"
            onClick={() => setOpen(open === i ? -1 : i)}
          >
            <span className="font-medium text-white">{item.q}</span>
            <span className="text-orange-400">{open === i ? '-' : '+'}</span>
          </button>
          {open === i &&
            <div className="pb-3 text-sm text-gray-400 pl-2">{item.a}</div>
          }
        </div>
      ))}
    </div>
  )
}
