import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaUsers, FaCar, FaBars, FaReceipt } from "react-icons/fa";
import { MdBarChart, MdPeople } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

interface User {
  isAdmin?: boolean;
}

interface RootState {
  user: {
    currentUser: User | null;
  };
}

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  color: string;
  href: string;
  visible: boolean;
}

const Sidebar: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isAdmin = currentUser?.isAdmin;

  const SIDEBAR_ITEMS: SidebarItem[] = [
    {
      name: "Aperçu",
      icon: MdBarChart,
      color: "#6366f1",
      href: "/Dashboard",
      visible: isAdmin,
    },
    {
      name: "Section Client",
      icon: MdPeople,
      color: "#10B981",
      href: "/Client",
      visible: isAdmin, // Visible uniquement pour les administrateurs
    },
  ].filter((item) => item.visible);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <FaBars size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
