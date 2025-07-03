import { useState } from "react";
import { motion } from "framer-motion";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  ArrowRight,
  User,
  GraduationCap,
} from "lucide-react";
import loginimage from "../../assets/image/loginimage.svg";
import { API_BASE_URL } from "../../lib/config";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "mohd@gmail.com",
      password: "123456",
      role: "Doctor", // default role
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus(null);

        const endpoint = values.role === "Admin"
          ? "/api/auth/login-doctor"
          : "/api/auth/login-admin";

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            role: values.role, // send role
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Login successful:", data);

          // Store token and user data in cookies
          if (data.token) {
            localStorage.setItem("token", data.token);
            // Set token cookie with 7 days expiration and secure options
            Cookies.set("authToken", data.token, {
              expires: 7, // 7 days
              secure: import.meta.env.PROD, // Only use secure in production
              sameSite: "strict", // CSRF protection
              path: "/", // Available throughout the app
            });
          }

          if (data.user) {
            // Store user data in cookie
            Cookies.set("user", JSON.stringify(data.user), {
              expires: 7,
              secure: import.meta.env.PROD,
              sameSite: "strict",
              path: "/",
            });

            // Set user role for admin access
            Cookies.set("userRole", data.user.role, {
              expires: 7,
              secure: import.meta.env.PROD,
              sameSite: "strict",
              path: "/",
            });
          }

          // Show success message briefly before redirect
          setStatus("Login successful! Redirecting...");

          // Redirect to dashboard or home page after a brief delay
          setTimeout(() => {
            // Redirect based on selected role
            if (values.role === "Admin") {
              navigate("/admin");
            } else {
              navigate("/profile");
            }
          }, 1000);
        } else {
          const errorData = await response.json();
          setStatus(
            errorData.message || "Invalid email or password. Please try again."
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        setStatus("Network error. Please check your connection and try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Role options for card selection
  const roleOptions = [
    {
      value: "Doctor",
      label: "Professor",
      description: "Manage lectures, upload materials, monitor and communicate with students.",
      icon: <User className="w-6 h-6" />,
    },
    {
      value: "Admin",
      label: "System Admin",
      description: "System management, user supervision, content and settings review.",
      icon: <Shield className="w-6 h-6" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Side - Login Form */}
            <motion.div
              variants={itemVariants}
              className="p-8 lg:p-16 flex flex-col justify-center"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-center space-x-3 mb-6"
                >
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Welcome Back
                </motion.h1>
                <motion.p
                  variants={itemVariants}
                  className="text-gray-600 dark:text-gray-400"
                >
                  Sign in to access your instructor portal
                </motion.p>
              </div>

              {/* Status Message */}
              {formik.status && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 border rounded-xl ${
                    formik.status.includes("successful")
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        formik.status.includes("successful")
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${
                        formik.status.includes("successful")
                          ? "text-green-700 dark:text-green-400"
                          : "text-red-700 dark:text-red-400"
                      }`}
                    >
                      {formik.status}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Login Form */}
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Email Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      {...formik.getFieldProps("email")}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 dark:text-red-400"
                    >
                      {formik.errors.email}
                    </motion.div>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      {...formik.getFieldProps("password")}
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                        formik.touched.password && formik.errors.password
                          ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                      } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 dark:text-red-400"
                    >
                      {formik.errors.password}
                    </motion.div>
                  )}
                </motion.div>

                {/* Role Selection Cards */}
                <motion.div variants={itemVariants} className="mb-6">
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">
                    Select Login
                  </label>
                  <div className="flex flex-col gap-4">
                    {roleOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => formik.setFieldValue("role", option.value)}
                        className={`
                          flex items-center p-4 rounded-xl border transition w-full
                          ${formik.values.role === option.value
                            ? "bg-teal-100 border-teal-500 ring-2 ring-teal-400"
                            : "bg-gray-50 border-gray-300 hover:border-teal-400"}
                        `}
                      >
                        <span className="mr-4">{option.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-gray-800 dark:text-gray-100">{option.label}</div>
                          <div className="text-gray-500 dark:text-gray-300 text-sm">{option.description}</div>
                        </div>
                        <span className="ml-4">
                          <input
                            type="radio"
                            name="role"
                            value={option.value}
                            checked={formik.values.role === option.value}
                            readOnly
                            className="form-radio text-teal-600"
                          />
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-4">
                  <motion.button
                    type="submit"
                    disabled={formik.isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {formik.isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        <span>Sign In</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Additional Info */}
                <motion.div variants={itemVariants} className="pt-6">
                  <div className="flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span>Instructor Access</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <GraduationCap className="h-4 w-4" />
                      <span>Faculty Portal</span>
                    </div>
                  </div>
                </motion.div>
              </form>
            </motion.div>

            {/* Right Side - Illustration */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 lg:p-16 flex items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-3xl opacity-20"></div>
                <img
                  src={loginimage}
                  alt="Login Illustration"
                  className="relative w-full max-w-md h-auto drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-8 text-gray-600 dark:text-gray-400"
        >
          <p className="text-sm">
            © 2025 Faculty of Computers and Information. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
