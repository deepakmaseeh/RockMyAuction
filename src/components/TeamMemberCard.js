export default function TeamMemberCard({ name, role, img, bio }) {
  return (
    <div className="bg-[#18181B] rounded-xl p-6 flex flex-col h-full">
      <img
        src={img}
        alt={name}
        className="w-20 h-20 rounded-full border-2 border-orange-500 mb-4 object-cover"
      />
      <h3 className="font-semibold text-white">{name}</h3>
      <p className="text-sm text-orange-400 mb-2">{role}</p>
      <p className="text-xs text-gray-400 flex-1">{bio}</p>
    </div>
  );
}
