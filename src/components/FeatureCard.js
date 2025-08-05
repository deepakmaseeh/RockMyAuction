export default function FeatureCard({ title, description, stats, Icon }) {
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326] hover:border-orange-500/30 transition">
      <div className="flex items-start gap-4 mb-4">
        <Icon className="h-10 w-10 text-orange-400 flex-shrink-0" />
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
          {stats && <span className="text-xs text-orange-300">{stats}</span>}
        </div>
      </div>
    </div>
  );
}
