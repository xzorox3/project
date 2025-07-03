import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  Upload,
  Download,
  Edit3,
  Trash2,
  Plus,
  Video,
  X,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaVideo } from "react-icons/fa";

function VideosPage() {
  const { deptName, courseName } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // Mock user role - In a real app, this would come from authentication context
  const [userRole, setUserRole] = useState("student"); // "student", "doctor", "admin"

  // Check if user has admin privileges
  const hasAdminAccess = userRole === "doctor" || userRole === "admin";

  // Demo toggle for testing (remove in production)
  const toggleUserRole = () => {
    setUserRole((current) => {
      if (current === "student") return "doctor";
      if (current === "doctor") return "admin";
      return "student";
    });
  };

  const uploadInputRef = useRef(null);
  const updateInputRef = useRef(null);

  // Sample video data for demonstration
  useEffect(() => {
    const sampleVideos = [
      {
        id: 1,
        title: "Introduction to Programming - Lecture 1",
        duration: "45:32",
        size: "125 MB",
        uploadDate: "2025-01-15",
        viewCount: 234,
        thumbnail: null,
      },
      {
        id: 2,
        title: "Python Basics and Syntax",
        duration: "32:18",
        size: "89 MB",
        uploadDate: "2025-01-10",
        viewCount: 187,
        thumbnail: null,
      },
      {
        id: 3,
        title: "Data Types and Variables",
        duration: "28:45",
        size: "76 MB",
        uploadDate: "2025-01-05",
        viewCount: 156,
        thumbnail: null,
      },
    ];
    setVideos(sampleVideos);
  }, []);

  const selectAll = () => {
    if (selectedIds.length === videos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(videos.map((video) => video.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} video(s)?`
      )
    ) {
      setVideos((prev) =>
        prev.filter((video) => !selectedIds.includes(video.id))
      );
      setSelectedIds([]);
    }
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map((file, index) => ({
      id: Date.now() + index,
      title: file.name,
      duration: "00:00",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      viewCount: 0,
      file,
    }));
    setVideos((prev) => [...prev, ...newVideos]);
  };

  const handleUpdate = (e) => {
    const file = e.target.files[0];
    if (!file || selectedIds.length === 0) return;
    setVideos((prev) =>
      prev.map((video) =>
        selectedIds.includes(video.id)
          ? {
              ...video,
              title: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              file,
            }
          : video
      )
    );
    setSelectedIds([]);
  };

  const handlePlay = (video) => {
    console.log("Playing video:", video.title);
    // In a real app, this would open a video player
  };

  const handleDownload = (video) => {
    // Check if we have the actual uploaded file
    if (video.file && video.file instanceof File) {
      // Use the actual uploaded file
      const url = URL.createObjectURL(video.file);

      // Create temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = video.title;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Fallback for demo files without actual file content
      const blob = new Blob([`Demo Video content for: ${video.title}`], {
        type: "video/mp4",
      });
      const url = URL.createObjectURL(blob);

      // Create temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = video.title;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    console.log("Downloaded:", video.title);
  };

  const decodedDeptName = decodeURIComponent(deptName);
  const decodedCourseName = courseName
    ? decodeURIComponent(courseName).replace(/-/g, " ")
    : "";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  navigate(`/department/${encodeURIComponent(deptName)}`)
                }
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </motion.button>

              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
                  <FaVideo className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Video Resources
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {decodedDeptName} • {decodedCourseName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Role Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleUserRole}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  userRole === "student"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    : userRole === "doctor"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                }`}
              >
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </motion.button>

              {/* Add Video Button (Admin/Doctor only) */}
              {hasAdminAccess && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => uploadInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Video</span>
                </motion.button>
              )}

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {videos.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Videos
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selection Controls */}
        {hasAdminAccess && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={selectAll}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  {selectedIds.length === videos.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
                {selectedIds.length > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedIds.length} selected
                  </span>
                )}
              </div>

              {selectedIds.length > 0 && (
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Update</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Videos Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {videos.map((video) => (
            <motion.div
              key={video.id}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 group relative"
            >
              {/* Selection Checkbox */}
              {hasAdminAccess && (
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    checked={selectedIds.includes(video.id)}
                    onChange={() => toggleSelect(video.id)}
                  />
                </div>
              )}

              {/* Video Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <FaVideo className="w-16 h-16 text-white/80" />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>

                {/* Play Button Overlay */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePlay(video)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
                >
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 text-gray-800 ml-1" />
                  </div>
                </motion.button>
              </div>

              <div className="p-4">
                {/* Video Info */}
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>{video.size}</span>
                  <span>{video.viewCount} views</span>
                </div>

                <div className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                  {video.uploadDate}
                </div>

                <div className="flex items-center justify-between">
                  {/* Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePlay(video)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg"
                  >
                    <Play className="w-4 h-4" />
                    <span>Play Video</span>
                  </motion.button>

                  {/* Download Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(video)}
                    className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {videos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Videos Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hasAdminAccess
                ? "Start by uploading your first video resource."
                : "Video resources will appear here when they become available."}
            </p>
            {hasAdminAccess && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => uploadInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
              >
                Upload First Video
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Hidden File Inputs */}
        <input
          type="file"
          multiple
          ref={uploadInputRef}
          accept="video/*"
          className="hidden"
          onChange={handleUpload}
        />
        <input
          type="file"
          ref={updateInputRef}
          accept="video/*"
          className="hidden"
          onChange={handleUpdate}
        />
      </div>
    </div>
  );
}

export default VideosPage;
