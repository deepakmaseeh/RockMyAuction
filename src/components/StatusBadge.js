export default function StatusBadge({ status }) {
  const colors = {
    Approved: "bg-green-600",
    Pending: "bg-yellow-600",
    Rejected: "bg-red-600"
  }
  return (
    <span className={`px-2 py-1 text-xs rounded ${colors[status] || "bg-gray-600"} text-white`}>
      {status}
    </span>
  )
}
