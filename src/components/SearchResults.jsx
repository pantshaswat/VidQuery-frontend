import React from 'react';
import { Play, Clock } from 'lucide-react';


const SearchResults = ({ results, onTimestampClick }) => {
    if (!results || results.length === 0) return null;
  
    return (
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Search Results</h2>
        <div className="grid gap-4">
          {results.map((result, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{result.video_id}</h3>
                  <p className="text-gray-300 mb-2">
                    {result.caption || result.transcription || 'No description'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {typeof result.timestamp === 'number' 
                        ? `${Math.floor(result.timestamp / 60)}:${Math.floor(result.timestamp % 60).toString().padStart(2, '0')}`
                        : result.timestamp}
                    </span>
                    <span>Score: {Math.round(result.score * 100)}%</span>
                  </div>
                </div>
                <button
                  onClick={() => onTimestampClick(result.timestamp, result.video_id)}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all flex items-center gap-2"
                >
                  <Play size={16} />
                  Jump to Time
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default SearchResults;