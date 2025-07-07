
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { API_BASE_URL } from '../api/api.hooks';



const VideoPlayer = ({ videoId, searchResults, onBack }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    
    const videoRef = useRef(null);
  
    const togglePlayPause = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
  
    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };
  
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
    };
  
    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };
  
    const handleSeek = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    };
  
    const jumpToTime = (timestamp) => {
      if (videoRef.current) {
        const timeInSeconds = typeof timestamp === 'number' ? timestamp : 
          timestamp.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
        videoRef.current.currentTime = timeInSeconds;
        setCurrentTime(timeInSeconds);
      }
    };
  
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
  
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Video: {videoId}</h1>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
            >
              Back to Search
            </button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="relative bg-black rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  src={`${API_BASE_URL}/videos/${videoId}/stream`} // You'll need to add this endpoint
                  className="w-full h-auto max-h-[70vh]"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  controls={false}
                />
                
                {/* Custom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar with Search Result Markers */}
                  <div className="relative w-full h-2 bg-white/20 rounded-full mb-4 cursor-pointer" onClick={handleSeek}>
                    <div 
                      className="h-full bg-cyan-500 rounded-full transition-all"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    {/* Search Result Markers */}
                    {searchResults && searchResults.map((result, index) => {
                      const timestamp = typeof result.timestamp === 'number' ? result.timestamp : 
                        result.timestamp.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
                      const position = (timestamp / duration) * 100;
                      return (
                        <div
                          key={index}
                          className="absolute top-0 w-1 h-full bg-yellow-400 rounded-full cursor-pointer"
                          style={{ left: `${position}%` }}
                          onClick={(e) => {
                            e.stopPropagation();
                            jumpToTime(timestamp);
                          }}
                          title={`Search result at ${formatTime(timestamp)}`}
                        />
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlayPause}
                        className="p-2 text-white hover:text-cyan-400 transition-colors"
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="p-2 text-white hover:text-cyan-400 transition-colors"
                      >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                      </button>
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search Results Panel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Search Results</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {searchResults && searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    onClick={() => jumpToTime(result.timestamp)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-400 font-medium">
                        {typeof result.timestamp === 'number' 
                          ? formatTime(result.timestamp)
                          : result.timestamp}
                      </span>
                      <span className="text-xs text-gray-400">
                        {Math.round(result.score * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {result.caption || result.transcription || 'No description'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default VideoPlayer;