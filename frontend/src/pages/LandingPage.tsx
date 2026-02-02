import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const LandingPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const floatingVariants: Variants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden font-primary">
      <Navbar />

      {/* Immersive Breathing Atmosphere */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] -z-10"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] -z-10"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center justify-center p-4 pt-20 relative"
      >
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            variants={itemVariants}
            className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-black tracking-[0.2em] text-blue-400 uppercase mb-4"
          >
            March 20-22, 2026
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-7xl md:text-9xl font-black mb-6 text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 leading-[0.9] tracking-tighter"
          >
            <motion.span
              variants={floatingVariants}
              animate="animate"
              className="inline-block"
            >
              BearHacks <br /> 2026
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-3xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The ultimate hackathon experience.{" "}
            <br className="hidden md:block" />
            <span className="text-white">Build</span>.{" "}
            <span className="text-white">Connect</span>.{" "}
            <span className="text-white">Innovate</span>.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-8">
            {user ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(147,51,234,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/app/apply")}
                  className="w-full md:w-auto px-10 py-5 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl font-black text-xl shadow-2xl border border-white/10"
                >
                  Dashboard
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(59,130,246,0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/app/rsvp")}
                  className="w-full md:w-auto px-10 py-5 bg-gray-800 border-2 border-gray-700 rounded-2xl font-black text-xl transition-all shadow-xl"
                >
                  Check RSVP
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(88,101,242,0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={login}
                className="group relative px-10 py-5 bg-[#5865F2] hover:bg-[#4752C4] rounded-2xl font-black text-xl text-white transition-all shadow-2xl flex items-center gap-4 mx-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <svg
                  className="w-8 h-8 relative z-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                </svg>
                <span className="relative z-10">Login with Discord</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
