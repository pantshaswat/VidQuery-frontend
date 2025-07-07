
import React, { useState } from 'react';
import { Home, Video, Check, AlertCircle } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import VideoUploader from '../components/VideoUploader';
import VideoList from '../components/VideoList';
import VideoPlayer from '../components/VideoPlayer';
import { useSearch } from '../api/api.hooks';
import { API_BASE_URL } from '../api/api.hooks';


const VideoSearchApp = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
  
    const { searchVideo, isSearching, error: searchError } = useSearch();
  
    const handleSearch = async (query, type, videoId) => {
      try {
        const results = await searchVideo(query, type, videoId);
        setSearchResults(results.results || []);
        if (results.results && results.results.length > 0) {
          // If we have results and a specific video, go to player
          if (videoId) {
            setSelectedVideo(videoId);
            setCurrentPage('player');
          }
        }
      } catch (err) {
        console.error('Search failed:', err);
      }
    };
  
    const handleTimestampClick = (timestamp, videoId) => {
      setSelectedVideo(videoId);
      setCurrentPage('player');
      // The VideoPlayer component will handle jumping to the timestamp
    };
  
    const handleUploadSuccess = (result) => {
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    };
  
    const handleVideoSelect = (videoId) => {
      setSelectedVideo(videoId);
      setCurrentPage('player');
    };
  
    const renderHome = () => (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              VidQuery AI
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover video content through intelligent visual and audio search
            </p>
            
            {uploadSuccess && (
              <div className="max-w-2xl mx-auto mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
                <Check size={20} className="text-green-400" />
                <span className="text-green-300">Video uploaded and processed successfully!</span>
              </div>
            )}
            
            <div className="max-w-4xl mx-auto mb-12">
              <SearchBar onSearch={handleSearch} isSearching={isSearching} />
            </div>
  
            {searchError && (
              <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} className="text-red-400" />
                <span className="text-red-300">Search failed: {searchError}</span>
              </div>
            )}
  
            <SearchResults 
              results={searchResults} 
              onTimestampClick={handleTimestampClick}
            />
  
            <VideoUploader onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      </div>
    );
  
    const renderVideos = () => (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">My Videos</h1>
            <button
              onClick={() => setCurrentPage('home')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center gap-2"
            >
              <Home size={20} />
              Back to Search
            </button>
          </div>
          
          <VideoList onVideoSelect={handleVideoSelect} />
        </div>
      </div>
    );
  
    const renderPlayer = () => (
      <VideoPlayer 
        videoId={selectedVideo}
        searchResults={searchResults}
        onBack={() => setCurrentPage('home')}
      />
    );
  
    const renderNavigation = () => (
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full p-2 border border-white/20">
          <button
            onClick={() => setCurrentPage('home')}
            className={`p-3 rounded-full transition-all ${
              currentPage === 'home' 
                ? 'bg-cyan-500 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/20'
            }`}
          >
            <Home size={20} />
          </button>
          <button
            onClick={() => setCurrentPage('videos')}
            className={`p-3 rounded-full transition-all ${
              currentPage === 'videos' 
                ? 'bg-cyan-500 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/20'
            }`}
          >
            <Video size={20} />
          </button>
        </div>
      </nav>
    );
  
    return (
      <div className="relative">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'videos' && renderVideos()}
        {currentPage === 'player' && renderPlayer()}
        {currentPage !== 'player' && renderNavigation()}
      </div>
    );
  };
  
  export default VideoSearchApp;