import React, { useState, useRef, useEffect } from 'react';
import { Search, Upload, Play, Pause, Volume2, VolumeX, Home, Video, Clock, FileText, Eye, Mic, X, Check, AlertCircle } from 'lucide-react';

// API Configuration
export const API_BASE_URL = 'https://16fe-3-81-15-101.ngrok-free.app';

// Custom hooks for API calls
const useUploadVideo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadVideo = async (file) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload-video`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true', // Add this for ngrok
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setUploadProgress(100);
      return result;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadVideo, isUploading, uploadProgress, error };
};

const useSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const searchVideo = async (query, type = 'visual', videoId = null, topK = 5) => {
    setIsSearching(true);
    setError(null);

    try {
      const endpoint = type === 'visual' ? '/search/video' : '/search/audio';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // Add this for ngrok
        },
        body: JSON.stringify({
          query,
          video_id: videoId,
          top_k: topK,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search failed:', errorText);
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Search results:', result);
      return result;
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsSearching(false);
    }
  };

  return { searchVideo, isSearching, error };
};

const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    
    console.log('Fetching videos from:', `${API_BASE_URL}/videos`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/videos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // Add this for ngrok
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch videos failed:', errorText);
        throw new Error(`Failed to fetch videos: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Fetched videos result:', result);
      
      // Handle both possible response formats
      const videoList = result.videos || result || [];
      setVideos(videoList);
    } catch (err) {
      console.error('Fetch videos error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': 'true', // Add this for ngrok
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete failed:', errorText);
        throw new Error(`Failed to delete video: ${response.status} ${response.statusText}`);
      }
      
      await fetchVideos(); // Refresh list after deletion
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return { videos, loading, error, fetchVideos, deleteVideo };
};

export { useUploadVideo, useSearch, useVideos };