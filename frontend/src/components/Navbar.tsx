import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HoverSpring } from "@/components/motion/MotionComponents";

const Navbar: React.FC = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full p-6 flex justify-between items-center bg-gray-900/50 backdrop-blur-md fixed top-0 left-0 z-10 border-b border-gray-800"
    >
      <HoverSpring
        className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 cursor-pointer"
        onClick={() => navigate("/")}
      >
        BearHacks 2026
      </HoverSpring>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-gray-300 hidden md:block"
            >
              Hello, {user.username}
            </motion.span>
            {user.role === "admin" && (
              <HoverSpring>
                <button
                  onClick={() => navigate("/admin")}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors text-white font-bold"
                >
                  Admin
                </button>
              </HoverSpring>
            )}
            <HoverSpring>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors border border-gray-700"
              >
                Logout
              </button>
            </HoverSpring>
          </div>
        ) : (
          <HoverSpring>
            <button
              onClick={login}
              className="px-6 py-2 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg font-bold text-white text-sm transition-all"
            >
              Login
            </button>
          </HoverSpring>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
