export default function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories
}) {
  return (
    <div className="bg-[#18181B] rounded-xl p-6 border border-[#232326]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#232326] border border-[#333] rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none appearance-none cursor-pointer"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[#232326] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="ending-soon">Ending Soon</option>
          <option value="highest-bid">Highest Bid</option>
          <option value="most-bids">Most Bids</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Apply Filters Button (Mobile) */}
      <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition md:hidden">
        Apply Filters
      </button>
    </div>
  )
}
