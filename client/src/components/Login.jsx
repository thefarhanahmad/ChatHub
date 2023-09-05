import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  // function to login & save User and navigate to chats page
  const loginHandler = async (userData) => {
    // console.log("userdata :", userData);

    // save user in local storage
    const user = userData.name;
    localStorage.setItem("user", JSON.stringify(user));

    // show joined successfull toast
    toast("You Joined successfully", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    // navigate to chats page
    navigate("/chats");
  };

  return (
    // main container
    <div className="w-full bg-gradient-to-r from-indigo-500 from-10% pt-16 via-sky-500 via-30% to-emerald-500 to-90%  h-screen">
      <form action="" onSubmit={handleSubmit(loginHandler)}>
        {/* form container */}
        <div className=" flex flex-col items-center justify-center p-16 w-[90%] sm:w-3/4 md:w-1/2  h-[80vh] m-auto bg-white rounded-lg">
          <h1 className=" text-black  mb-8 text-2xl font-mono font-semibold">
            welcome to <span className="text-4xl">ChatHub!</span>
          </h1>
          {/* input and label */}
          <div className="flex flex-col gap-1 w-full">
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: true })}
              required
              className=" py-3 px-2 border-b border-black outline-none"
            />
          </div>

          <button className="bg-gradient-to-r from-cyan-500 mb-6 to-blue-500  mt-12 px-4 w-full m-auto py-2 text-white rounded-md text-xl">
            Join the Chat
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
