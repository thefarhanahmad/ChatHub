import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSunglasses } from "react-icons/bs";
import { GoLinkExternal } from "react-icons/go";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
const socket = io(process.env.REACT_APP_BASE_URL);

const Chats = () => {
  // states managements
  const { register, handleSubmit, reset } = useForm();
  const chatContainerRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState("");
  const [userJoined, setUserJoined] = useState();

  // show online users
  useEffect(() => {
    socket.on("online-users", (onlineUsers) => {
      // console.log(onlineUsers);
      setOnlineUsers(onlineUsers.msg);
    });

    // user joined the chats
    socket.on("joined-msg", (msg) => {
      // console.log(msg.message);
      setUserJoined(msg.message);
    });
  }, []);
  // Getting user from local storage and setUser
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  // funtion to send message and emit on socket
  const sendMessage = (e) => {
    // console.log("message data", e);
    const msg = e.message;
    socket.emit("send", { msg: msg, sender: user });

    // make input field empty as value = ""; using reset method
    reset();
  };

  // set scrollbar to bottom automatically when new messages arrived
  useEffect(() => {
    // Scroll to the bottom of the chat container when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  // notice to all joined users
  socket.emit("user-joined", user);

  // funtion to get message from socket
  useEffect(() => {
    const getMessage = async () => {
      socket.on("receive", (msg) => {
        setChats((prechats) => [...prechats, msg]);
      });
    };
    getMessage();
  }, []);

  // reaturning UI
  return (
    <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% w-full h-screen p-2 sm:p-6 overflow-hidden box-border">
      <div className="w-full sm:w-3/4 m-auto flex flex-col sm:h-[95vh] h-[98vh]  rounded-lg overflow-hidden">
        {/* header */}
        <div className="bg-[#075985] relative w-full h-[10%] flex  justify-center items-center font-sans font-bold text-white text-3xl">
          <span>
            {/* online users */}
            {onlineUsers && (
              <span className="text-[0.5rem] text-green-400 absolute  left-4 top-[50%] -translate-y-[50%] underline underline-offset-2">
                {onlineUsers}
              </span>
            )}
          </span>
          ChatHub
          <span className="absolute right-4 top-[70%] -translate-y-[50%]  h-[80%]">
            <Link
              to="https://www.linkedin.com/in/farhan-ahmad-21a07524b/"
              className="flex flex-col justify-center items-center"
            >
              <img
                src="https://media.licdn.com/dms/image/D4D03AQHmGAZvxQHd4w/profile-displayphoto-shrink_400_400/0/1675619757656?e=1699488000&v=beta&t=lA6UsjM9C2oxdmn6yUCYvbsjmLADKJDnG6udmBniaWo"
                alt="img"
                width={"25rem"}
                className="rounded-full"
              />
              <div className="text-[0.4rem] -mt-2 flex justify-center items-center gap-1">
                <GoLinkExternal />
                <span>Follow me</span>
              </div>
            </Link>
          </span>
        </div>
        {/*chats messages */}
        <div
          ref={chatContainerRef}
          className="bg-[#BAE6FD] h-[80%] w-full overflow-y-auto relative"
        >
          {/* userjoined message */}
          {userJoined && (
            <div className="text-[0.6rem] font-mono left-[50%] rounded-md px-2 -translate-x-[50%] mt-0 fixed bg-slate-200 ">
              {userJoined}
            </div>
          )}
          {chats.map((chat, i) => {
            return (
              <div
                key={i}
                className={` mx-4 my-3 ${
                  user === chat.sender ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block bg-[#7DD3FC] max-w-[50%] rounded-sm px-2 ${
                    user === chat.sender ? "text-right" : "text-left"
                  }`}
                >
                  <span className="text-xs font-semibold text-[#0C4A6E] ">
                    {chat.sender === user ? "You" : chat.sender}
                  </span>{" "}
                  <br />
                  <span className="text-md font-semibold">{chat.msg}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* chat input */}
        <div className="bg-[#075985] w-full h-[10%] flex justify-center items-center">
          <form onSubmit={handleSubmit(sendMessage)} className="w-full">
            <div className="flex w-full justify-center items-center gap-2">
              <span className="p-2 rounded-full flex justify-center items-center bg-[#0284C7] text-white">
                <BsEmojiSunglasses />
              </span>
              <input
                type="text"
                id="message"
                placeholder="Write your message..."
                {...register("message")}
                className="border-2 w-[80%] rounded-md p-1 px-3 bg-[#E0F2FE]"
              />
              <button className="p-2 rounded-full flex justify-center items-center bg-[#0284C7] text-white">
                <IoMdSend />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chats;
