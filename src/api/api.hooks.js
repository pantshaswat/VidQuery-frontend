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
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error('Upload failed');

      }

      const result = await response.json();
      setUploadProgress(100);
      return result;
    } catch (err) {
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
        },
        body: JSON.stringify({
          query,
          video_id: videoId,
          top_k: topK,
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const result = await response.json();
      console.log('Search results:', result);
      return result;
    } catch (err) {
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
    try {
      const response = await fetch(`${API_BASE_URL}/videos`);
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const result = await response.json();
      console.log('Fetched videos:', result);
      setVideos(result.videos || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete video');
      }
      await fetchVideos(); // Refresh list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return { videos, loading, error, fetchVideos, deleteVideo };
};

export { useUploadVideo, useSearch, useVideos };