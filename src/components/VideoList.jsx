import { useVideos } from "../api/api.hooks";
import React from "react";
import { Video, Play, X } from "lucide-react";

const VideoList = ({ onVideoSelect }) => {
  const { videos, loading, error, deleteVideo } = useVideos();

  if (loading) return <div className="text-white text-center">Loading videos...</div>;
  if (error) return <div className="text-red-400 text-center">Error: {error}</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => ( // Changed 'videoId' to 'video' to represent the full object
        <div key={video.video_id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <Video size={24} className="text-cyan-400" />
            {/* Access video.original_name for display */}
            <h3 className="text-lg font-semibold text-white truncate">{video.original_name || video.video_id}</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onVideoSelect(video.video_id)} // Pass video.video_id to onVideoSelect
              className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
            >
              <Play size={16} />
              Select
            </button>
            <button
              onClick={() => deleteVideo(video.video_id)} // Pass video.video_id to deleteVideo
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
