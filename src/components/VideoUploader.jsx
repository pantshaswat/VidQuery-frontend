import { useUploadVideo } from "../api/api.hooks";
import React, { useRef } from "react";
import { Upload, AlertCircle } from "lucide-react";


const VideoUploader = ({ onUploadSuccess }) => {
    const { uploadVideo, isUploading, uploadProgress, error } = useUploadVideo();
    const fileInputRef = useRef(null);
  
    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('video/')) {
        try {
          const result = await uploadVideo(file);
          onUploadSuccess(result);
        } catch (err) {
          console.error('Upload failed:', err);
        }
      }
    };
  
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Upload Your Videos</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} className="text-red-400" />
              <span className="text-red-300">{error}</span>
            </div>
          )}
          
          <div 
            className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-cyan-400 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-400">MP4, MOV, AVI files supported</p>
          </div>
          
          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white">Uploading and processing...</span>
                <span className="text-cyan-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </div>
    );
  };
  

export default VideoUploader;