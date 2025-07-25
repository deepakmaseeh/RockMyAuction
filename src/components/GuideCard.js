export default function GuideCard({ title, description, image }) {
  return (
    <div className="bg-[#232326] rounded-lg p-4 flex flex-col items-start min-h-[220px]">
      <img src={image} alt={title} className="rounded mb-3 h-24 w-full object-cover" />
      <div className="font-bold text-white mb-1">{title}</div>
      <div className="text-gray-400 text-sm">{description}</div>
    </div>
  )
}
