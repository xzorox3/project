// src/components/CoursesPage/CoursesPage.jsx
import React, { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  User,
  Clock,
  Award,
  Plus,
  Trash2,
  Edit3,
  Settings,
  Search,
  Filter,
  Grid3X3,
  List,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFilePdf,
  FaVideo,
  FaFileAlt,
  FaBook,
  FaCode,
  FaBrain,
  FaDatabase,
  FaCogs,
  FaDna,
  FaGraduationCap,
  FaUsers,
  FaStar,
  FaFlask,
  FaChalkboardTeacher,
} from "react-icons/fa";

function CoursesPage() {
  const { deptName } = useParams();
  const navigate = useNavigate();

  // State management
  const [userRole, setUserRole] = useState("student"); // "student", "doctor", "admin"
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortBy, setSortBy] = useState("title"); // "title", "rating", "enrolled"

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

  // Department icon mapping
  const departmentIcons = {
    General: <FaGraduationCap className="w-8 h-8" />,
    "Information Systems": <FaDatabase className="w-8 h-8" />,
    "Computer Science": <FaCode className="w-8 h-8" />,
    "Artificial Intelligence": <FaBrain className="w-8 h-8" />,
    "Software Engineering": <FaCogs className="w-8 h-8" />,
    Bioinformatics: <FaDna className="w-8 h-8" />,
  };

  // Department colors
  const departmentColors = {
    General: "from-yellow-500 to-amber-600",
    "Information Systems": "from-teal-500 to-cyan-600",
    "Computer Science": "from-blue-500 to-indigo-600",
    "Artificial Intelligence": "from-blue-500 to-blue-700",
    "Software Engineering": "from-emerald-500 to-teal-600",
    Bioinformatics: "from-green-500 to-emerald-600",
  };

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Introduction to Programming",
      instructor: "Dr. Ahmed Mohamed",
      description: "Learn the fundamentals of programming with Python",
      duration: "16 weeks",
      level: "Beginner",
      enrolled: 120,
      rating: 4.8,
      resources: [
        { type: "Exams", count: 5, icon: <FaFileAlt /> },
        { type: "Lectures", count: 24, icon: <FaChalkboardTeacher /> },
        { type: "Labs", count: 12, icon: <FaFlask /> },
      ],
    },
    {
      id: 2,
      title: "Data Structures & Algorithms",
      instructor: "Dr. Sarah Ahmed",
      description: "Master essential data structures and algorithmic thinking",
      duration: "14 weeks",
      level: "Intermediate",
      enrolled: 95,
      rating: 4.9,
      resources: [
        { type: "Exams", count: 7, icon: <FaFileAlt /> },
        { type: "Lectures", count: 18, icon: <FaChalkboardTeacher /> },
        { type: "Labs", count: 10, icon: <FaFlask /> },
      ],
    },
    {
      id: 3,
      title: "Database Management Systems",
      instructor: "Dr. Mohamed Ali",
      description: "Comprehensive guide to relational and NoSQL databases",
      duration: "12 weeks",
      level: "Intermediate",
      enrolled: 88,
      rating: 4.7,
      resources: [
        { type: "Exams", count: 4, icon: <FaFileAlt /> },
        { type: "Lectures", count: 16, icon: <FaChalkboardTeacher /> },
        { type: "Labs", count: 8, icon: <FaFlask /> },
      ],
    },
    {
      id: 4,
      title: "Web Development Fundamentals",
      instructor: "Dr. Fatma Hassan",
      description:
        "Build modern web applications with HTML, CSS, and JavaScript",
      duration: "18 weeks",
      level: "Beginner",
      enrolled: 156,
      rating: 4.6,
      resources: [
        { type: "Exams", count: 6, icon: <FaFileAlt /> },
        { type: "Lectures", count: 30, icon: <FaChalkboardTeacher /> },
        { type: "Labs", count: 15, icon: <FaFlask /> },
      ],
    },
    {
      id: 5,
      title: "Mobile App Development",
      instructor: "Dr. Omar Hassan",
      description:
        "Create native mobile applications for iOS and Android platforms",
      duration: "20 weeks",
      level: "Advanced",
      enrolled: 75,
      rating: 4.8,
      resources: [
        { type: "Exams", count: 5, icon: <FaFileAlt /> },
        { type: "Lectures", count: 22, icon: <FaChalkboardTeacher /> },
        { type: "Labs", count: 14, icon: <FaFlask /> },
      ],
    },
    {
      id: 6,
      title: "Cybersecurity Fundamentals",
      instructor: "Dr. Amira Nour",
      description: "Learn to protect systems and networks from cyber threats",
      duration: "15 weeks",
      level: "Intermediate",
      enrolled: 110,
      rating: 4.7,
      resources: [
        { type: "Exams", count: 8, icon: <FaFileAlt /> },
        { type: "Lectures", count: 20, icon: <FaChalkboardTeacher /> },
        { type: "Labs", count: 12, icon: <FaFlask /> },
      ],
    },
  ]);

  // Course management functions
  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((course) => course.id !== courseId));
    }
  };

  const handleAddCourse = () => {
    setShowAddCourse(true);
  };

  const getBasePath = (courseTitle, resourceType) => {
    const courseName = courseTitle.toLowerCase().replace(/\s+/g, "-");
    const basePath = `/department/${encodeURIComponent(
      deptName
    )}/course/${courseName}`;

    // Map resource types to their respective pages
    switch (resourceType.toLowerCase()) {
      case "exams":
        return `${basePath}/exams`;
      case "lectures":
        return `${basePath}/lectures`;
      case "labs":
        return `${basePath}/labs`;
      default:
        return `${basePath}/${resourceType.toLowerCase()}`;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Filter and sort courses
  const filteredAndSortedCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel =
        selectedLevel === "all" || course.level === selectedLevel;
      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "enrolled":
          return b.enrolled - a.enrolled;
        case "title":
        default:
          return a.title.localeCompare(b.title);
      }
    });

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

  const decodedDeptName = decodeURIComponent(deptName);

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
                onClick={() => navigate("/department")}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-md"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </motion.button>

              <div className="flex items-center space-x-4">
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-r ${
                    departmentColors[decodedDeptName] ||
                    "from-blue-500 to-indigo-600"
                  } text-white shadow-lg`}
                >
                  {departmentIcons[decodedDeptName] || (
                    <FaGraduationCap className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {decodedDeptName}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Available Courses & Resources
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Role Toggle (Demo) */}
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

              {/* Add Course Button (Admin/Doctor only) */}
              {hasAdminAccess && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddCourse}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Course</span>
                </motion.button>
              )}

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {courses.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Courses
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
                placeholder="Search courses, instructors..."
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

            {/* Filter and Sort Controls */}
            <div className="flex items-center space-x-4">
              {/* Level Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="title">Sort by Title</option>
                <option value="rating">Sort by Rating</option>
                <option value="enrolled">Sort by Students</option>
              </select>

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
              Showing {filteredAndSortedCourses.length} of {courses.length}{" "}
              courses
            </span>
            {searchTerm && <span>Search results for "{searchTerm}"</span>}
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-6"
          }
        >
          {filteredAndSortedCourses.map((course) => (
            <motion.div
              key={course.id}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 group relative ${
                viewMode === "list" ? "flex items-center p-6" : ""
              }`}
            >
              {/* Admin Controls */}
              {hasAdminAccess && (
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

              {/* Course Header */}
              <div
                className={`${
                  viewMode === "list"
                    ? "flex-1 flex items-center space-x-6"
                    : "p-8 flex flex-col h-full"
                }`}
              >
                {viewMode === "list" ? (
                  // List View Layout
                  <>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getLevelColor(
                            course.level
                          )}`}
                        >
                          {course.level}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        {course.description}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{course.instructor}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <FaUsers className="w-3 h-3" />
                        <span>{course.enrolled}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaStar className="w-3 h-3 text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {course.resources.map((resource, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            navigate(getBasePath(course.title, resource.type))
                          }
                          className="px-3 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 rounded-lg text-center transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50"
                        >
                          <div className="text-blue-600 dark:text-blue-400 text-sm">
                            {resource.icon}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                            {resource.count}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  // Grid View Layout (Original)
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                          {course.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getLevelColor(
                          course.level
                        )}`}
                      >
                        {course.level}
                      </span>
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-1">
                          <FaUsers className="w-3 h-3" />
                          <span>{course.enrolled}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaStar className="w-3 h-3 text-yellow-500" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center space-x-2 mb-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl">
                      <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {course.instructor}
                      </span>
                    </div>

                    {/* Resources */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      {course.resources.map((resource, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            navigate(getBasePath(course.title, resource.type))
                          }
                          className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 rounded-xl text-center transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50 shadow-sm hover:shadow-md"
                        >
                          <div className="text-blue-600 dark:text-blue-400 mb-2 flex justify-center text-lg">
                            {resource.icon}
                          </div>
                          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            {resource.type}
                          </div>
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            {resource.count} items
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State for Filtered Results */}
        {filteredAndSortedCourses.length === 0 && courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Courses Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No courses match your current search and filter criteria.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLevel("all");
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
              >
                Clear Filters
              </motion.button>
              {hasAdminAccess && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddCourse(true)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all"
                >
                  Add New Course
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Empty State for No Courses */}
        {courses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Courses Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hasAdminAccess
                ? "Start by adding your first course to this department."
                : "Courses will appear here when they become available."}
            </p>
            {hasAdminAccess && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddCourse(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
              >
                Add First Course
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Add Course Modal */}
        {showAddCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddCourse(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add New Course
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddCourse(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter course title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instructor
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter instructor name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter course description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 16 weeks"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Level
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Students
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowAddCourse(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg"
                  >
                    Create Course
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default CoursesPage;
