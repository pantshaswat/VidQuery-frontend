import {useVideos} from '../api/api.hooks';
import React, { useState } from 'react';
import { Eye, Mic, Search } from 'lucide-react';


const SearchBar = ({ onSearch, isSearching }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('visual');
    const [selectedVideo, setSelectedVideo] = useState('');
    const { videos } = useVideos();

    const handleSearch = () => {
      if (!searchQuery.trim()) return;
      onSearch(searchQuery, searchType, selectedVideo || null);
    };

    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setSearchType('visual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              searchType === 'visual'
                ? 'bg-cyan-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Eye size={20} />
            Visual Search
          </button>
          <button
            onClick={() => setSearchType('audio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              searchType === 'audio'
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Mic size={20} />
            Audio Search
          </button>
        </div>

        <div className="mb-4">
          <select
            value={selectedVideo}
            onChange={(e) => setSelectedVideo(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="">Search all videos</option>
            {videos.map((video) => ( // Changed 'videoId' to 'video' to represent the full object
              <option key={video.video_id} value={video.video_id} className="bg-gray-800">
                {video.original_name || video.video_id} {/* Display original_name or video_id */}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchType === 'visual' ? "Describe what you're looking for..." : "Describe the audio/speech..."}
            className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Search size={20} />
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    );
  };

export default SearchBar;
