import React from 'react';

export default function SearchResultsCard({ results, sourceAttribution }) {
  if (!results || results.length === 0) return null;
  
  return (
    <div className="mt-3 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
      <div className="flex items-center mb-3 justify-between flex-wrap gap-2">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <h4 className="text-green-300 font-semibold text-sm">Web Search Results</h4>
        </div>
        {sourceAttribution && (
          <span className="text-green-400 text-xs">{sourceAttribution}</span>
        )}
      </div>
      <div className="space-y-3">
        {results.slice(0, 5).map((result, idx) => (
          <a
            key={idx}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-black/20 rounded-lg p-3 hover:bg-green-500/20 transition-colors cursor-pointer"
          >
            <div className="flex gap-3">
              {result.imageUrl && (
                <div className="flex-shrink-0">
                  <img 
                    src={result.imageUrl} 
                    alt={result.title}
                    className="w-16 h-16 object-cover rounded-md border border-green-500/30"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-green-200 font-medium text-sm mb-1 line-clamp-1">
                  [{idx + 1}] {result.title}
                </div>
                {result.snippet && (
                  <div className="text-gray-300 text-xs mb-2 line-clamp-2">
                    {result.snippet}
                  </div>
                )}
                <div className="text-gray-400 text-xs truncate">
                  🔗 {result.url}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}