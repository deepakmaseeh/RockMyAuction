import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import AddNewAuctionForm from '../../../components/AddNewAuctionForm'

export default function AddNewAuctionPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 mb-16">  {/* mb-16 adds space before footer */}
        <h1 className="text-3xl font-bold text-center mt-10 mb-2">Add New Auction</h1>
        <AddNewAuctionForm />
      </main>
      <Footer />
    </div>
  )
}
