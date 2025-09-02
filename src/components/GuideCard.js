'use client'
import { useState } from 'react'

export default function GuideCard({ title, description, image, onClick, category, readTime, featured = false }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={`group relative bg-gradient-to-br from-[#18181B] to-[#232326] rounded-xl border border-[#333] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${
        featured ? 'ring-2 ring-orange-500/30 hover:ring-orange-500/50' : ''
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg transform rotate-12">
            ✨
          </div>
        </div>
      )}

      {/* Compact Image Container */}
      <div className="relative overflow-hidden rounded-t-xl">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="w-full h-32 sm:h-36 bg-gray-700 animate-pulse rounded-t-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Actual Image - Reduced Height */}
        {/* <img 
          src={image} 
          alt={title} 
          className={`w-full h-32 sm:h-36 object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        /> */}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Compact Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {/* Category Badge */}
          {category && (
            <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {category}
            </span>
          )}

          {/* Read Time Badge */}
          {readTime && (
            <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readTime}
            </span>
          )}
        </div>

        {/* Hover Play Icon - Smaller */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7V5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Compact Content Container */}
      <div className="p-3 sm:p-4 flex flex-col">
        {/* Title - Reduced Size */}
        <h3 className="font-bold text-white text-sm sm:text-base mb-2 leading-tight group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Description - Reduced Size and Lines */}
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>

        {/* Compact Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700/30">
          {/* Read More Link - Smaller */}
          <div className="flex items-center gap-1 text-orange-400 hover:text-orange-300 font-medium text-xs group-hover:gap-2 transition-all duration-300">
            <span>Learn More</span>
            <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Compact Difficulty Indicator */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Interactive Ripple Effect - Subtle */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-orange-500/3 transform scale-0 group-hover:scale-100 transition-transform duration-300" />
      </div>
    </div>
  )
}
