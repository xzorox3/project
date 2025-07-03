import React, { useState, useMemo, useEffect } from "react";
import Cookies from "js-cookie";
import {
  User,
  Mail,
  Upload,
  FileText,
  Video,
  BookOpen,
  FileCheck,
  Plus,
  Edit3,
  Trash2,
  Download,
  Eye,
  Calendar,
  GraduationCap,
  Award,
  Settings,
  Search,
  Filter,
  X,
  BarChart3,
} from "lucide-react";
import apiService from "../../lib/api";

const ProfileCard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userRole, setUserRole] = useState("doctor"); // 'student' or 'doctor'
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [uploadType, setUploadType] = useState("");
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    gender: "",
    email: "",
    faculty: "Factly of Compyter and Information Sciences",
    department: "department",
    position: "position",
    joinDate: "joinDate",
    courses: [],
  });

  // Load user data from backend on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.user.getAdminProfile();
        // The backend returns { message, userData }, so extract userData
        setUserData((prev) => ({
          ...prev,
          ...data.userData,
        }));
        // If user files are returned from backend, set them here
        // setUserFiles(data.files || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchProfile();
  }, []);

  // Filter states
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Enhanced sample files data
  const [userFiles, setUserFiles] = useState([
    {
      id: 1,
      name: "محاضرة 1 - مقدمة في البرمجة.pdf",
      type: "PDF",
      course: "برمجة 1",
      uploadDate: "2024-01-15",
      size: "2.5 MB",
      downloads: 45,
    },
    {
      id: 2,
      name: "شرح خوارزميات الترتيب.mp4",
      type: "Video",
      course: "خوارزميات",
      uploadDate: "2024-01-20",
      size: "45 MB",
      downloads: 32,
    },
    {
      id: 3,
      name: "كتاب هياكل البيانات.pdf",
      type: "Book",
      course: "هياكل البيانات",
      uploadDate: "2024-01-25",
      size: "8.2 MB",
      downloads: 78,
    },
    {
      id: 4,
      name: "امتحان منتصف الفصل.pdf",
      type: "Exam",
      course: "برمجة 1",
      uploadDate: "2024-02-01",
      size: "1.8 MB",
      downloads: 23,
    },
    {
      id: 5,
      name: "محاضرة 3 - المؤشرات والمصفوفات.pdf",
      type: "PDF",
      course: "برمجة 1",
      uploadDate: "2024-02-10",
      size: "3.1 MB",
      downloads: 41,
    },
    {
      id: 6,
      name: "شرح الـ Binary Search Trees.mp4",
      type: "Video",
      course: "هياكل البيانات",
      uploadDate: "2024-02-15",
      size: "52 MB",
      downloads: 36,
    },
    {
      id: 7,
      name: "امتحان نهاية الفصل - خوارزميات.pdf",
      type: "Exam",
      course: "خوارزميات",
      uploadDate: "2024-02-20",
      size: "2.2 MB",
      downloads: 19,
    },
    {
      id: 8,
      name: "كتاب مقدمة في قواعد البيانات.pdf",
      type: "Book",
      course: "قواعد البيانات",
      uploadDate: "2024-02-25",
      size: "12.5 MB",
      downloads: 67,
    },
  ]);

  // Get unique courses and file types from the actual data
  const availableCourses = useMemo(() => {
    return [...new Set(userFiles.map((file) => file.course))].sort();
  }, [userFiles]);

  const availableFileTypes = useMemo(() => {
    return [...new Set(userFiles.map((file) => file.type))].sort();
  }, [userFiles]);

  // Filtered files based on search and filters
  const filteredFiles = useMemo(() => {
    return userFiles.filter((file) => {
      const matchesSearch =
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = !selectedCourse || file.course === selectedCourse;
      const matchesType = !selectedFileType || file.type === selectedFileType;

      return matchesSearch && matchesCourse && matchesType;
    });
  }, [userFiles, searchQuery, selectedCourse, selectedFileType]);

  // File statistics
  const fileStats = useMemo(() => {
    const stats = {
      total: userFiles.length,
      byType: {},
      byCourse: {},
      totalDownloads: userFiles.reduce((sum, file) => sum + file.downloads, 0),
    };

    userFiles.forEach((file) => {
      stats.byType[file.type] = (stats.byType[file.type] || 0) + 1;
      stats.byCourse[file.course] = (stats.byCourse[file.course] || 0) + 1;
    });

    return stats;
  }, [userFiles]);

  const handleFileUpload = (fileData) => {
    const newFile = {
      id: userFiles.length + 1,
      ...fileData,
      uploadDate: new Date().toISOString().split("T")[0],
      size: "Unknown",
      downloads: 0,
    };
    setUserFiles([...userFiles, newFile]);
    setShowUploadModal(false);
  };

  const handleDeleteFile = (fileId) => {
    setUserFiles(userFiles.filter((file) => file.id !== fileId));
  };

  const handleEditFile = (file) => {
    setEditingFile(file);
    setShowEditModal(true);
  };

  const handleUpdateFile = (updatedFileData) => {
    setUserFiles(
      userFiles.map((file) =>
        file.id === editingFile.id
          ? { ...file, ...updatedFileData, uploadDate: file.uploadDate }
          : file
      )
    );
    setShowEditModal(false);
    setEditingFile(null);
  };

  const handleDownloadFile = (file) => {
    // Create a blob URL for the file (for demo purposes)
    // In a real application, you would fetch the file from your server
    const blob = new Blob([`This is a demo file: ${file.name}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Update download count
    setUserFiles(
      userFiles.map((f) =>
        f.id === file.id ? { ...f, downloads: f.downloads + 1 } : f
      )
    );
  };

  const handleViewFile = (file) => {
    // For demo purposes, show an alert with file info
    // In a real application, you would open the file in a viewer or new tab
    alert(`Viewing file: ${file.name}\nType: ${file.type}\nCourse: ${file.course}\nSize: ${file.size}`);
    
    // You could also open in a new window/tab:
    // window.open(`/api/files/${file.id}/view`, '_blank');
  };

  const clearFilters = () => {
    setSelectedCourse("");
    setSelectedFileType("");
    setSearchQuery("");
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "PDF":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "Video":
        return <Video className="w-5 h-5 text-purple-500" />;
      case "Book":
        return <BookOpen className="w-5 h-5 text-green-500" />;
      case "Exam":
        return <FileCheck className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "PDF":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "Video":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "Book":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Exam":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{userData.name || "اسم غير متوفر"}</h1>
                <p className="text-blue-100">{userData.position || "---"}</p>
                <p className="text-blue-200 text-sm">{userData.department || "---"}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() =>
                    setUserRole(userRole === "doctor" ? "student" : "doctor")
                  }
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Switch to {userRole === "doctor" ? "Student" : "Doctor"} View
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 font-medium ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
            {userRole === "doctor" && (
              <button
                onClick={() => setActiveTab("my-files")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "my-files"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                My Files ({userFiles.length})
              </button>
            )}
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-3 font-medium ${
                activeTab === "settings"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Profile Information
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Email
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userData.email || "---"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="w-5 h-5 text-blue-600 flex items-center">👤</span>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Gender
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userData.gender || "---"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Faculty
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userData.faculty}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Join Date
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {userData.joinDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Statistics */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Teaching Courses
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {userData.courses.map((course, index) => {
                        const courseFileCount = fileStats.byCourse[course] || 0;
                        return (
                          <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                              {course}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {courseFileCount} files
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced My Files Tab (Doctor Only) */}
            {activeTab === "my-files" && userRole === "doctor" && (
              <div className="space-y-6">
                {/* File Statistics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    File Statistics
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">
                        {fileStats.byType.PDF || 0}
                      </p>
                      <p className="text-sm text-blue-600">PDFs</p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                      <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">
                        {fileStats.byType.Video || 0}
                      </p>
                      <p className="text-sm text-purple-600">Videos</p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                      <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">
                        {fileStats.byType.Book || 0}
                      </p>
                      <p className="text-sm text-green-600">Books</p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                      <FileCheck className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-600">
                        {fileStats.byType.Exam || 0}
                      </p>
                      <p className="text-sm text-red-600">Exams</p>
                    </div>
                  </div>
                </div>

                {/* Files Management */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      My Files Management
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {filteredFiles.length} of {fileStats.total} files
                      </span>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Upload New</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Search */}
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search files..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Course Filter */}
                      <div>
                        <select
                          value={selectedCourse}
                          onChange={(e) => setSelectedCourse(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Courses</option>
                          {availableCourses.map((course) => (
                            <option key={course} value={course}>
                              {course}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* File Type Filter */}
                      <div>
                        <select
                          value={selectedFileType}
                          onChange={(e) => setSelectedFileType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Types</option>
                          {availableFileTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Clear Filters */}
                      <div>
                        <button
                          onClick={clearFilters}
                          className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Clear</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Files Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1">
                            {getFileIcon(file.type)}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                                {file.name}
                              </h3>
                              <span
                                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                                  file.type
                                )}`}
                              >
                                {file.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center justify-between">
                            <span>Course:</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {file.course}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Size:</span>
                            <span>{file.size}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Uploaded:</span>
                            <span>{file.uploadDate}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Downloads:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {file.downloads}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="View"
                              onClick={() => handleViewFile(file)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadFile(file)}
                              className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditFile(file)}
                              className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredFiles.length === 0 && (
                    <div className="text-center py-12">
                      <Upload className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {userFiles.length === 0
                          ? "No files uploaded yet"
                          : "No files match your filters"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {userFiles.length === 0
                          ? "Start by uploading your first course materials"
                          : "Try adjusting your search or filter criteria"}
                      </p>
                      {userFiles.length === 0 && (
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Upload First File
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Settings
                </h2>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Account Settings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Manage your account preferences and security settings.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Change Password
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Notification Preferences
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Choose how you want to receive notifications.
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          defaultChecked
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          Email notifications
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">
                          SMS notifications
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>

              <div className="space-y-4">
                {userRole === "doctor" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Uploaded Files
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {fileStats.total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Teaching Courses
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {userData.courses.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Downloads
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {fileStats.totalDownloads}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Enrolled Courses
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        5
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Completed
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        3
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Available Files
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        24
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            {userRole === "doctor" && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setUploadType("PDF");
                      setShowUploadModal(true);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Upload PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      setUploadType("Video");
                      setShowUploadModal(true);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    <span>Upload Video</span>
                  </button>

                  <button
                    onClick={() => {
                      setUploadType("Book");
                      setShowUploadModal(true);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg transition-colors"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Upload Book</span>
                  </button>

                  <button
                    onClick={() => {
                      setUploadType("Exam");
                      setShowUploadModal(true);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
                  >
                    <FileCheck className="w-5 h-5" />
                    <span>Upload Exam</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload {uploadType || "File"}
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleFileUpload({
                    name: formData.get("fileName"),
                    type: uploadType || "PDF",
                    course: formData.get("course"),
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    File Name
                  </label>
                  <input
                    type="text"
                    name="fileName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter file name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course
                  </label>
                  <select
                    name="course"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select course...</option>
                    {userData.courses.map((course, index) => (
                      <option key={index} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Drop file here or click to browse
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit File Modal */}
        {showEditModal && editingFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  تعديل الملف
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingFile(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleUpdateFile({
                    name: formData.get("fileName"),
                    course: formData.get("course"),
                    type: formData.get("fileType"),
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    اسم الملف
                  </label>
                  <input
                    type="text"
                    name="fileName"
                    defaultValue={editingFile.name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ادخل اسم الملف..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    المادة
                  </label>
                  <select
                    name="course"
                    defaultValue={editingFile.course}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر المادة...</option>
                    {userData.courses.map((course, index) => (
                      <option key={index} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    نوع الملف
                  </label>
                  <select
                    name="fileType"
                    defaultValue={editingFile.type}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Video">فيديو</option>
                    <option value="Book">كتاب</option>
                    <option value="Exam">امتحان</option>
                  </select>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      تاريخ الرفع:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {editingFile.uploadDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      حجم الملف:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {editingFile.size}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    حفظ التعديلات
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingFile(null);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
