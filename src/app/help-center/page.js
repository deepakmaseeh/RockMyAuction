import Navbar from '../../components/Navbar'
import HelpCenterContent from '../../components/HelpCenterContent'
import Footer from '../../components/Footer'

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-white">
      <Navbar />
      <main className="flex-1 py-12 px-2 sm:px-6">
        <HelpCenterContent/>
      </main>
      <Footer />
    </div>
  )
}
