import React from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { FaTasks } from "react-icons/fa";

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="flex h-screen relative bg-[#FFF9F9] overflow-hidden">
      {/* Left Section */}
      <div className="w-full md:w-[50%] text-black flex flex-col justify-center items-center md:items-start p-3 md:pl-32">
        <h1 className="text-3xl font-bold mb-1 text-[#7B1984] flex items-center justify-center gap-2">
          <FaTasks className="w-6 h-6" />
          TaskBuddy
        </h1>
        <p className="mb-10 text-xs text-gray-500 text-center md:text-start">
          Streamline your workflow and track progress effortlessly <br />
          with our all-in-one task management app.
        </p>
        <button
          onClick={login}
          className="text-white bg-black px-8 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <img
            src="/taskBuddy_alter/assets/images/g_logo.png"
            className="h-6 w-6"
            alt="google login"
          />
          <span className="text-lg font-bold">Continue with Google</span>
        </button>
      </div>

      {/* Right Section */}
      <div className="w-[50%] justify-end items-center relative hidden md:flex">
        <div className="z-50 absolute right-[-50%]">
          <img
            src="/taskBuddy_alter/assets/images/taskBuddy.png"
            alt="Task Manager Preview"
            className="max-w-none !w-[920px] rounded-2xl"
          />
        </div>
        <div className="absolute left-[-10%]">
          <img
            src="/taskBuddy_alter/assets/images/circles_bg.png"
            alt="Task Manager Preview"
            className="w-[600px] h-[540px] object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Small decorative circles */}
      <img
        src="/taskBuddy_alter/assets/images/circles_bg.png"
        alt="Decorative Circle"
        className="absolute top-[-10%] right-[-20%] w-[40%] object-cover md:hidden"
      />

      <img
        src="/taskBuddy_alter/assets/images/circles_bg.png"
        alt="Decorative Circle"
        className="absolute left-[-30%] top-[20%] w-[40%] object-cover md:hidden"
      />

      <img
        src="/taskBuddy_alter/assets/images/circles_bg.png"
        alt="Decorative Circle"
        className="absolute bottom-10 left-[30%] w-[40%] object-cover md:hidden"
      />
    </div>
  );
};

export default LoginPage;
