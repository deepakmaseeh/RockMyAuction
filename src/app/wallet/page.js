'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Wallet from '@/components/Wallet'

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Wallet</h1>
        <Wallet />
      </main>
      <Footer />
    </div>
  )
}
