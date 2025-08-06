import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import AddNewAuctionForm from '../../../components/AddNewAuctionForm'

export default function AddNewAuctionPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
      <Navbar />
      
      {/* Mobile-responsive main content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 lg:mb-16">
        {/* Container for centering and max-width */}
        <div className="max-w-4xl mx-auto">
          {/* Responsive heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mt-6 sm:mt-8 lg:mt-10 mb-4 sm:mb-6 lg:mb-8">
            Add New Auction
          </h1>
          
          {/* Optional subtitle for better UX */}
          <p className="text-gray-400 text-sm sm:text-base text-center mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto">
            Create a new auction listing and reach thousands of potential bidders
          </p>
          
          {/* Form container with responsive padding */}
          <div className="bg-[#18181B] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#232326] shadow-lg">
            <AddNewAuctionForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
