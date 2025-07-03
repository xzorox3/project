import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  BookOpen,
  Upload,
  Download,
  Edit3,
  Trash2,
  Plus,
  FileText,
  X,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa";

const PdfPage = () => {
  const { deptName, courseName } = useParams();
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState([]);
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

  // Sample PDF data for demonstration
  useState(() => {
    const samplePdfs = [
      {
        id: 1,
        title: "Introduction to Programming - Chapter 1.pdf",
        size: "2.5 MB",
        uploadDate: "2025-01-15",
        downloadCount: 45,
      },
      {
        id: 2,
        title: "Python Basics and Syntax.pdf",
        size: "1.8 MB",
        uploadDate: "2025-01-10",
        downloadCount: 32,
      },
      {
        id: 3,
        title: "Data Types and Variables.pdf",
        size: "3.2 MB",
        uploadDate: "2025-01-05",
        downloadCount: 28,
      },
    ];
    setPdfs(samplePdfs);
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === pdfs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pdfs.map((pdf) => pdf.id));
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} PDF(s)?`
      )
    ) {
      setPdfs((prev) => prev.filter((pdf) => !selectedIds.includes(pdf.id)));
      setSelectedIds([]);
    }
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.map((file, index) => ({
      id: Date.now() + index,
      title: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      downloadCount: 0,
      file,
    }));
    setPdfs((prev) => [...prev, ...newPdfs]);
  };

  const handleDownload = (pdf) => {
    // Check if we have the actual uploaded file
    if (pdf.file && pdf.file instanceof File) {
      // Use the actual uploaded file
      const url = URL.createObjectURL(pdf.file);
      
      // Create temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = pdf.title;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Fallback for demo files without actual file content
      const blob = new Blob([`Demo PDF content for: ${pdf.title}`], { 
        type: 'application/pdf' 
      });
      const url = URL.createObjectURL(blob);
      
      // Create temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = pdf.title;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    // Update download count
    setPdfs(prev => 
      prev.map(p => 
        p.id === pdf.id 
          ? { ...p, downloadCount: p.downloadCount + 1 }
          : p
      )
    );
    
    console.log("Downloaded:", pdf.title);
  };

  const handleUpdate = (e) => {
    const file = e.target.files[0];
    if (!file || selectedIds.length === 0) return;
    setPdfs((prev) =>
      prev.map((pdf) =>
        selectedIds.includes(pdf.id)
          ? {
              ...pdf,
              title: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              file,
            }
          : pdf
      )
    );
    setSelectedIds([]);
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
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg">
                  <FaFilePdf className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    PDF Resources
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

              {/* Add PDF Button (Admin/Doctor only) */}
              {hasAdminAccess && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => uploadInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add PDF</span>
                </motion.button>
              )}

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pdfs.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total PDFs
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selection Controls */}
        {hasAdminAccess && pdfs.length > 0 && (
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
                  {selectedIds.length === pdfs.length
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

        {/* PDFs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {pdfs.map((pdf) => (
            <motion.div
              key={pdf.id}
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
                    checked={selectedIds.includes(pdf.id)}
                    onChange={() => toggleSelect(pdf.id)}
                  />
                </div>
              )}

              <div className="p-6">
                {/* PDF Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl mb-4 mx-auto shadow-lg">
                  <FaFilePdf className="w-8 h-8 text-white" />
                </div>

                {/* PDF Info */}
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {pdf.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{pdf.size}</span>
                    <span>{pdf.downloadCount} downloads</span>
                  </div>

                  <div className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                    {pdf.uploadDate}
                  </div>

                  {/* Download Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(pdf)}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {pdfs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No PDFs Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hasAdminAccess
                ? "Start by uploading your first PDF resource."
                : "PDF resources will appear here when they become available."}
            </p>
            {hasAdminAccess && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => uploadInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
              >
                Upload First PDF
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Hidden File Inputs */}
        <input
          type="file"
          multiple
          ref={uploadInputRef}
          accept="application/pdf"
          className="hidden"
          onChange={handleUpload}
        />
        <input
          type="file"
          ref={updateInputRef}
          accept="application/pdf"
          className="hidden"
          onChange={handleUpdate}
        />
      </div>
    </div>
  );
};

export default PdfPage;
