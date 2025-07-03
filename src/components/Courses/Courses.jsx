import React, { useEffect, useState } from "react";
import icpc from "../../assets/image/icpcimage.png";
import frontend from "../../assets/image/frontendimage.jpg";
import backend from "../../assets/image/backendimage.jpg";
import flutter from "../../assets/image/flutterimage.jpg";
import ai from "../../assets/image/ai.jpg";
import ml from "../../assets/image/ml.png";
import apiService from "../../lib/api";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Courses.css";

const getColorClasses = (color) => {
  const colors = {
    yellow: "bg-yellow-500 text-yellow-600 border-yellow-200",
    blue: "bg-blue-500 text-blue-600 border-blue-200",
    darkblue: "bg-blue-600 text-blue-700 border-blue-300",
    cyan: "bg-cyan-500 text-cyan-600 border-cyan-200",
    indigo: "bg-indigo-500 text-indigo-600 border-indigo-200",
    green: "bg-green-500 text-green-600 border-green-200",
  };
  return colors[color] || colors.blue;
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await apiService.course.getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Available Courses
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our comprehensive course catalog designed to enhance your
            skills and advance your career
          </p>
        </div>

        {/* Swiper */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".courses-button-next",
              prevEl: ".courses-button-prev",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            loop={true}
            speed={600}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 2.5,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="courses-swiper"
          >
            {courses.map((course) => (
              <SwiperSlide key={course.id}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium text-white rounded-full ${
                          getColorClasses(course.color).split(" ")[0]
                        }`}
                      >
                        {course.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 text-xs font-medium bg-black/50 text-white rounded-full">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {course.description}
                    </p>

                    {/* Action Button */}
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 ${
                        getColorClasses(course.color).split(" ")[2]
                      } ${getColorClasses(course.color).split(" ")[1]} hover:${
                        getColorClasses(course.color).split(" ")[0]
                      } hover:text-white rounded-lg font-medium transition-all duration-300 group`}
                    >
                      <span>Learn More</span>
                      <FaExternalLinkAlt className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="courses-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FaChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          <button className="courses-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FaChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Courses;
