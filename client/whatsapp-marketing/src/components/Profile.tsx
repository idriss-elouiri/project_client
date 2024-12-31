"use client";

import React, {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { RootState } from "../redux/store"; // Adjust the path
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "./Header";

type RootState = {
  user: {
    currentUser: {
      _id: string;
      username: string;
      email: string;
      profilePicture: string;
    };
    error: string | null;
    loading: boolean;
  };
};

type FormData = {
  name?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
};

export default function Profile() {
  const { currentUser, error, loading } = useSelector(
    (state: RootState) => state.user
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<
    number | null
  >(null);
  const [imageFileUploadError, setImageFileUploadError] = useState<
    string | null
  >(null);
  const [imageFileUploading, setImageFileUploading] = useState<boolean>(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState<string | null>(
    null
  );
  const [updateUserError, setUpdateUserError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({});
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const dispatch = useDispatch();
  const router = useRouter();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setImageFileUploadError("File size exceeds 2MB");
        return;
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
      setImageFile(null);
      setImageFileUploadProgress(null);
    }
  }, [imageFile]);

  const uploadImage = async () => {
    if (typeof window === "undefined") return; // Prevent SSR issues

    setImageFileUploading(true);
    setImageFileUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + (imageFile?.name || "");
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile as File);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(Number(progress.toFixed(0)));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`${apiUrl}/api/user/update/${currentUser._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
      if (updateUserSuccess) {
        router.push("/Dashboard"); // Adjust the route as needed
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setUpdateUserError(errorMessage);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${apiUrl}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        router.push("/Login");
      }
    } catch (error: any) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        router.push("/Login");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Section du Personnel" />
      <main className="max-w-3xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={filePickerRef}
                hidden
              />
              <div
                className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                onClick={() => filePickerRef.current?.click()}
              >
                {imageFileUploadProgress && (
                  <CircularProgressbar
                    value={imageFileUploadProgress || 0}
                    text={`${imageFileUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                      root: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      },
                      path: {
                        stroke: `rgba(62, 152, 199, ${
                          imageFileUploadProgress / 100
                        })`,
                      },
                    }}
                  />
                )}
                <img
                  src={imageFileUrl || currentUser?.profilePicture}
                  alt="user"
                  className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                    imageFileUploadProgress &&
                    imageFileUploadProgress < 100 &&
                    "opacity-60"
                  }`}
                />
              </div>
              {imageFileUploadError && (
                <div className="text-red-500 text-sm text-center mt-2">
                  {imageFileUploadError}
                </div>
              )}
              <input
                type="text"
                id="name"
                placeholder="Name"
                defaultValue={currentUser?.username}
                onChange={handleChange}
                className={`p-3 border rounded-md text-black ${
                  updateUserError && "border-red-500"
                }`}
              />

              <input
                type="email"
                id="email"
                placeholder="Email"
                defaultValue={currentUser?.email}
                onChange={handleChange}
                className="p-3 border rounded-md text-black"
              />
              <input
                type="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
                className="p-3 border rounded-md text-black"
              />
              <button
                type="submit"
                className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex justify-center items-center"
                disabled={loading || imageFileUploading}
              >
                {loading ? <span className="loader"></span> : "Update"}
              </button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
              <span
                onClick={() => setShowModal(true)}
                className="cursor-pointer"
              >
                Delete Account
              </span>
              <span onClick={handleSignout} className="cursor-pointer">
                Sign Out
              </span>
            </div>
            {updateUserSuccess && (
              <div className="mt-5 text-green-600 text-center">
                {updateUserSuccess}
              </div>
            )}
            {updateUserError && (
              <div className="mt-5 text-red-600 text-center">
                {updateUserError}
              </div>
            )}
            {error && (
              <div className="mt-5 text-red-600 text-center">{error}</div>
            )}
            {showModal && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                  <HiOutlineExclamationCircle className="text-red-500 w-14 h-14 mx-auto" />
                  <h3 className="text-lg font-bold mt-4 text-center">
                    Are you sure you want to delete your account?
                  </h3>
                  <p className="text-center text-sm text-gray-500">
                    This action cannot be undone.
                  </p>
                  <div className="flex justify-center mt-5">
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-200 py-2 px-4 rounded-md mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteUser}
                      className="bg-red-500 text-white py-2 px-4 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
