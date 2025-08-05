export default function TestimonialCard({ name, role, text, location }) {
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326] flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-white">{name}</div>
          <div className="text-sm text-gray-400">{role}</div>
        </div>
      </div>
      <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-1">
        {text}
      </p>
      <div className="text-xs text-orange-400 font-medium mt-auto">
        {location}
      </div>
    </div>
  )
}
