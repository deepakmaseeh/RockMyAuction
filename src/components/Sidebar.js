import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#18181B] p-6 flex flex-col gap-3">
      <div className="font-bold text-2xl text-orange-500 mb-8">
        Rock the Auction
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="py-2 px-4 rounded hover:bg-[#232326] text-white">
          Home
        </Link>
        <Link href="/seller/new-auction" className="bg-orange-500 hover:bg-orange-600 rounded py-2 px-4 text-white font-semibold transition">
          + Add New Item
        </Link>
        <Link href="/wallet" className="py-2 px-4 rounded hover:bg-[#232326] text-white">
          Wallet
        </Link>
        <Link href="/kyc" className="py-2 px-4 rounded hover:bg-[#232326] text-white">
          KYC Check
        </Link>
        <Link href="/settings" className="py-2 px-4 rounded hover:bg-[#232326] text-white">
          Settings
        </Link>
      </nav>
    </aside>
  )
}
