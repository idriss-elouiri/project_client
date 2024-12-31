"use client";

import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Image from "next/image";

type RootState = {
  user: {
    currentUser: {
      username: string;
      profilePicture: string;
    };
  };
};

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isAdmin = currentUser?.isAdmin;

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 flex py-4 px-4 sm:px-6 lg:px-8 items-center justify-between">
      {/* Logo or Title */}
      <div className="max-w-7xl">
        <Image
          src="/images/DL1 copy-images-1.jpg"
          alt="Description"
          width={100}
          height={50}
          className="custom-class"
        />
      </div>

      {/* Profile Link */}
      <Link href="/Profile" className="flex items-center space-x-4">
        {isAdmin && currentUser?.profilePicture && (
          <Image
            src={currentUser.profilePicture}
            alt="profile"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        )}
      </Link>
    </header>
  );
};

export default Header;
