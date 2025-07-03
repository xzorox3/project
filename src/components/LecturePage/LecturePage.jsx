import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Upload,
  Download,
  Edit3,
  Trash2,
  Plus,
  FileText,
  X,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaFilePdf,
  FaVideo,
  FaBook,
} from "react-icons/fa";

function LecturePage() {
  const { deptName, courseName } = useParams();
  const navigate = useNavigate();

  // State management
  const [lectures, setLectures] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [userRole, setUserRole] = useState("student"); // "student", "doctor", "admin"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [previewModal, setPreviewModal] = useState({ isOpen: false, lecture: null });

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

  // Sample lecture data
  useEffect(() => {
    const sampleLectures = [
      {
        id: 1,
        title: "Introduction to Programming - Week 1",
        fileType: "PDF",
        size: "2.4 MB",
        uploadDate: "2025-01-15",
        downloadCount: 234,
        description: "Basic concepts and setup",
      },
      {
        id: 2,
        title: "Variables and Data Types",
        fileType: "Video",
        size: "45.2 MB",
        uploadDate: "2025-01-12",
        downloadCount: 187,
        description: "Understanding different data types",
      },
      {
        id: 3,
        title: "Programming Fundamentals Book",
        fileType: "Book",
        size: "15.8 MB",
        uploadDate: "2025-01-10",
        downloadCount: 156,
        description: "Complete reference guide",
      },
      {
        id: 4,
        title: "Control Structures Presentation",
        fileType: "PDF",
        size: "3.1 MB",
        uploadDate: "2025-01-08",
        downloadCount: 203,
        description: "If statements, loops, and conditions",
      },
      {
        id: 5,
        title: "Functions and Methods Video",
        fileType: "Video",
        size: "67.3 MB",
        uploadDate: "2025-01-05",
        downloadCount: 178,
        description: "Creating reusable code blocks",
      },
    ];
    setLectures(sampleLectures);
  }, []);

  // Helper functions
  const selectAll = () => {
    if (selectedIds.length === filteredLectures.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLectures.map((lecture) => lecture.id));
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
        `Are you sure you want to delete ${selectedIds.length} lecture(s)?`
      )
    ) {
      setLectures((prev) =>
        prev.filter((lecture) => !selectedIds.includes(lecture.id))
      );
      setSelectedIds([]);
    }
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newLectures = files.map((file, index) => ({
      id: Date.now() + index,
      title: file.name,
      fileType: getFileType(file.name),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      downloadCount: 0,
      description: "Recently uploaded",
      file,
    }));
    setLectures((prev) => [...prev, ...newLectures]);
  };

  const getFileType = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return "PDF";
    if (["mp4", "avi", "mov", "wmv"].includes(ext)) return "Video";
    if (["doc", "docx", "epub", "txt"].includes(ext)) return "Book";
    return "PDF";
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "PDF":
        return <FaFilePdf className="text-red-500" />;
      case "Video":
        return <FaVideo className="text-blue-500" />;
      case "Book":
        return <FaBook className="text-green-500" />;
      default:
        return <FileText className="text-gray-500" />;
    }
  };

  const getFileTypeColor = (fileType) => {
    switch (fileType) {
      case "PDF":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Video":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Book":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Download handler
  const handleDownload = (lecture) => {
    try {
      // If it's an uploaded file with actual File object
      if (lecture.file && lecture.file instanceof File) {
        const url = URL.createObjectURL(lecture.file);
        const link = document.createElement("a");
        link.href = url;
        link.download = lecture.file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Update download count
        setLectures(prev => 
          prev.map(l => 
            l.id === lecture.id 
              ? { ...l, downloadCount: l.downloadCount + 1 }
              : l
          )
        );
      } else {
        // Demo download for sample data
        alert(`Demo: Would download "${lecture.title}"`);
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  // Preview handler
  const handlePreview = (lecture) => {
    setPreviewModal({ isOpen: true, lecture });
  };

  // Close preview modal
  const closePreviewModal = () => {
    setPreviewModal({ isOpen: false, lecture: null });
  };

  // Filter lectures
  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFileType =
      selectedFileType === "all" || lecture.fileType === selectedFileType;
    return matchesSearch && matchesFileType;
  });

  const decodedDeptName = decodeURIComponent(deptName);
  const decodedCourseName = courseName
    ? decodeURIComponent(courseName).replace(/-/g, " ")
    : "";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
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
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
                  <FaChalkboardTeacher className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Lecture Materials
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

              {/* Add Material Button */}
              {hasAdminAccess && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => uploadInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Material</span>
                </motion.button>
              )}

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lectures.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Materials
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search lecture materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              {/* File Type Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={selectedFileType}
                  onChange={(e) => setSelectedFileType(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="PDF">PDFs</option>
                  <option value="Video">Videos</option>
                  <option value="Book">Books</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {filteredLectures.length} of {lectures.length} materials
            </span>
            {searchTerm && <span>Search results for "{searchTerm}"</span>}
          </div>
        </motion.div>

        {/* Selection Controls */}
        {hasAdminAccess && filteredLectures.length > 0 && (
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
                  {selectedIds.length === filteredLectures.length
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

        {/* Materials Grid/List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredLectures.map((lecture) => (
            <motion.div
              key={lecture.id}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 group relative ${
                viewMode === "list" ? "flex items-center p-4" : "p-6"
              }`}
            >
              {/* Selection Checkbox */}
              {hasAdminAccess && (
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    checked={selectedIds.includes(lecture.id)}
                    onChange={() => toggleSelect(lecture.id)}
                  />
                </div>
              )}

              {viewMode === "grid" ? (
                // Grid View
                <>
                  <div className="flex items-center justify-center h-20 mb-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                    <div className="text-4xl">
                      {getFileIcon(lecture.fileType)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${getFileTypeColor(
                        lecture.fileType
                      )}`}
                    >
                      {lecture.fileType}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {lecture.size}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {lecture.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {lecture.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{lecture.uploadDate}</span>
                    <span>{lecture.downloadCount} downloads</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePreview(lecture)}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownload(lecture)}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </motion.button>
                  </div>
                </>
              ) : (
                // List View
                <div className="flex-1 flex items-center space-x-4">
                  <div className="text-2xl">
                    {getFileIcon(lecture.fileType)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {lecture.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${getFileTypeColor(
                          lecture.fileType
                        )}`}
                      >
                        {lecture.fileType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {lecture.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{lecture.size}</span>
                      <span>{lecture.uploadDate}</span>
                      <span>{lecture.downloadCount} downloads</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePreview(lecture)}
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownload(lecture)}
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredLectures.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaChalkboardTeacher className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {lectures.length === 0
                ? "No Lecture Materials"
                : "No Materials Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {lectures.length === 0
                ? hasAdminAccess
                  ? "Start by uploading your first lecture material."
                  : "Lecture materials will appear here when they become available."
                : "No materials match your current search and filter criteria."}
            </p>
            {hasAdminAccess && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => uploadInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
              >
                {lectures.length === 0
                  ? "Upload First Material"
                  : "Add Material"}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Hidden File Inputs */}
        <input
          type="file"
          multiple
          ref={uploadInputRef}
          accept=".pdf,.mp4,.avi,.mov,.wmv,.doc,.docx,.epub,.txt"
          className="hidden"
          onChange={handleUpload}
        />
        <input
          type="file"
          ref={updateInputRef}
          accept=".pdf,.mp4,.avi,.mov,.wmv,.doc,.docx,.epub,.txt"
          className="hidden"
        />

        {/* Preview Modal */}
        {previewModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getFileIcon(previewModal.lecture?.fileType)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {previewModal.lecture?.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {previewModal.lecture?.fileType} • {previewModal.lecture?.size}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closePreviewModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-auto max-h-[70vh]">
                {previewModal.lecture?.file && previewModal.lecture.file instanceof File ? (
                  // Real file preview
                  <div className="text-center">
                    {previewModal.lecture.fileType === "PDF" && (
                      <iframe
                        src={URL.createObjectURL(previewModal.lecture.file)}
                        className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded-lg"
                        title="PDF Preview"
                      />
                    )}
                    {previewModal.lecture.fileType === "Video" && (
                      <video
                        controls
                        className="w-full max-h-96 rounded-lg"
                        src={URL.createObjectURL(previewModal.lecture.file)}
                      />
                    )}
                    {previewModal.lecture.fileType === "Book" && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Book preview not supported. Click download to view the file.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Demo preview
                  <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-8">
                    <div className="text-4xl mb-4">
                      {getFileIcon(previewModal.lecture?.fileType)}
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Demo Preview
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {previewModal.lecture?.description}
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-left">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <strong>File Type:</strong> {previewModal.lecture?.fileType}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Size:</strong> {previewModal.lecture?.size}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <strong>Upload Date:</strong> {previewModal.lecture?.uploadDate}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Downloads:</strong> {previewModal.lecture?.downloadCount}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closePreviewModal}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(previewModal.lecture)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LecturePage;
