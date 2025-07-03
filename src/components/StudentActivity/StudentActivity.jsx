import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaCode, FaTrophy, FaGamepad, FaHeart } from "react-icons/fa";
import Group1 from "../../assets/image/group1.jpg";
import Group2 from "../../assets/image/group2.jpg";
import Group3 from "../../assets/image/group3.jpg";
import Group5 from "../../assets/image/group5.jpg";

const activities = [
  {
    id: 1,
    title: "Programming Competitions",
    description:
      "National and international coding competitions developing problem-solving skills.",
    img: Group1,
    icon: <FaCode className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Tech Innovation Fair",
    description:
      "Annual showcase of student projects and cutting-edge technology solutions.",
    img: Group2,
    icon: <FaTrophy className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Gaming & Esports",
    description:
      "Competitive gaming tournaments and game development workshops.",
    img: Group3,
    icon: <FaGamepad className="w-5 h-5" />,
  },
  {
    id: 4,
    title: "Community Outreach",
    description:
      "Teaching technology skills to underserved communities through service projects.",
    img: Group5,
    icon: <FaHeart className="w-5 h-5" />,
  },
];

const StudentActivities = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Student Activities
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Engage in diverse activities that enhance learning and build
            community connections.
          </p>
        </motion.div>

        {/* Activities Grid */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.img}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Icon */}
                <div className="absolute top-4 left-4 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl text-blue-600 dark:text-blue-400">
                  {activity.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Join Our Community
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default StudentActivities;
