export default function StatCard({ label, value, change, color = 'text-white' }) {
  return (
    <div className="bg-[#232326] rounded-xl p-6 flex flex-col items-start">
      <span className="text-lg font-semibold mb-2">{label}</span>
      <span className={`text-2xl font-bold mb-1 ${color}`}>{value}</span>
      {change && (
        <span className="text-xs text-green-400">{change}</span>
      )}
    </div>
  )
}
