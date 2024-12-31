"use client";

import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

type Credentials = {
  username: string;
  email: string;
  password: string;
};

export default function Register() {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value.trim() }));
  };

  const validateForm = (): boolean => {
    const { username, email, password } = credentials;

    if (!username || !email || !password) {
      setErrorMessage("All fields are required.");
      return false;
    }

    if (!/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setErrorMessage("Invalid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Registration failed.");
      } else {
        router.push("/Login");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Implement Google Sign-In functionality
    console.log("Google Sign-In clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex max-w-4xl w-full shadow-lg rounded-lg overflow-hidden">
        {/* Left side with image */}

        <div className="hidden md:block w-1/2 bg-blue-600 relative">
          <Image
            src="/images/contact_img.webp"
            alt="Registration Illustration"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
          />
        </div>

        {/* Right side with form */}
        <div className="w-full md:w-1/2 p-8 bg-white">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Register
          </h2>

          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Google Sign-In Button */}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={credentials.username}
                onChange={handleChange}
                className="mt-1 block p-1 w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={credentials.email}
                onChange={handleChange}
                className="mt-1 p-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={handleChange}
                className="mt-1 p-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="mt-2">
              Forgot your password?{" "}
              <a
                href="/reset-password"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset it here
              </a>
            </p>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </form>

          {/* Links for sign-up and password reset */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <Link
                href="/Login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
