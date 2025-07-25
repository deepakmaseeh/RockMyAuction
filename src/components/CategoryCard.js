export default function CategoryCard({ label, icon }) {
  return (
    <div className="bg-[#232326] px-6 py-4 rounded-xl flex flex-col items-center justify-center">
      {icon ? icon : <span className="text-orange-400 text-2xl">🏷️</span>}
      <span className="mt-2 text-white font-semibold">{label}</span>
    </div>
  );
}
