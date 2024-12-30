"use client"

import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

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
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value.trim() }));
  };

  const validateForm = (): boolean => {
    const { username, email, password } = credentials;

    if (!username || !email || !password) {
      setErrorMessage("جميع الحقول مطلوبة.");
      return false;
    }

    if (!/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setErrorMessage("البريد الإلكتروني غير صالح.");
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
      const res = await fetch(
        `${apiUrl}/api/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "فشل التسجيل.");
      } else {
        router.push("/log-in");
      }
    } catch (error) {
      setErrorMessage("حدث خطأ ما. حاول مرة أخرى لاحقًا.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">تسجيل الدخول</h2>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              اسم المستخدم
            </label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={credentials.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "جاري المعالجة..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
