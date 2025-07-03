import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Download,
  Edit3,
  Trash2,
  Plus,
  FileText,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFileAlt } from "react-icons/fa";

const ExamsPage = () => {
  const { deptName, courseName } = useParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
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

  // Sample exam data for demonstration
  useEffect(() => {
    const sampleExams = [
      {
        id: 1,
        title: "Midterm Exam - Programming Fundamentals",
        type: "Midterm",
        duration: "2 hours",
        date: "2025-02-15",
        totalMarks: 100,
        uploadDate: "2025-01-20",
        status: "Upcoming",
      },
      {
        id: 2,
        title: "Quiz 1 - Data Structures",
        type: "Quiz",
        duration: "30 minutes",
        date: "2025-01-25",
        totalMarks: 25,
        uploadDate: "2025-01-15",
        status: "Active",
      },
      {
        id: 3,
        title: "Final Exam - Advanced Programming",
        type: "Final",
        duration: "3 hours",
        date: "2025-03-10",
        totalMarks: 150,
        uploadDate: "2025-01-10",
        status: "Upcoming",
      },
    ];
    setExams(sampleExams);
  }, []);

  const selectAll = () => {
    if (selectedIds.length === exams.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(exams.map((exam) => exam.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} exam(s)?`
      )
    ) {
      setExams((prev) => prev.filter((exam) => !selectedIds.includes(exam.id)));
      setSelectedIds([]);
    }
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newExams = files.map((file, index) => ({
      id: Date.now() + index,
      title: file.name,
      type: "Quiz",
      duration: "1 hour",
      date: new Date().toISOString().split("T")[0],
      totalMarks: 50,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "Draft",
      file,
    }));
    setExams((prev) => [...prev, ...newExams]);
  };

  const handleUpdate = (e) => {
    const file = e.target.files[0];
    if (!file || selectedIds.length === 0) return;
    setExams((prev) =>
      prev.map((exam) =>
        selectedIds.includes(exam.id)
          ? { ...exam, title: file.name, file }
          : exam
      )
    );
    setSelectedIds([]);
  };

  const handleTakeExam = (exam) => {
    console.log("Taking exam:", exam.title);
    // In a real app, this would navigate to the exam interface
  };

  const handlePreview = (exam) => {
    console.log("Previewing exam:", exam.title);
    // In a real app, this would open exam preview
  };

  const handleExport = (exam) => {
    // Create a blob for demo download (in real app, you'd fetch from server)
    const blob = new Blob([`Demo Exam content for: ${exam.title}`], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);

    // Create temporary anchor element and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exam.title}.pdf`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log("Exported:", exam.title);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
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
                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
                  <FaFileAlt className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Exams & Assessments
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

              {/* Add Exam Button (Admin/Doctor only) */}
              {hasAdminAccess && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => uploadInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Exam</span>
                </motion.button>
              )}

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {exams.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Exams
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selection Controls */}
        {hasAdminAccess && exams.length > 0 && (
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
                  {selectedIds.length === exams.length
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

        {/* Exams Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {exams.map((exam) => (
            <motion.div
              key={exam.id}
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
                    checked={selectedIds.includes(exam.id)}
                    onChange={() => toggleSelect(exam.id)}
                  />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    exam.status
                  )}`}
                >
                  {exam.status}
                </span>
              </div>

              {/* Exam Header */}
              <div className="relative h-32 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <FaFileAlt className="w-12 h-12 text-white/80" />
                <div className="absolute bottom-2 left-2 text-white text-xs">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{exam.duration}</span>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-white text-xs font-semibold">
                  {exam.totalMarks} pts
                </div>
              </div>

              <div className="p-4">
                {/* Exam Info */}
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {exam.title}
                  </h3>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    {exam.type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{exam.date}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {userRole === "student" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTakeExam(exam)}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg font-medium transition-all shadow-lg"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Take Exam</span>
                    </motion.button>
                  ) : (
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePreview(exam)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleExport(exam)}
                        className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {exams.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Exams Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hasAdminAccess
                ? "Start by creating your first exam or assessment."
                : "Exams and assessments will appear here when they become available."}
            </p>
            {hasAdminAccess && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => uploadInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
              >
                Create First Exam
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Hidden File Inputs */}
        <input
          type="file"
          multiple
          ref={uploadInputRef}
          accept="application/pdf,image/*,.doc,.docx"
          className="hidden"
          onChange={handleUpload}
        />
        <input
          type="file"
          ref={updateInputRef}
          accept="application/pdf,image/*,.doc,.docx"
          className="hidden"
          onChange={handleUpdate}
        />
      </div>
    </div>
  );
};

export default ExamsPage;
