import FCI from "../../assets/image/fci2.svg";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "./homeswiper.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  FaCalendarAlt,
  FaArrowRight,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function HomeSwiper() {
  const events = [
    {
      id: 1,
      title: "Student & Graduate Conference 2025",
      description:
        "Join us for an exciting conference featuring student research presentations and networking opportunities.",
      image: FCI,
      date: "March 10, 2025",
      time: "09:00 AM",
      location: "Main Auditorium",
      attendees: "500+",
      category: "Conference",
      color: "blue",
    },
    {
      id: 2,
      title: "Digital Library Innovation Event",
      description:
        "Discover the latest research papers and cutting-edge digital resources in our library facility.",
      image: FCI,
      date: "April 2, 2025",
      time: "02:00 PM",
      location: "Digital Library",
      attendees: "200+",
      category: "Library",
      color: "emerald",
    },
    {
      id: 3,
      title: "Annual Tech Innovation Meetup",
      description:
        "Connect with industry leaders and tech innovators in the biggest technology meetup of the year.",
      image: FCI,
      date: "May 15, 2025",
      time: "10:00 AM",
      location: "Innovation Hub",
      attendees: "750+",
      category: "Technology",
      color: "orange",
    },
    {
      id: 4,
      title: "Creative Design Workshop",
      description:
        "Unleash your creativity with hands-on workshops led by industry professionals.",
      image: FCI,
      date: "June 1, 2025",
      time: "01:00 PM",
      location: "Design Studio",
      attendees: "150+",
      category: "Workshop",
      color: "blue",
    },
    {
      id: 5,
      title: "AI & Machine Learning Symposium",
      description:
        "Explore the future of AI and machine learning with leading researchers and experts.",
      image: FCI,
      date: "July 20, 2025",
      time: "11:00 AM",
      location: "Tech Center",
      attendees: "400+",
      category: "AI/ML",
      color: "indigo",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500 text-blue-500 border-blue-200",
      emerald: "bg-emerald-500 text-emerald-500 border-emerald-200",
      orange: "bg-orange-500 text-orange-500 border-orange-200",
      darkblue: "bg-blue-600 text-blue-600 border-blue-300",
      indigo: "bg-indigo-500 text-indigo-500 border-indigo-200",
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover exciting events, conferences, and opportunities that will
            enhance your academic journey
          </p>
        </div>

        {/* Swiper */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            centeredSlides={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
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
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="simple-swiper"
          >
            {events.map((event) => (
              <SwiperSlide key={event.id}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium text-white rounded-full ${
                          getColorClasses(event.color).split(" ")[0]
                        }`}
                      >
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    {/* Date & Time */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaUsers className="w-3 h-3" />
                        <span>{event.attendees}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FaMapMarkerAlt className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 ${
                        getColorClasses(event.color).split(" ")[2]
                      } ${getColorClasses(event.color).split(" ")[1]} hover:${
                        getColorClasses(event.color).split(" ")[0]
                      } hover:text-white rounded-lg font-medium transition-all duration-300 group`}
                    >
                      <span>Learn More</span>
                      <FaArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FaChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          <button className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FaChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
